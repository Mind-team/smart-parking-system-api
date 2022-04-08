import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { IPersonPrivateData } from '../../../core/person';

@Schema()
export class MongoDriver {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({
    type: [String],
    required: true,
    default: [],
    unique: true,
    sparse: true,
  })
  transportPlates: string[];

  @Prop({ type: [String], required: true, default: [] })
  parkingProcessesIds: string[];

  @Prop({ type: [String], required: false, default: [] })
  currentParkingProcessesIds: string[];

  @Prop({
    type: {
      phone: { type: String, required: false },
      email: { type: String, required: false },
      refreshToken: { type: String, required: false },
    },
  })
  personData?: IPersonPrivateData & { refreshToken?: string };
}

export type DriverDocument = MongoDriver & mongoose.Document;
export const DriverSchema = SchemaFactory.createForClass(MongoDriver);
