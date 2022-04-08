import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  Mapper,
} from '../../../infrastructure/database';
import {
  Driver,
  ExistingDriverConstructor,
  IDriver,
} from '../../../core/driver';
import { MongoDriver } from '../schemas';
import { DriverMongoService } from '../collections';
import { ExistingPersonConstructor, Person } from '../../../core/person';

@Injectable()
export class DriverMongoMapperService extends Mapper<IDriver, MongoDriver> {
  constructor(
    @Inject(DatabaseInjectionToken.Driver)
    private readonly driverDB: DriverMongoService,
  ) {
    super();
  }

  async fromDB(id: string): Promise<IDriver> {
    const document = await this.driverDB.findById(id);
    return await this.fromDocument(document);
  }

  async fromDocument(document: MongoDriver): Promise<IDriver> {
    const config: ExistingDriverConstructor = {
      id: document._id,
      transportPlates: document.transportPlates,
      parkingProcessesIds: document.parkingProcessesIds,
    };
    if ('personData' in document && document.personData) {
      // TODO: use person mapper
      const personConfig: ExistingPersonConstructor = {
        phone: document.personData.phone,
        email: document.personData.email,
      };
      config['person'] = new Person(personConfig);
    }
    if (
      'currentParkingProcessesIds' in document &&
      document.currentParkingProcessesIds
    ) {
      config['currentParkingProcessesId'] = document.currentParkingProcessesIds;
    }
    return new Driver(config);
  }

  async toDocument(
    model: IDriver,
    additional: { data: { refreshToken: string } },
  ): Promise<MongoDriver> {
    const modelData = model.privateData();
    if (modelData.personData && !additional?.data?.refreshToken) {
      throw new Error('Не указан refreshToken');
    }
    const document: MongoDriver = {
      _id: modelData.id,
      currentParkingProcessesIds: modelData.currentParkingProcessesIds,
      parkingProcessesIds: modelData.parkingProcessesIds,
      personData: {
        ...modelData.personData,
        refreshToken: additional?.data.refreshToken ?? null,
      },
      transportPlates: modelData.transportPlates,
    };
    return document;
  }
}
