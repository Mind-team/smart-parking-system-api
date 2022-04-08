import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IJwtService, IJwtDecodeAnswer } from '../../../infrastructure/auth';

import { EnvVariable } from '../../../infrastructure/environment';

@Injectable()
export class JwtWrapperService implements IJwtService {
  private readonly accessSecret = EnvVariable.AccessSecret;
  private readonly accessTokenExpires = EnvVariable.AccessTokenExpires;
  private readonly refreshSecret = EnvVariable.RefreshSecret;
  private readonly refreshTokenExpires = EnvVariable.RefreshTokenExpires;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  decodeWithAccessToken<T extends Record<string, unknown>>(
    token: string,
  ): IJwtDecodeAnswer<T> {
    return this.baseVerifyToken<T>(
      token,
      this.configService.get(this.accessSecret),
    );
  }

  decodeWithRefreshToken<T extends Record<string, any>>(
    token: string,
  ): IJwtDecodeAnswer<T> {
    return this.baseVerifyToken<T>(
      token,
      this.configService.get(this.refreshSecret),
    );
  }

  generateTokens(data: { id: string; phone: string }): {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredDate: string;
    refreshTokenExpiredDate: string;
  } {
    const payload = { ...data };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(this.accessTokenExpires) ?? '15min',
      secret: this.configService.get(this.accessSecret),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(this.refreshTokenExpires) ?? '30d',
      secret: this.configService.get(this.refreshSecret),
    });
    const accessTokenExpiredDate = (
      this.jwtService.decode(accessToken) as { exp: string }
    ).exp;
    const refreshTokenExpiredDate = (
      this.jwtService.decode(refreshToken) as { exp: string }
    ).exp;
    return {
      accessToken,
      refreshToken,
      accessTokenExpiredDate,
      refreshTokenExpiredDate,
    };
  }

  private baseVerifyToken<T extends Record<string, unknown>>(
    token: string,
    secret: string,
  ): IJwtDecodeAnswer<T> {
    try {
      return {
        data: this.jwtService.verify<T>(token, { secret }),
        isValid: true,
      };
    } catch (e) {
      return {
        isValid: false,
      };
    }
  }
}
