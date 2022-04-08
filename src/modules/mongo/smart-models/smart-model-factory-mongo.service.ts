import {
  DatabaseInjectionToken,
  ISmartModelFactory,
  MapperInjectionToken,
} from '../../../infrastructure/database';
import { Inject, Injectable } from '@nestjs/common';
import {
  DriverMongoService,
  ParkingMongoService,
  ParkingProcessMongoService,
} from '../collections';
import { IDriver } from '../../../core/driver';
import { DriverSmartModelMongo } from './driver-smart-model-mongo';
import { IParkingProcess } from '../../../core/parking-process';
import { ParkingProcessSmartModelMongo } from './parking-process-smart-model-mongo';
import { IParking } from '../../../core/parking';
import { ParkingSmartModelMongo } from './parking-smart-model-mongo';
import {
  DriverMongoMapperService,
  ParkingMongoMapperService,
  ParkingProcessMongoMapperService,
} from '../mappers';

@Injectable()
export class SmartModelFactoryMongoService implements ISmartModelFactory {
  constructor(
    @Inject(DatabaseInjectionToken.Driver)
    private readonly driverMongo: DriverMongoService,
    @Inject(MapperInjectionToken.Driver)
    private readonly driverMapper: DriverMongoMapperService,
    @Inject(DatabaseInjectionToken.ParkingProcess)
    private readonly parkingProcessMongo: ParkingProcessMongoService,
    @Inject(MapperInjectionToken.ParkingProcess)
    private readonly parkingProcessMapper: ParkingProcessMongoMapperService,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingMongo: ParkingMongoService,
    @Inject(MapperInjectionToken.Parking)
    private readonly parkingMapper: ParkingMongoMapperService,
  ) {}

  async driver(model: IDriver) {
    this.validateModel(model);
    return new DriverSmartModelMongo(
      model,
      this.driverMongo,
      this.driverMapper,
    );
  }

  async parkingProcess(model: IParkingProcess) {
    this.validateModel(model);
    return new ParkingProcessSmartModelMongo(
      model,
      this.parkingProcessMongo,
      this.parkingProcessMapper,
    );
  }

  async parking(model: IParking) {
    this.validateModel(model);
    return new ParkingSmartModelMongo(
      model,
      this.parkingMongo,
      this.parkingMapper,
    );
  }

  private validateModel(model: any) {
    if (!model) {
      // TODO
      throw new Error('');
    }
  }
}
