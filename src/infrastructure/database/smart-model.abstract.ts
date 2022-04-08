import { ICollection } from './collection.interface';
import { Mapper } from './mapper.abstract';

export abstract class SmartModel<Model, Document extends { _id: string }> {
  protected constructor(
    public readonly model: Model,
    protected readonly collection: ICollection<Document>,
    protected readonly mapper: Mapper<Model, Document>,
  ) {}

  async update(): Promise<void> {
    const document = await this.mapper.toDocument(this.model);
    await this.collection.updateOne({ _id: document._id }, document);
  }

  async save(document?: Document): Promise<void> {
    const doc = document ?? (await this.mapper.toDocument(this.model));
    await this.collection.save(doc);
  }

  async delete(): Promise<void> {
    const document = await this.mapper.toDocument(this.model);
    await this.collection.deleteOne({ _id: document._id });
  }
}
