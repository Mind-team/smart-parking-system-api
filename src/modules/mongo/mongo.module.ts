import { Module } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  MapperInjectionToken,
  SmartModelInjectionToken,
} from '../../infrastructure/database';
import {
  DriverMongoService,
  ParkingMongoService,
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
    provide: MapperInjectionToken.Driver,
    useClass: DriverMongoMapperService,
  },
  {
    provide: DatabaseInjectionToken.ParkingProcess,
    useClass: ParkingProcessMongoService,
  },
  {
    provide: MapperInjectionToken.ParkingProcess,
    useClass: ParkingProcessMongoMapperService,
  },
  {
    provide: DatabaseInjectionToken.Parking,
    useClass: ParkingMongoService,
  },
  {
    provide: MapperInjectionToken.Parking,
    useClass: ParkingMongoMapperService,
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
    ]),
  ],
  providers: providers,
  exports: providers,
})
export class MongoModule {}
