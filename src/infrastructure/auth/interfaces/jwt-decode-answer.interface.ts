export interface IJwtDecodeAnswer<T> {
  isValid: boolean;
  data?: T;
}
