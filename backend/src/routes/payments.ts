import express, { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import geoip from 'geoip-lite';
import { v4 as uuidv4 } from 'uuid';
import PaymentMethod from '../models/PaymentMethod';
import PaymentRule from '../models/PaymentRule';
import Payment from '../models/Payment';
import PaymentAuditLog from '../models/PaymentAuditLog';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { resolveUserType, isMethodAllowedForUser, isRuleAllowedForUser, resolveGateway, verifyWebhookSignature } from '../utils/payments';

const router: Router = express.Router();

const getMethodFields = (type: string, userType: 'NON_PREMIUM' | 'PREMIUM' | 'INSTITUTION'): string[] => {
  switch (type) {
    case 'CARD':
      return userType === 'PREMIUM'
        ? ['cardNumber', 'expiry', 'cvv', 'cardholderName', 'saveCard']
        : ['cardNumber', 'expiry', 'cvv', 'cardholderName'];
    case 'UPI':
      return ['upiApp', 'upiId'];
    case 'WALLET':
      return ['walletProvider'];
    case 'BANK':
      return ['accountName', 'accountNumber', 'ifsc', 'bankName', 'referenceNumber', 'proofUpload'];
    case 'BNPL':
      return ['bnplProvider'];
    case 'CRYPTO':
      return ['cryptoWallet'];
    case 'OFFLINE':
      return ['offlineReference', 'proofUpload'];
    default:
      return [];
  }
};

const getMethodProviders = (type: string): string[] => {
  switch (type) {
    case 'CARD':
      return ['Visa', 'MasterCard', 'RuPay', 'AmEx'];
    case 'UPI':
      return ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];
    case 'WALLET':
      return ['Apple Pay', 'Google Pay', 'PayPal'];
    case 'BNPL':
      return ['Simpl', 'Lazypay', 'ZestMoney'];
    default:
      return [];
  }
};

const normalizeCountry = (value: string): string => {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'INDIA') return 'IN';
  if (normalized === 'UNITED STATES' || normalized === 'USA' || normalized === 'US') return 'US';
  if (normalized === 'UNITED KINGDOM' || normalized === 'UK') return 'GB';
  return normalized;
};

const getRegionFromRequest = (req: express.Request, fallback = 'IN'): string => {
  const explicitRaw = req.query.country as string | undefined;
  if (explicitRaw) return normalizeCountry(explicitRaw);
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip;
  const geo = ip ? geoip.lookup(ip) : null;
  return geo?.country || fallback;
};

const buildUpiPayload = (amount: number, currency: string): string | null => {
  const vpa = process.env.UPI_VPA;
  if (!vpa) return null;
  const name = process.env.UPI_NAME || 'MyGround';
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toFixed(2),
    cu: currency || 'INR',
  });
  return `upi://pay?${params.toString()}`;
};

/**
 * @route   GET /api/payments/methods
 * @desc    Get available payment methods for a use-case
 * @access  Private
 */
router.get(
  '/methods',
  authenticate,
  [query('useCase').notEmpty().isString()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const useCase = req.query.useCase as string;
      const amount = Number(req.query.amount || 0);
      const currency = (req.query.currency as string | undefined) || 'INR';
      const region = getRegionFromRequest(req);

      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userType = resolveUserType(user);

      const rule = await PaymentRule.findOne({ useCase });
      if (!rule) {
        return res.status(404).json({ error: 'Payment rule not configured for this use-case' });
      }

      if (!isRuleAllowedForUser(rule, userType)) {
        return res.status(403).json({ error: 'Payment rule not available for this user type' });
      }

      if (rule.requiresPremium && userType !== 'PREMIUM' && userType !== 'INSTITUTION') {
        return res.status(403).json({ error: 'Premium required for this payment use-case' });
      }

      if (rule.requiresKYC && user.kycStatus !== 'VERIFIED') {
        return res.status(403).json({ error: 'KYC verification required' });
      }

      const methods = await PaymentMethod.find({
        enabled: true,
        methodId: { $in: rule.allowedMethods },
        supportedUserTypes: userType,
        regions: { $in: [region, 'GLOBAL'] },
      }).sort({ name: 1 });

      const bankDetails = {
        accountName: process.env.BANK_ACCOUNT_NAME,
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        ifsc: process.env.BANK_IFSC,
        bankName: process.env.BANK_NAME,
      };

      const enrichedMethods = methods.map((method) => {
        const data = method.toObject();
        const upiPayload = data.type === 'UPI' && amount > 0 ? buildUpiPayload(amount, currency) : null;
        return {
          ...data,
          fields: getMethodFields(data.type, userType),
          providers: getMethodProviders(data.type),
          upiVpa: data.type === 'UPI' ? process.env.UPI_VPA : undefined,
          qrPayload: upiPayload || undefined,
          bankDetails: data.type === 'BANK' ? bankDetails : undefined,
        };
      });

      res.json({
        success: true,
        methods: enrichedMethods,
        rule,
        region,
      });
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  }
);

