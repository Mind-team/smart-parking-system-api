import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongoModule } from '../mongo';
import { AuthModule } from '../auth';
import { ConnectionModule } from '../connection';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongoModule, AuthModule, ConnectionModule, ConfigModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
