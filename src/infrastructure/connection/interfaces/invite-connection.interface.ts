import { IConnection } from './connection.interface';

export interface IInviteConnection extends IConnection {
  invite: (
    addressee: string,
    packageName: string,
    role: 'sender' | 'recipient',
  ) => Promise<void>;
}
