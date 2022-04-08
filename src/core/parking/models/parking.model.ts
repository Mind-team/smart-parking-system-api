import { IParking } from '../interfaces/parking.interface';
import { ExistingParkingConstructor } from '../types/existing-parking-constructor.type';
import { IParkingProcess } from '../../parking-process';
import { IParkingPrivateData } from '../interfaces/parking-private-data.interface';
import { IDriver } from '../../driver';
import { ParkingProcess } from '../../parking-process';

export class Parking implements IParking {
  private readonly id: string;
  private readonly title: string;
  private readonly ownerId: string;
  private activeParkingProcess: IParkingProcess[];

  constructor(config: ExistingParkingConstructor) {
    this.id = config.id;
    this.title = config.title;
    this.ownerId = config.ownerId;
    this.activeParkingProcess = config.activeParkingProcess;
  }

  registerTransportEntry(plate: string, time: Date | string, driver: IDriver) {
    const driverData = driver.privateData();
    const isAlreadyInParking = this.activeParkingProcess.some((pp) => {
      const data = pp.privateData();
      return (
        data.transport.plate === plate ||
        data.transport.driverId === driverData.id
      );
    });
    if (isAlreadyInParking) {
      // TODO
      throw new Error('');
    }
    const parkingProcess = new ParkingProcess({
      entryTime: typeof time === 'string' ? time : time.toISOString(),
      parking: { id: this.id, title: this.title },
      transport: { driverId: driverData.id, plate },
    });
    this.activeParkingProcess.push(parkingProcess);
    driver.assignParkingProcess(parkingProcess);
    return parkingProcess;
  }

  registerTransportDeparture(
    plate: string,
    time: Date | string,
    driver: IDriver,
  ) {
    const parkingProcess = this.activeParkingProcess.find(
      (pp) => pp.privateData().transport.plate === plate,
    );
    if (!parkingProcess) {
      // TODO
      throw new Error();
    }
    parkingProcess.complete(time, (interval: number) => interval * 2);
    driver.completeParkingProcess(parkingProcess.privateData().id);
    this.activeParkingProcess = this.activeParkingProcess.filter(
      (pp) => pp.privateData().id !== parkingProcess.privateData().id,
    );
    return parkingProcess;
  }

  privateData(): IParkingPrivateData {
    const res: IParkingPrivateData = {
      id: this.id,
      title: this.title,
      ownerId: this.ownerId,
      activeParkingProcessIds: this.activeParkingProcess.map(
        (pp) => pp.privateData().id,
      ),
    };
    return res;
  }
}
