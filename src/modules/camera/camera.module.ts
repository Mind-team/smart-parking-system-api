import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { CameraService } from './camera.service';
import { MongoModule } from '../mongo';

@Module({
  imports: [MongoModule],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
