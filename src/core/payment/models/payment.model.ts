import { IPayment } from '../interfaces/payment.interface';
import { Currency } from '../enums/currency.enum';
import { IReceipt } from '../interfaces/receipt.interface';
import { PaymentStatus } from '../enums/payment-status.enum';
import { NewPaymentConstructor } from '../types/new-payment-constructor.type';
import { ExistingPaymentConstructor } from '../types/existing-payment-constructor.type';

export class Payment implements IPayment {
  private readonly currency: Currency;
  private readonly beneficiaryProfit: number;
  private readonly platformProfit: number;
  private status: PaymentStatus;

  constructor(config: NewPaymentConstructor | ExistingPaymentConstructor) {
    this.currency = config.currency;
    this.beneficiaryProfit = config.beneficiaryProfit;
    this.platformProfit = config.platformProfit;
    if ('status' in config && config.status) {
      this.status = config.status;
    } else {
      this.status = PaymentStatus.notPaid;
    }
  }

  receipt(): IReceipt {
    return {
      value: this.beneficiaryProfit + this.platformProfit,
      currency: this.currency,
      status: this.status,
    };
  }

  startPaymentProcess() {
    if (
      [PaymentStatus.successfulPayment, PaymentStatus.inProgress].includes(
        this.status,
      )
    ) {
      throw new Error('Оплата уже происходит');
    }
    this.status = PaymentStatus.inProgress;
  }

  cancelPaymentProcess() {
    this.status = PaymentStatus.failedPayment;
  }

  completePaymentProcess() {
    this.status = PaymentStatus.successfulPayment;
  }
}
