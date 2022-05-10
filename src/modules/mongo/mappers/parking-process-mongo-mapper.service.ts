import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseInjectionToken,
  Mapper,
} from '../../../infrastructure/database';
import {
  ExistingParkingProcessConstructor,
  IParkingProcess,
  ParkingProcess,
} from '../../../core/parking-process';
import { MongoParkingProcess, MongoParking } from '../schemas';
import {
  ParkingMongoService,
  ParkingProcessMongoService,
} from '../collections';
import { ExistingPaymentConstructor, Payment } from '../../../core/payment';

@Injectable()
export class ParkingProcessMongoMapperService extends Mapper<
  IParkingProcess,
  MongoParkingProcess
> {
  constructor(
    @Inject(DatabaseInjectionToken.ParkingProcess)
    private readonly parkingProcessDB: ParkingProcessMongoService,
    @Inject(DatabaseInjectionToken.Parking)
    private readonly parkingDB: ParkingMongoService,
  ) {
    super();
  }

  async fromDB(
    id: string,
    additional?: {
      documents?: {
        parking?: MongoParking;
      };
      options?: {
        isNotThrowError?: boolean;
      };
    },
  ): Promise<IParkingProcess> {
    const document = await this.parkingProcessDB.findById(id);
    return await this.fromDocument(document, additional);
  }

  async fromDocument(
    document: MongoParkingProcess,
    additional?: {
      documents?: {
        parking?: MongoParking;
      };
      options?: {
        isNotThrowError?: boolean;
      };
    },
  ): Promise<IParkingProcess> {
    if (!document) {
      if (
        'options' in additional &&
        typeof additional.options?.isNotThrowError === 'boolean'
      ) {
        if (additional.options.isNotThrowError) {
          return null;
        }
      }
      throw new Error('Документ парковочного процесса не найден');
    }

    const parkingDocument =
      additional?.documents.parking ??
      (await this.parkingDB.findById(document.parkingId));

    const config: ExistingParkingProcessConstructor = {
      entryTime: document.time.entry,
      parking: {
        id: parkingDocument._id,
        title: parkingDocument.title,
      },
      transport: {
        driverId: document.transport.driverId,
        plate: document.transport.plate,
      },
      departureTime: document.time.departure,
      id: document._id,
    };
    if (document.payment) {
      const paymentConfig: ExistingPaymentConstructor = {
        beneficiaryProfit: document.payment.value,
        platformProfit: 0,
        currency: document.payment.currency,
        status: document.payment.status,
      };
      config['payment'] = new Payment(paymentConfig);
    }
    return new ParkingProcess(config);
  }

  async toDocument(model: IParkingProcess): Promise<MongoParkingProcess> {
    const modelData = model.privateData();
    const document: MongoParkingProcess = {
      _id: modelData.id,
      parkingId: modelData.parking.id,
      transport: {
        driverId: modelData.transport.driverId,
        plate: modelData.transport.plate,
      },
      time: {
        entry: modelData.time.entry,
        departure: modelData.time.departure,
      },
      isCompleted: modelData.isCompleted,
    };
    if ('payment' in modelData && modelData.payment) {
      document['payment'] = modelData.payment;
    }
    return document;
  }
}
