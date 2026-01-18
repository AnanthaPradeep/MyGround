import api from './api';
import { PaymentMethod, PaymentRule, Payment, PaymentUseCase } from '../types/payment';

export const fetchPaymentMethods = async (useCase: PaymentUseCase, country?: string, amount?: number, currency?: string) => {
  const response = await api.get('/payments/methods', {
    params: { useCase, country, amount, currency },
  });
  return response.data as { methods: PaymentMethod[]; rule: PaymentRule; region: string };
};

export const initiatePayment = async (payload: {
  useCase: PaymentUseCase;
  methodId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}) => {
  const response = await api.post('/payments/initiate', payload);
  return response.data as { payment: Payment; gateway: { provider: string; reference: string } };
};

export const fetchPaymentHistory = async (page = 1, limit = 10) => {
  const response = await api.get('/payments/history', { params: { page, limit } });
  return response.data as { payments: Payment[]; pagination: { page: number; limit: number; total: number; pages: number } };
};
