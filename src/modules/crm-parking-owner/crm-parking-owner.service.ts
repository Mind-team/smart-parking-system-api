import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  ICollection,
} from '../../infrastructure/database';
import { MongoParkingOwner } from '../mongo/schemas/parking-owner.schema';

import { v4 as uuid } from 'uuid';

@Injectable()
export class CrmParkingOwnerService {
  constructor(
    @Inject(DatabaseInjectionToken.ParkingOwner)
    private readonly parkingOwnerDB: ICollection<MongoParkingOwner>,
  ) {}

  async createParkingOwner(login: string, password: string) {
    await this.parkingOwnerDB.save({
      _id: uuid(),
      login,
      password,
      name: 'fake',
    });
  }
}
