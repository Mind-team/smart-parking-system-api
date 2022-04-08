import { IMessage } from '../../../infrastructure/connection';

export interface IPushConnector {
  send: (deviceId: string, message: IMessage) => void;
}
