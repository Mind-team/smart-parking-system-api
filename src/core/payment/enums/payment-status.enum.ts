export enum PaymentStatus {
  /** Не оплачено */
  notPaid,
  /** Оплата в прогрессе */
  inProgress,
  /** Успешная оплата услуги (деньги переведены на счет паркинга) */
  successfulPayment,
  /** Неуспешная оплата услуги (деньги не переведены на счет паркинга) */
  failedPayment,
}
