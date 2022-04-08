import { Injectable } from '@nestjs/common';
import { CollectionMongoBaseService } from '../abstractions/collection-mongo-base.abstract';
import { DriverDocument, MongoDriver } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionInjectionToken } from '../enums/collection-injection-token.enum';

@Injectable()
export class DriverMongoService extends CollectionMongoBaseService<MongoDriver> {
  constructor(
    @InjectModel(CollectionInjectionToken.Driver)
    driverModel: Model<DriverDocument>,
  ) {
    super(driverModel);
  }
}
