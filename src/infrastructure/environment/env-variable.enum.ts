export const enum EnvVariable {
  Port = 'PORT',
  DatabaseConnectionLink = 'DB_LINK',
  /** JWT */
  AccessSecret = 'ACCESS_SECRET',
  AccessTokenExpires = 'ACCESS_EXPIRES_IN',
  RefreshSecret = 'REFRESH_SECRET',
  RefreshTokenExpires = 'REFRESH_EXPIRES_IN',
  /** Other */
  SmsEconomyMode = 'SMS_ECONOMY_MODE',
  CrmModeratorKey = 'CRM_MODERATOR_KEY',
}
