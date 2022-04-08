import {
  ICollection,
  Mapper,
  SmartModel,
} from '../../../infrastructure/database';
import { IParkingProcess } from '../../../core/parking-process';
import { MongoParkingProcess } from '../schemas';

export class ParkingProcessSmartModelMongo extends SmartModel<
  IParkingProcess,
  MongoParkingProcess
> {
  constructor(
    model: IParkingProcess,
    collection: ICollection<MongoParkingProcess>,
    mapper: Mapper<IParkingProcess, MongoParkingProcess>,
  ) {
    super(model, collection, mapper);
  }
}
