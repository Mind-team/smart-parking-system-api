import { IConnection } from './connection.interface';

export interface ISendCodeOptions {
  /** Длина кода */
  codeLength?: number;
}

export interface ICodeConnection extends IConnection {
  code: (phone: string, options?: ISendCodeOptions) => Promise<void>;
  isCorrectCode: (phone: string, code: string) => Promise<boolean>;
}
