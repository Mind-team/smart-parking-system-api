import {
  ICollection,
  Mapper,
  SmartModel,
} from '../../../infrastructure/database';
import { IParking } from '../../../core/parking';
import { MongoParking } from '../schemas';

export class ParkingSmartModelMongo extends SmartModel<IParking, MongoParking> {
  constructor(
    model: IParking,
    collection: ICollection<MongoParking>,
    mapper: Mapper<IParking, MongoParking>,
  ) {
    super(model, collection, mapper);
  }
}
