import { Injectable } from '@nestjs/common';
import { CollectionMongoBaseService } from '../abstractions/collection-mongo-base.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionInjectionToken } from '../enums/collection-injection-token.enum';
import { MongoParking, ParkingDocument } from '../schemas';

@Injectable()
export class ParkingMongoService extends CollectionMongoBaseService<MongoParking> {
  constructor(
    @InjectModel(CollectionInjectionToken.Parking)
    parkingModel: Model<ParkingDocument>,
  ) {
    super(parkingModel);
  }
}
