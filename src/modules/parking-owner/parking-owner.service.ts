import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  DatabaseInjectionToken,
  ICollection,
  Mapper,
  MapperInjectionToken,
} from '../../infrastructure/database';
import { MongoParkingOwner } from '../mongo/schemas/parking-owner.schema';
import { MongoParking, MongoParkingProcess } from '../mongo/schemas';
import { Parking } from '../../core/parking';

@Injectable()
export class ParkingOwnerService {
  constructor(
    @Inject(DatabaseInjectionToken.ParkingOwner)
    private readonly parkingOwnerDB: ICollection<MongoParkingOwner>,
    @Inject(DatabaseInjectionToken.ParkingProcess)
    private readonly parkingProcessDB: ICollection<MongoParkingProcess>,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ICollection<MongoParking>,
    @Inject(MapperInjectionToken.Parking)
    private readonly parkingMapper: Mapper<Parking, MongoParking>,
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

  async parking(id: string, initiatorLogin: string) {
    const parkingOwnerDB = await this.parkingOwnerDB.findOne({
      login: initiatorLogin,
    });
    if (!parkingOwnerDB) {
      throw new BadRequestException('Нет такого пользователя');
    }
    const parkingDB = await this.parkingDB.findById(id);
    if (!parkingDB) {
      throw new BadRequestException('Нет такого паркинга');
    }
    if (parkingDB.ownerId !== parkingOwnerDB._id) {
      throw new UnauthorizedException('Это не ваш паринг');
    }
    const parkingModel = await this.parkingMapper.fromDocument(parkingDB);
    return parkingModel.privateData();
  }
}
