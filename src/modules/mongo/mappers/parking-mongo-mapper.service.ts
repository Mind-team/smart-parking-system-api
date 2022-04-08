import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  Mapper,
  MapperInjectionToken,
} from '../../../infrastructure/database';
import {
  ExistingParkingConstructor,
  IParking,
  Parking,
} from '../../../core/parking';
import { MongoParking } from '../schemas';
import { ParkingMongoService } from '../collections';
import { ParkingProcessMongoMapperService } from './parking-process-mongo-mapper.service';

@Injectable()
export class ParkingMongoMapperService extends Mapper<IParking, MongoParking> {
  constructor(
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ParkingMongoService,
    @Inject(MapperInjectionToken.ParkingProcess)
    private readonly parkingProcessMapper: ParkingProcessMongoMapperService,
  ) {
    super();
  }

  async fromDB(id: string): Promise<IParking> {
    const document = await this.parkingDB.findById(id);
    return await this.fromDocument(document);
  }

  async fromDocument(document: MongoParking): Promise<IParking> {
    const activeParkingProcessModels = await Promise.all(
      document.activeParkingProcessIds.map(async (id) => {
        return await this.parkingProcessMapper.fromDB(id, {
          documents: { parking: document },
          options: { isNotThrowError: true },
        });
      }),
    );

    const config: ExistingParkingConstructor = {
      id: document._id,
      title: document.title,
      ownerId: document.ownerId,
      activeParkingProcess: activeParkingProcessModels,
    };
    return new Parking(config);
  }

  async toDocument(model: IParking): Promise<MongoParking> {
    const modelData = model.privateData();
    const document: MongoParking = {
      _id: modelData.id,
      title: modelData.title,
      ownerId: modelData.ownerId,
      activeParkingProcessIds: modelData.activeParkingProcessIds,
    };
    return document;
  }
}
