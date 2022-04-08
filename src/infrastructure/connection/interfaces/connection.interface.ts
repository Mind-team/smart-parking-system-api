import { IMessage } from './message.interface';

export interface IConnection {
  custom: (addressee: string, message: IMessage) => Promise<void>;
}
