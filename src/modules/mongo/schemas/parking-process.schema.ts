import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IReceipt } from '../../../core/payment';
import * as mongoose from 'mongoose';

@Schema()
export class MongoParkingProcess {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  parkingId: string;

  @Prop({
    type: { driverId: { type: String }, plate: { type: String } },
    required: true,
  })
  transport: {
    driverId: string;
    plate: string;
  };

  @Prop({
    type: {
      entry: { type: String, required: true },
      departure: { type: String, required: false },
    },
  })
  time: {
    entry: string;
    departure: string | null;
  };

  @Prop({
    type: {
      value: { type: Number, required: false },
      currency: { type: String, required: false },
      status: { type: Number, required: false },
    },
  })
  payment?: IReceipt;

  @Prop({ type: Boolean, required: true })
  isCompleted: boolean;
}

export type ParkingProcessDocument = MongoParkingProcess & mongoose.Document;
export const ParkingProcessSchema =
  SchemaFactory.createForClass(MongoParkingProcess);
