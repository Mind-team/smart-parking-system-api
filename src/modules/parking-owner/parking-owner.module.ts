import { Module } from '@nestjs/common';
import { ParkingOwnerController } from './parking-owner.controller';
import { ParkingOwnerService } from './parking-owner.service';
import { MongoModule } from '../mongo';
import { AuthModule } from '../auth';
import { AvailabilityModule } from '../availability';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongoModule, AuthModule, AvailabilityModule, ConfigModule],
  controllers: [ParkingOwnerController],
  providers: [ParkingOwnerService],
})
export class ParkingOwnerModule {}
