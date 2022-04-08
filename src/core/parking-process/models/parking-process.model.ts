import { IParkingProcess } from '../interfaces/parking-process.interface';
import { NewParkingProcessConstructor } from '../types/new-parking-process-constructor.type';
import { ExistingParkingProcessConstructor } from '../types/existing-parking-process-constructor.type';
import {
  IAsCompletedParkingProcessPrivateData,
  ICompletedParkingProcessPrivateData,
  IParkingProcessPrivateData,
  IUncompletedParkingProcessPrivateData,
} from '../interfaces/parking-process-private-data.interface';
import { Currency, IPayment, Payment } from '../../payment';

import { v4 as uuid } from 'uuid';
import { Role } from '../../common';

export class ParkingProcess implements IParkingProcess {
  private readonly id: string;
  private readonly time: { readonly entry: Date; departure?: Date };
  private readonly transport: {
    readonly driverId: string;
    readonly plate: string;
  };
  private readonly parking: {
    readonly id: string;
    readonly title: string;
  };
  private payment?: IPayment;
  private isCompleted: boolean;

  constructor(
    config: NewParkingProcessConstructor | ExistingParkingProcessConstructor,
  ) {
    // TODO:
    //this.validateConfig(config);
    if ('departureTime' in config && config.departureTime) {
      this.time = {
        entry: new Date(config.entryTime),
        departure: new Date(config.departureTime),
      };
      this.isCompleted = true;
    } else {
      this.time = {
        entry: new Date(config.entryTime),
      };
      this.isCompleted = false;
    }
    this.parking = config.parking;
    this.transport = config.transport;
    if ('id' in config && config.id) {
      this.id = config.id;
    } else {
      this.id = uuid();
    }
    if ('payment' in config && config.payment) {
      this.payment = config.payment;
    }
  }

  complete(
    time: Date | string,
    priceCalculator: (intervalMin: number) => number,
  ) {
    this.time.departure = typeof time === 'string' ? new Date(time) : time;
    const interval =
      (this.time.departure.getTime() - this.time.entry.getTime()) / 60_000;
    this.payment = new Payment({
      beneficiaryProfit: priceCalculator(interval),
      platformProfit: 0,
      currency: Currency.Ruble,
    });
    this.isCompleted = true;
  }

  asCompleted(
    priceCalculator: (intervalMin: number) => number,
  ):
    | ICompletedParkingProcessPrivateData
    | IAsCompletedParkingProcessPrivateData {
    if (this.isCompleted) {
      return this.privateData() as ICompletedParkingProcessPrivateData;
    }
    const interval =
      (new Date().getTime() - this.time.entry.getTime()) / 60_000;
    const payment = new Payment({
      beneficiaryProfit: priceCalculator(interval),
      platformProfit: 0,
      currency: Currency.Ruble,
    });
    return {
      id: this.id,
      time: {
        entry: this.time.entry.toISOString(),
        departure: new Date().toISOString(),
      },
      parking: {
        id: this.parking.id,
        title: this.parking.title,
      },
      transport: {
        driverId: this.transport.driverId,
        plate: this.transport.plate,
      },
      payment: payment.receipt(),
      isCompleted: this.isCompleted,
    };
  }

  privateData(initiator?: Role): IParkingProcessPrivateData {
    if (this.isCompleted) {
      const res: ICompletedParkingProcessPrivateData = {
        id: this.id,
        time: {
          entry: this.time.entry.toISOString(),
          departure: this.time.departure.toISOString(),
        },
        parking: {
          id: this.parking.id,
          title: this.parking.title,
        },
        transport: {
          driverId: this.transport.driverId,
          plate: this.transport.plate,
        },
        payment: this.payment?.receipt() ?? null,
        isCompleted: this.isCompleted,
      };
      return res;
    } else {
      const res: IUncompletedParkingProcessPrivateData = {
        id: this.id,
        time: {
          entry: this.time.entry.toISOString(),
          departure: null,
        },
        parking: {
          id: this.parking.id,
          title: this.parking.title,
        },
        transport: {
          driverId: this.transport.driverId,
          plate: this.transport.plate,
        },
        isCompleted: false,
      };
      return res;
    }
  }

  // TODO: implement
  // private validateConfig(
  //   config: NewParkingProcessConstructor | ExistingParkingProcessConstructor,
  // ) {}
}
