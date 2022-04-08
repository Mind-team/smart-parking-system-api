import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule],
})
export class AvailabilityModule {}
