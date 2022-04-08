import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ConnectionInjectionToken,
  ICodeConnection,
} from '../../infrastructure/connection';
import { JwtWrapperService } from './services/jwt-wrapper.service';
import {
  DatabaseInjectionToken,
  ICollection,
} from '../../infrastructure/database';
import { AuthInjectionToken } from '../../infrastructure/auth';
import { MongoDriver } from '../mongo/schemas';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConnectionInjectionToken.SMS)
    private readonly smsService: ICodeConnection,
    @Inject(AuthInjectionToken.JwtService)
    private readonly jwtService: JwtWrapperService,
    @Inject(DatabaseInjectionToken.Driver)
    private readonly driverDB: ICollection<MongoDriver>,
  ) {}

  async sendConfirmationSMSCode(phone: string) {
    await this.smsService.code(phone);
  }

  async refreshToken(token: string) {
    const infoFromToken =
      this.jwtService.decodeWithRefreshToken<{ id: string; phone: string }>(
        token,
      );
    if (!infoFromToken.isValid) {
      throw new BadRequestException('Invalid refresh token');
    }
    const driverDocument = await this.driverDB.findById(infoFromToken.data.id);
    if (!driverDocument || driverDocument.personData.refreshToken !== token) {
      throw new BadRequestException('Что-то не так');
    }
    const tokens = this.jwtService.generateTokens({
      id: driverDocument._id,
      phone: driverDocument.personData.phone,
    });
    driverDocument.personData.refreshToken = tokens.refreshToken;
    await this.driverDB.updateOne({ _id: driverDocument._id }, driverDocument);
    return tokens;
  }
}
