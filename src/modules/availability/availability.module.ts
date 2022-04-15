import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '../mongo';

@Module({
  imports: [AuthModule, ConfigModule, MongoModule],
})
export class AvailabilityModule {}