/**
 * @route   POST /api/payments/initiate
 * @desc    Initiate a payment
 * @access  Private
 */
router.post(
  '/initiate',
  authenticate,
  [
    body('useCase').notEmpty().isString(),
    body('methodId').notEmpty().isString(),
    body('amount').isFloat({ min: 1 }),
    body('currency').optional().isString(),
    body('metadata').optional().isObject(),
    body('idempotencyKey').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { useCase, methodId, amount, currency = 'INR', metadata, idempotencyKey } = req.body;
      const region = getRegionFromRequest(req);

      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userType = resolveUserType(user);
      const rule = await PaymentRule.findOne({ useCase });
      if (!rule) {
        return res.status(404).json({ error: 'Payment rule not configured for this use-case' });
      }

      if (!isRuleAllowedForUser(rule, userType)) {
        return res.status(403).json({ error: 'Payment rule not available for this user type' });
      }

      if (rule.requiresPremium && userType !== 'PREMIUM' && userType !== 'INSTITUTION') {
        return res.status(403).json({ error: 'Premium required for this payment use-case' });
      }

      if (rule.requiresKYC && user.kycStatus !== 'VERIFIED') {
        return res.status(403).json({ error: 'KYC verification required' });
      }

      const method = await PaymentMethod.findOne({ methodId, enabled: true });
      if (!method) {
        return res.status(404).json({ error: 'Payment method not available' });
      }

      if (!rule.allowedMethods.includes(methodId)) {
        return res.status(403).json({ error: 'Payment method not allowed for this use-case' });
      }

      if (!isMethodAllowedForUser(method, userType)) {
        return res.status(403).json({ error: 'Payment method not allowed for this user type' });
      }

      if (method.minAmount && amount < method.minAmount) {
        return res.status(400).json({ error: `Amount below minimum limit for ${method.name}` });
      }

      if (method.maxAmount && amount > method.maxAmount) {
        return res.status(400).json({ error: `Amount exceeds maximum limit for ${method.name}` });
      }

      if (idempotencyKey) {
        const existingPayment = await Payment.findOne({ userId: user._id, idempotencyKey, useCase });
        if (existingPayment) {
          return res.json({
            success: true,
            payment: existingPayment,
            idempotent: true,
          });
        }
      }

      const gateway = resolveGateway(rule, method, region);
      const paymentId = `pay_${uuidv4()}`;
      const gatewayRef = `${gateway.toLowerCase()}_${uuidv4()}`;

      const payment = await Payment.create({
        paymentId,
        userId: user._id,
        useCase,
        methodId,
        amount,
        currency,
        status: 'PENDING',
        gateway,
        gatewayRef,
        metadata,
        idempotencyKey,
        region,
      });

      await PaymentAuditLog.create({
        paymentId: payment.paymentId,
        eventType: 'PAYMENT_INITIATED',
        statusTo: 'PENDING',
        actor: user.email,
        payload: { useCase, methodId, amount, currency },
      });

      res.json({
        success: true,
        payment,
        compliance: {
          requiresKYC: rule.requiresKYC,
          requiresPremium: rule.requiresPremium,
          refundable: rule.refundable,
        },
        gateway: {
          provider: gateway,
          reference: gatewayRef,
        },
      });
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  }
);

/**
 * @route   POST /api/payments/webhook
 * @desc    Payment gateway webhook
 * @access  Public (signature verified)
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const signature = req.header('x-mg-signature');
    const secret = process.env.PAYMENTS_WEBHOOK_SECRET || 'dev-webhook-secret';
    const payload = JSON.stringify(req.body || {});

    if (!verifyWebhookSignature(payload, signature, secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { paymentId, gatewayRef, status, eventType = 'WEBHOOK_UPDATE' } = req.body || {};

    if (!paymentId && !gatewayRef) {
      return res.status(400).json({ error: 'paymentId or gatewayRef is required' });
    }

    const payment = await Payment.findOne({
      $or: [{ paymentId }, { gatewayRef }],
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const previousStatus = payment.status;
    if (status && ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'].includes(status)) {
      payment.status = status;
    }

    await payment.save();

    await PaymentAuditLog.create({
      paymentId: payment.paymentId,
      eventType,
      statusFrom: previousStatus,
      statusTo: payment.status,
      actor: 'gateway',
      payload: req.body,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * @route   GET /api/payments/history
 * @desc    Fetch payment history
 * @access  Private
 */
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const status = req.query.status as string | undefined;

    const query: any = { userId: req.user?.userId };
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
