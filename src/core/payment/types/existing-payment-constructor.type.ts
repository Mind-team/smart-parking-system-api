import { PaymentStatus } from '../enums/payment-status.enum';
import { NewPaymentConstructor } from './new-payment-constructor.type';

export type ExistingPaymentConstructor = NewPaymentConstructor & {
  readonly status: PaymentStatus;
};
