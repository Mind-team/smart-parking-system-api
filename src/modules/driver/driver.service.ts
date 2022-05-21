import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  DatabaseInjectionToken,
  ICollection,
  ISmartModelFactory,
  Mapper,
  MapperInjectionToken,
  SmartModelInjectionToken,
} from '../../infrastructure/database';
import {
  MongoDriver,
  MongoParking,
  MongoParkingProcess,
} from '../mongo/schemas';
import { DriverMerge } from '../../core/utils/driver';
import { NewPersonConstructor, Person } from '../../core/person';
import { DriverMongoMapperService } from '../mongo/mappers';
import { AuthInjectionToken, IJwtService } from '../../infrastructure/auth';
import {
  ConnectionInjectionToken,
  ICodeConnection,
} from '../../infrastructure/connection';
import { IParkingProcess } from '../../core/parking-process';
import { Role } from '../../core/common';

@Injectable()
export class DriverService {
  constructor(
    @Inject(SmartModelInjectionToken.Factory)
    private readonly factory: ISmartModelFactory,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ICollection<MongoParking>,
    @Inject(MapperInjectionToken.ParkingProcess)
    private readonly parkingProcessMapper: Mapper<
      IParkingProcess,
      MongoParkingProcess
    >,
    @Inject(DatabaseInjectionToken.ParkingProcess)
    private readonly parkingProcessDB: ICollection<MongoParkingProcess>,
    @Inject(DatabaseInjectionToken.Driver)
    private readonly driverDB: ICollection<MongoDriver>,
    @Inject(MapperInjectionToken.Driver)
    private readonly driverMapper: DriverMongoMapperService,
    @Inject(AuthInjectionToken.JwtService)
    private readonly jwtService: IJwtService,
    @Inject(ConnectionInjectionToken.SMS)
    private readonly smsService: ICodeConnection,
  ) {}

  async personalData(initiatorId: string) {
    return (await this.driverMapper.fromDB(initiatorId)).privateData();
  }

  async registrationDriverProfile(
    phone: string,
    plates: string[],
    person?: { email?: string },
  ) {
    const unusedInSystemPlates: string[] = [];
    let existingDriverSmartModels = await Promise.all(
      plates.map(async (plate) => {
        const document = await this.driverDB.findOne({
          transportPlates: { $in: [plate] },
        });
        if (!document) {
          unusedInSystemPlates.push(plate);
          return null;
        }
        const model = await this.driverMapper.fromDocument(document);
        return await this.factory.driver(model);
      }),
    );
    existingDriverSmartModels = existingDriverSmartModels.filter((el) => el);
    const merge = new DriverMerge();
    const newPersonConfig: NewPersonConstructor = {
      email: person.email,
      phone,
    };
    const personModel = new Person(newPersonConfig);
    const driverModel = merge.merge(
      existingDriverSmartModels.map((sm) => sm.model),
      unusedInSystemPlates,
      personModel,
    );

    const driverSmartModel = await this.factory.driver(driverModel);

    await Promise.all(
      existingDriverSmartModels.map(async (dsm) => await dsm.delete()),
    );

    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: driverModel.privateData().id,
      phone: driverModel.privateData().personData.phone,
    });

    await driverSmartModel.save(
      await this.driverMapper.toDocument(driverSmartModel.model, {
        data: { refreshToken },
      }),
    );

    return {
      driver: driverSmartModel.model.privateData(),
      accessToken,
      refreshToken,
    };
  }

  async loginDriverProfile(phone: string, code: string) {
    if (!(await this.smsService.isCorrectCode(phone, code))) {
      throw new UnauthorizedException('Неверный код');
    }
    const driverDocument = await this.driverDB.findOne({
      'personData.phone': phone,
    });
    if (!driverDocument) {
      throw new BadRequestException('Такого пользователь не существует');
    }
    const driverModel = await this.driverMapper.fromDocument(driverDocument);

    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: driverDocument._id,
      phone: driverDocument.personData.phone,
    });

    await this.driverDB.updateOne(
      { 'personData.phone': phone },
      await this.driverMapper.toDocument(driverModel, {
        data: { refreshToken },
      }),
    );

    return { ...driverModel.privateData(), accessToken, refreshToken };
  }

  async parkingProcesses(initiatorId: string) {
    const driverModel = await this.driverMapper.fromDB(initiatorId);
    const completedParkingProcessDocuments =
      await this.parkingProcessDB.findManyById(
        driverModel.privateData().parkingProcessesIds,
      );
    const completedParkingProcessModels = await Promise.all(
      completedParkingProcessDocuments.map(async (pp) => {
        return await this.parkingProcessMapper.fromDocument(pp);
      }),
    );
    return completedParkingProcessModels.map((pp) => pp.privateData());
  }

  async parkingProcessById(id: string, initiatorId: string) {
    if (id === 'current') {
      const driverDocument = await this.driverDB.findById(initiatorId);
      const ppDocuments = await this.parkingProcessDB.findManyById(
        driverDocument.currentParkingProcessesIds,
      );
      const ppModels = await Promise.all(
        ppDocuments.map((ppDoc) =>
          this.parkingProcessMapper.fromDocument(ppDoc),
        ),
      );
      return ppModels.map((m) => m.asCompleted((i: number) => i * 20));
    }
    const parkingProcessModel = await this.parkingProcessMapper.fromDB(id);
    const parkingProcessModelData = parkingProcessModel.privateData();
    if (parkingProcessModelData.transport.driverId !== initiatorId) {
      throw new ForbiddenException('Это не ваш парковочный процесс');
    }
    return parkingProcessModel.privateData(Role.Driver);
  }
}
