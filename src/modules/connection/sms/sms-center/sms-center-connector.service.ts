import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ISmsConnector } from '../sms-connector.interface';

import axios from 'axios';

@Injectable()
export class SmsCenterConnectorService implements ISmsConnector {
  private readonly endpoint = 'https://smsc.ru/sys/send.php';

  constructor(private readonly configService: ConfigService) {}

  async send(phone: string, text: string): Promise<void> {
    const [login, psw] = [
      this.configService.get('SMSC_LOGIN'),
      this.configService.get('SMSC_PASSWORD'),
    ];
    if (!login || !psw) {
      throw new InternalServerErrorException(
        'Не указаны данные для подключеня в смс сервису',
      );
    }
    await axios
      .get(this.endpoint, {
        params: {
          login,
          psw,
          phones: phone,
          mes: text,
        },
      })
      .catch((err) => {
        console.warn('Не удалось отправить смс', err);
      });
  }
}
