import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtWrapperService } from './services/jwt-wrapper.service';
import { AuthInjectionToken } from '../../infrastructure/auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConnectionModule } from '../connection';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    JwtModule.register({}),
    ConnectionModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: AuthInjectionToken.JwtService, useClass: JwtWrapperService },
    AuthService,
  ],
  exports: [
    { provide: AuthInjectionToken.JwtService, useClass: JwtWrapperService },
  ],
})
export class AuthModule {}
