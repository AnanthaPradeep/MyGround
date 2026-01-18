import crypto from 'crypto';
import { IPaymentMethod, PaymentUserType } from '../models/PaymentMethod';
import { IPaymentRule, PaymentGateway } from '../models/PaymentRule';
import { IUser } from '../models/User';

const INSTITUTION_ROLES = ['ADMIN', 'BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'];

export const resolveUserType = (user: IUser | null): PaymentUserType => {
  if (!user) return 'NON_PREMIUM';
  if (INSTITUTION_ROLES.includes(user.role)) return 'INSTITUTION';
  if (user.isPremium && (!user.premiumUntil || user.premiumUntil > new Date())) return 'PREMIUM';
  return 'NON_PREMIUM';
};

export const isMethodAllowedForUser = (method: IPaymentMethod, userType: PaymentUserType): boolean => {
  return method.supportedUserTypes.includes(userType);
};

export const isRuleAllowedForUser = (rule: IPaymentRule, userType: PaymentUserType): boolean => {
  return rule.allowedUserTypes.includes(userType);
};

export const resolveGateway = (rule: IPaymentRule, method: IPaymentMethod, region?: string): PaymentGateway => {
  if (rule.gateway && rule.gateway !== 'AUTO') return rule.gateway;
  if (method.type === 'UPI' || method.type === 'BANK') return 'RAZORPAY';
  if (region && region.toUpperCase() !== 'IN') return 'STRIPE';
  if (method.type === 'CRYPTO' || method.type === 'OFFLINE') return 'MANUAL';
  return 'STRIPE';
};

export const verifyWebhookSignature = (payload: string, signature: string | undefined, secret: string): boolean => {
  if (!signature) return false;
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const digestBuffer = Buffer.from(digest);
  const signatureBuffer = Buffer.from(signature);
  if (digestBuffer.length !== signatureBuffer.length) return false;
  return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
};
