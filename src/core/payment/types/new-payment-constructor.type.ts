import { Currency } from '../enums/currency.enum';

export type NewPaymentConstructor = {
  readonly beneficiaryProfit: number;
  readonly platformProfit: number;
  readonly currency: Currency;
};
