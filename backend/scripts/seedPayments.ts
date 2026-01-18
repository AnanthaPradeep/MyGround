/**
 * Seed Payment Methods and Rules
 * Usage: tsx scripts/seedPayments.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaymentMethod from '../src/models/PaymentMethod';
import PaymentRule from '../src/models/PaymentRule';

dotenv.config();

const paymentMethods = [
  {
    methodId: 'upi',
    name: 'UPI (Google Pay, PhonePe, Paytm, BHIM)',
    type: 'UPI',
    enabled: true,
    supportedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
    minAmount: 10,
    maxAmount: 1000000,
    regions: ['IN'],
  },
  {
    methodId: 'card',
    name: 'Credit / Debit Cards (Visa, MasterCard, RuPay, AmEx)',
    type: 'CARD',
    enabled: true,
    supportedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
    minAmount: 10,
    maxAmount: 5000000,
    regions: ['GLOBAL'],
  },
  {
    methodId: 'bank_transfer',
    name: 'Bank Transfer (NEFT/RTGS/ACH/Wire)',
    type: 'BANK',
    enabled: true,
    supportedUserTypes: ['PREMIUM', 'INSTITUTION'],
    minAmount: 1000,
    maxAmount: 50000000,
    regions: ['GLOBAL'],
  },
  {
    methodId: 'wallet',
    name: 'Digital Wallets (Apple Pay, Google Pay, PayPal)',
    type: 'WALLET',
    enabled: true,
    supportedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
    minAmount: 10,
    maxAmount: 2000000,
    regions: ['GLOBAL'],
  },
  {
    methodId: 'bnpl',
    name: 'Buy Now Pay Later (BNPL)',
    type: 'BNPL',
    enabled: true,
    supportedUserTypes: ['PREMIUM', 'INSTITUTION'],
    minAmount: 500,
    maxAmount: 1000000,
    regions: ['GLOBAL'],
  },
  {
    methodId: 'offline',
    name: 'Cash & Cheque (Offline Record)',
    type: 'OFFLINE',
    enabled: true,
    supportedUserTypes: ['INSTITUTION'],
    minAmount: 0,
    maxAmount: 100000000,
    regions: ['GLOBAL'],
  },
  {
    methodId: 'crypto',
    name: 'Cryptocurrency (Geo-restricted)',
    type: 'CRYPTO',
    enabled: false,
    supportedUserTypes: ['PREMIUM', 'INSTITUTION'],
    minAmount: 100,
    maxAmount: 10000000,
    regions: ['GLOBAL'],
  },
];

const paymentRules = [
  {
    useCase: 'SUBSCRIPTION',
    allowedMethods: ['upi', 'card', 'wallet'],
    requiresKYC: false,
    requiresPremium: false,
    refundable: true,
    gateway: 'AUTO',
    allowedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'FEATURED_LISTING',
    allowedMethods: ['upi', 'card', 'wallet', 'bank_transfer'],
    requiresKYC: false,
    requiresPremium: true,
    refundable: false,
    gateway: 'AUTO',
    allowedUserTypes: ['PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'AD_PROMOTION',
    allowedMethods: ['upi', 'card', 'wallet', 'bank_transfer'],
    requiresKYC: false,
    requiresPremium: true,
    refundable: false,
    gateway: 'AUTO',
    allowedUserTypes: ['PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'EMD',
    allowedMethods: ['upi', 'card', 'bank_transfer'],
    requiresKYC: true,
    requiresPremium: false,
    refundable: true,
    gateway: 'AUTO',
    allowedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'BOOKING',
    allowedMethods: ['upi', 'card', 'bank_transfer', 'wallet'],
    requiresKYC: true,
    requiresPremium: false,
    refundable: true,
    gateway: 'AUTO',
    allowedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'SERVICE',
    allowedMethods: ['upi', 'card', 'wallet', 'bnpl'],
    requiresKYC: false,
    requiresPremium: false,
    refundable: false,
    gateway: 'AUTO',
    allowedUserTypes: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
  },
  {
    useCase: 'INSTITUTION',
    allowedMethods: ['bank_transfer', 'offline'],
    requiresKYC: true,
    requiresPremium: false,
    refundable: false,
    gateway: 'MANUAL',
    allowedUserTypes: ['INSTITUTION'],
  },
];

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await PaymentMethod.deleteMany({});
    await PaymentRule.deleteMany({});

    await PaymentMethod.insertMany(paymentMethods);
    await PaymentRule.insertMany(paymentRules);

    console.log('✅ Payment methods and rules seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed payments:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
