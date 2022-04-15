import { Module } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  MapperInjectionToken,
  SmartModelInjectionToken,
} from '../../infrastructure/database';
import {
  DriverMongoService,
  ParkingMongoService,
  ParkingOwnerMongoService,
  ParkingProcessMongoService,
} from './collections';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionInjectionToken } from './enums/collection-injection-token.enum';
import { DriverSchema, ParkingProcessSchema, ParkingSchema } from './schemas';
import { SmartModelFactoryMongoService } from './smart-models/smart-model-factory-mongo.service';
import {
  DriverMongoMapperService,
  ParkingMongoMapperService,
  ParkingProcessMongoMapperService,
} from './mappers';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ParkingOwnerSchema } from './schemas/parking-owner.schema';

const mappers: Provider[] = [
  {
    provide: MapperInjectionToken.Driver,
    useClass: DriverMongoMapperService,
  },
  {
    provide: MapperInjectionToken.ParkingProcess,
    useClass: ParkingProcessMongoMapperService,
  },
  {
    provide: MapperInjectionToken.Parking,
    useClass: ParkingMongoMapperService,
  },
];

const providers: Provider[] = [
  {
    provide: SmartModelInjectionToken.Factory,
    useClass: SmartModelFactoryMongoService,
  },
  {
    provide: DatabaseInjectionToken.Driver,
    useClass: DriverMongoService,
  },
  {
    provide: DatabaseInjectionToken.ParkingProcess,
    useClass: ParkingProcessMongoService,
  },
  {
    provide: DatabaseInjectionToken.Parking,
    useClass: ParkingMongoService,
  },
  {
    provide: DatabaseInjectionToken.ParkingOwner,
    useClass: ParkingOwnerMongoService,
  },
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionInjectionToken.Driver, schema: DriverSchema },
      {
        name: CollectionInjectionToken.ParkingProcess,
        schema: ParkingProcessSchema,
      },
      {
        name: CollectionInjectionToken.Parking,
        schema: ParkingSchema,
      },
      {
        name: CollectionInjectionToken.ParkingOwner,
        schema: ParkingOwnerSchema,
      },
    ]),
  ],
  providers: [...mappers, ...providers],
  exports: [...mappers, ...providers],
})
export class MongoModule {}
