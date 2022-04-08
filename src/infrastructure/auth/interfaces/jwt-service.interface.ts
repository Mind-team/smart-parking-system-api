import { IJwtDecodeAnswer } from './jwt-decode-answer.interface';

export interface IJwtService {
  decodeWithAccessToken: <T extends Record<string, unknown>>(
    token: string,
  ) => IJwtDecodeAnswer<T>;
  decodeWithRefreshToken: <T extends Record<string, unknown>>(
    token: string,
  ) => IJwtDecodeAnswer<T>;
  generateTokens: (data: { id: string; phone: string }) => {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredDate: string;
    refreshTokenExpiredDate: string;
  };
}
