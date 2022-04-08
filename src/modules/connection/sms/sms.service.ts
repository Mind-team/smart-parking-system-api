import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICodeConnection,
  IConnection,
  IInviteConnection,
  IMessage,
  ISendCodeOptions,
} from '../../../infrastructure/connection';
import { ISmsConnector } from './sms-connector.interface';
import { SmsConnectorInjectionToken } from './sms-connector-injection-token.enum';
import { EnvVariable } from '../../../infrastructure/environment';

@Injectable()
export class SmsService
  implements IConnection, ICodeConnection, IInviteConnection
{
  private readonly storage: Map<string, { method: 'SMS'; code: string }> =
    new Map<string, { method: 'SMS'; code: string }>();

  constructor(
    @Inject(SmsConnectorInjectionToken.SMSCenter)
    private readonly smsConnector: ISmsConnector,
    private readonly configService: ConfigService,
  ) {}

  async custom(addressee: string, message: IMessage): Promise<void> {
    await this.smsConnector.send(addressee, message.body);
  }

  async code(phone: string, options?: ISendCodeOptions): Promise<void> {
    const isEconomyMode = this.configService.get(EnvVariable.SmsEconomyMode);
    if (isEconomyMode || isEconomyMode === 'true') {
      this.storage.set(phone, { method: 'SMS', code: '0000' });
      return;
    }
    const code = this.randomInteger(1000, 9999);
    this.storage.set(phone, { method: 'SMS', code });
    await this.smsConnector.send(phone, `Ваш код подтверждения: ${code}`);
  }

  async isCorrectCode(phone: string, code: string) {
    if (!this.storage.has(phone)) {
      throw new BadRequestException(
        'Сначала нужно дернуть рест с отправкой кода',
      );
    }
    return this.storage.get(phone).code === code;
  }

  async invite(
    addressee: string,
    packageName: string,
    role: 'sender' | 'recipient',
  ): Promise<void> {
    const message =
      role === 'sender'
        ? `Вам нужно отдать ${packageName}, подробности в приложении BoxGo`
        : `Вам нужно принять ${packageName}, подробности в приложении BoxGo`;
    await this.smsConnector.send(addressee, message);
  }

  private randomInteger(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1)).toString();
  }
}
