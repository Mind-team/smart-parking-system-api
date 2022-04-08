import { Injectable } from '@nestjs/common';
import { CollectionMongoBaseService } from '../abstractions/collection-mongo-base.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionInjectionToken } from '../enums/collection-injection-token.enum';
import { MongoParkingProcess, ParkingProcessDocument } from '../schemas';

@Injectable()
export class ParkingProcessMongoService extends CollectionMongoBaseService<MongoParkingProcess> {
  constructor(
    @InjectModel(CollectionInjectionToken.ParkingProcess)
    parkingProcessModel: Model<ParkingProcessDocument>,
  ) {
    super(parkingProcessModel);
  }
}
