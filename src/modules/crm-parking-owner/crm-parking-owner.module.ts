import { Module } from '@nestjs/common';
import { AvailabilityModule } from '../availability';
import { MongoModule } from '../mongo';
import { ConfigModule } from '@nestjs/config';
import { CrmParkingOwnerController } from './crm-parking-owner.controller';
import { CrmParkingOwnerService } from './crm-parking-owner.service';
import { AuthModule } from '../auth';

@Module({
  imports: [AvailabilityModule, MongoModule, ConfigModule, AuthModule],
  controllers: [CrmParkingOwnerController],
  providers: [CrmParkingOwnerService],
})
export class CrmParkingOwnerModule {}
