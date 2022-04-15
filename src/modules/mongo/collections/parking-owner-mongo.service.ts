import { Injectable } from '@nestjs/common';
import { CollectionMongoBaseService } from '../abstractions/collection-mongo-base.abstract';
import {
  MongoParkingOwner,
  ParkingOwnerDocument,
} from '../schemas/parking-owner.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CollectionInjectionToken } from '../enums/collection-injection-token.enum';
import { Model } from 'mongoose';

@Injectable()
export class ParkingOwnerMongoService extends CollectionMongoBaseService<MongoParkingOwner> {
  constructor(
    @InjectModel(CollectionInjectionToken.ParkingOwner)
    parkingOwnerModel: Model<ParkingOwnerDocument>,
  ) {
    super(parkingOwnerModel);
  }
}
