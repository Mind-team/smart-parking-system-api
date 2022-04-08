import { Currency } from '../enums/currency.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface IReceipt {
  value: number;
  currency: Currency;
  status: PaymentStatus;
}
