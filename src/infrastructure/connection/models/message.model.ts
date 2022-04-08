import { IMessage } from '../interfaces/message.interface';

export class Message implements IMessage {
  constructor(public readonly title: string, public readonly body: string) {}
}
