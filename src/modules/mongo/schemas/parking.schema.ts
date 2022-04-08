import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class MongoParking {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  ownerId: string;

  @Prop({ type: [String], required: true })
  activeParkingProcessIds: string[];
}

export type ParkingDocument = MongoParking & mongoose.Document;
export const ParkingSchema = SchemaFactory.createForClass(MongoParking);
