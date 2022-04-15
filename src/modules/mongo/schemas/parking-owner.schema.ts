import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class MongoParkingOwner {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  name: string;
}

export type ParkingOwnerDocument = MongoParkingOwner & mongoose.Document;
export const ParkingOwnerSchema =
  SchemaFactory.createForClass(MongoParkingOwner);
