import { Module } from '@nestjs/common';
import { SmsConnectorInjectionToken } from './sms/sms-connector-injection-token.enum';
import { SmsCenterConnectorService } from './sms/sms-center/sms-center-connector.service';
import { ConnectionInjectionToken } from '../../infrastructure/connection';
import { SmsService } from './sms/sms.service';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '../mongo';

const thirdParties = [
  {
    provide: SmsConnectorInjectionToken.SMSCenter,
    useClass: SmsCenterConnectorService,
  },
];

const api = [{ provide: ConnectionInjectionToken.SMS, useClass: SmsService }];

@Module({
  imports: [ConfigModule, MongoModule],
  providers: [...thirdParties, ...api],
  exports: api,
})
export class ConnectionModule {}
