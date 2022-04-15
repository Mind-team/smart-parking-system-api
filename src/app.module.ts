import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvVariable } from './infrastructure/environment';
import { DriverModule } from './modules/driver';
import { CameraModule } from './modules/camera';
import { AuthModule } from './modules/auth';
import { ParkingOwnerModule } from './modules/parking-owner';
import { CrmParkingOwnerModule } from './modules/crm-parking-owner';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      new ConfigService().get(EnvVariable.DatabaseConnectionLink),
    ),
    DriverModule,
    CameraModule,
    AuthModule,
    ParkingOwnerModule,
    CrmParkingOwnerModule,
  ],
})
export class AppModule {}
