import { Inject, Injectable } from '@nestjs/common';
import { ISO } from '../../core/utils/types';
import {
  DatabaseInjectionToken,
  ICollection,
  ISmartModelFactory,
  Mapper,
  MapperInjectionToken,
  SmartModel,
  SmartModelInjectionToken,
} from '../../infrastructure/database';
import { IParkingProcess } from '../../core/parking-process';
import {
  MongoParking,
  MongoParkingProcess,
  MongoDriver,
} from '../mongo/schemas';
import { Driver, IDriver, NewDriverConstructor } from '../../core/driver';
import { IParking } from '../../core/parking';

@Injectable()
export class CameraService {
  constructor(
    @Inject(SmartModelInjectionToken.Factory)
    private readonly factory: ISmartModelFactory,
    @Inject(MapperInjectionToken.ParkingProcess)
    private readonly parkingProcessMapper: Mapper<
      IParkingProcess,
      MongoParkingProcess
    >,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ICollection<MongoParking>,
    @Inject(MapperInjectionToken.Parking)
    private readonly parkingMapper: Mapper<IParking, MongoParking>,
    @Inject(DatabaseInjectionToken.Driver)
    private readonly driverDB: ICollection<MongoDriver>,
    @Inject(MapperInjectionToken.Driver)
    private readonly driverMapper: Mapper<IDriver, MongoDriver>,
  ) {}

  async startParkingProcess(plate: string, entryTime: ISO, parkingId: string) {
    const parkingSmartModel = await this.factory.parking(
      await this.parkingMapper.fromDB(parkingId),
    );
    const parkingModel = parkingSmartModel.model;
    const driverDocument = await this.driverDB.findOne({
      transportPlates: { $in: [plate] },
    });
    const driverSmartModel: SmartModel<IDriver, MongoDriver> = driverDocument
      ? await this.factory.driver(
          await this.driverMapper.fromDocument(driverDocument),
        )
      : await this.createDriver(plate);
    const parkingProcessModel = parkingModel.registerTransportEntry(
      plate,
      entryTime,
      driverSmartModel.model,
    );
    const parkingProcessSmartModel = await this.factory.parkingProcess(
      parkingProcessModel,
    );

    await Promise.all([
      parkingSmartModel.update(),
      driverSmartModel.update(),
      parkingProcessSmartModel.save(),
    ]);
  }

  async endParkingProcess(
    plate: string,
    departureTime: string,
    parkingId: string,
  ) {
    const parkingSmartModel = await this.factory.parking(
      await this.parkingMapper.fromDB(parkingId),
    );
    const parkingModel = parkingSmartModel.model;
    const driverDocument = await this.driverDB.findOne({
      transportPlates: { $in: [plate] },
    });
    if (!driverDocument) {
      // TODO;
      throw new Error('');
    }
    const driverSmartModel = await this.factory.driver(
      await this.driverMapper.fromDocument(driverDocument),
    );

    const parkingProcessModel = parkingModel.registerTransportDeparture(
      plate,
      departureTime,
      driverSmartModel.model,
    );
    const parkingProcessSmartModel = await this.factory.parkingProcess(
      parkingProcessModel,
    );

    await Promise.all([
      parkingSmartModel.update(),
      driverSmartModel.update(),
      parkingProcessSmartModel.update(),
    ]);
  }

  private async createDriver(
    plate: string,
  ): Promise<SmartModel<IDriver, MongoDriver>> {
    const config: NewDriverConstructor = {
      parkingProcessesIds: [],
      transportPlates: [plate],
    };
    const driverModel = new Driver(config);
    const driverSmartModel = await this.factory.driver(driverModel);
    await driverSmartModel.save();
    return driverSmartModel;
  }
}
