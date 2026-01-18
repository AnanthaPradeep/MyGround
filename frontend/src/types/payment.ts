export type PaymentUserType = 'NON_PREMIUM' | 'PREMIUM' | 'INSTITUTION';
export type PaymentMethodType = 'UPI' | 'CARD' | 'BANK' | 'WALLET' | 'BNPL' | 'CRYPTO' | 'OFFLINE';
export type PaymentUseCase =
  | 'SUBSCRIPTION'
  | 'FEATURED_LISTING'
  | 'AD_PROMOTION'
  | 'EMD'
  | 'BOOKING'
  | 'SERVICE'
  | 'INSTITUTION';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentMethod {
  methodId: string;
  name: string;
  type: PaymentMethodType;
  enabled: boolean;
  supportedUserTypes: PaymentUserType[];
  minAmount: number;
  maxAmount: number;
  regions: string[];
  fields?: string[];
  providers?: string[];
  upiVpa?: string;
  qrPayload?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
  };
}

export interface PaymentRule {
  useCase: PaymentUseCase;
  allowedMethods: string[];
  requiresKYC: boolean;
  requiresPremium: boolean;
  refundable: boolean;
  gateway: string;
  allowedUserTypes: PaymentUserType[];
}

export interface Payment {
  paymentId: string;
  useCase: PaymentUseCase;
  methodId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  gatewayRef?: string;
  createdAt: string;
}
