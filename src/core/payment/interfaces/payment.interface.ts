import { IReceipt } from './receipt.interface';

export interface IPayment {
  /** Метод возвращает главную информацию об оплате для потребителя услуги (водителя) */
  receipt: () => IReceipt;
  /** Плательщик начинает процесс оплаты */
  startPaymentProcess: () => void;
  /** Плательщику по каким-то причинам не удалось произвести оплату */
  cancelPaymentProcess: () => void;
  /** Средства плательщика переведены исполнителю услуг */
  completePaymentProcess: () => void;
}
