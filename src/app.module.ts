import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvVariable } from './infrastructure/environment';
import { DriverModule } from './modules/driver';
import { CameraModule } from './modules/camera';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      new ConfigService().get(EnvVariable.DatabaseConnectionLink),
    ),
    DriverModule,
    CameraModule,
    AuthModule,
  ],
})
export class AppModule {}
