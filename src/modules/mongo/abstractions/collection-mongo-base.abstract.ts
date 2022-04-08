import { Model } from 'mongoose';
import { ICollection, IQueryOptions } from '../../../infrastructure/database';

export abstract class CollectionMongoBaseService<T> implements ICollection<T> {
  protected constructor(protected model: Model<any>) {}

  async deleteOne(filter: { [p: string]: any }): Promise<void> {
    await this.model.deleteOne(filter);
  }

  async findById(id: string, options?: IQueryOptions): Promise<T> | null {
    return this.findOne({ _id: id }, options);
  }

  async findOne(
    filter: { [p: string]: any },
    options?: IQueryOptions,
  ): Promise<T> | null {
    return options?.disableLean
      ? this.model.findOne(filter)
      : this.model.findOne(filter).lean();
  }

  async findMany(
    filter: { [p: string]: any },
    options?: IQueryOptions,
  ): Promise<T[]> | null {
    return options?.disableLean
      ? this.model.find(filter)
      : this.model.find(filter).lean();
  }

  async findManyById(
    ids: string[],
    options?: IQueryOptions,
  ): Promise<T[]> | null {
    return options?.disableLean
      ? this.model.find({ _id: { $in: ids } })
      : this.model.find({ _id: { $in: ids } }).lean();
  }

  async save(content: T): Promise<void> {
    await new this.model(content).save();
  }

  async updateOne(filter: { [p: string]: any }, update: T): Promise<void> {
    await this.model.updateOne(filter, update);
  }

  async all(options?: IQueryOptions): Promise<T[]> {
    return options?.disableLean ? this.model.find() : this.model.find().lean();
  }
}
