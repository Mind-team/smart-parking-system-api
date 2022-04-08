import { MongoDriver } from '../schemas';

import {
  ICollection,
  Mapper,
  SmartModel,
} from '../../../infrastructure/database';
import { IDriver } from '../../../core/driver';

export class DriverSmartModelMongo extends SmartModel<IDriver, MongoDriver> {
  constructor(
    model: IDriver,
    collection: ICollection<MongoDriver>,
    mapper: Mapper<IDriver, MongoDriver>,
  ) {
    super(model, collection, mapper);
  }

  override async update(): Promise<void> {
    // TODO: add include
    const { refreshToken } = (
      await this.collection.findById(this.model.privateData().id)
    ).personData;
    const document = await this.mapper.toDocument(this.model, {
      data: { refreshToken },
    });
    await this.collection.updateOne({ _id: document._id }, document);
  }
}
