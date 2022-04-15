import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  ICollection,
} from '../../infrastructure/database';
import { MongoParkingOwner } from '../mongo/schemas/parking-owner.schema';
import { MongoParking, MongoParkingProcess } from '../mongo/schemas';

@Injectable()
export class ParkingOwnerService {
  constructor(
    @Inject(DatabaseInjectionToken.ParkingOwner)
    private readonly parkingOwnerDB: ICollection<MongoParkingOwner>,
    @Inject(DatabaseInjectionToken.ParkingProcess)
    private readonly parkingProcessDB: ICollection<MongoParkingProcess>,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ICollection<MongoParking>,
  ) {}

  async parkingList(login: string) {
    const parkingOwnerDB = await this.parkingOwnerDB.findOne({ login });
    const parkingsDB = await this.parkingDB.findMany({
      ownerId: parkingOwnerDB._id,
    });
    return parkingsDB.map((el) => {
      return { ...el, id: el._id };
    });
  }
}
