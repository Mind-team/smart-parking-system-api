export interface ISmsConnector {
  send: (phone: string, text: string) => Promise<void>;
}
