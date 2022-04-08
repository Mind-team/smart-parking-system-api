import { IDriver } from '../interfaces/driver.interface';
import { NewDriverConstructor } from '../types/new-driver-constructor.type';
import { ExistingDriverConstructor } from '../types/existing-driver-constructor.type';
import { IPerson } from '../../person';
import { IParkingProcess } from '../../parking-process';
import { IDriverPrivateData } from '../interfaces/driver-private-data.interface';

import { v4 as uuid } from 'uuid';

export class Driver implements IDriver {
  private readonly id: string;
  private readonly transportPlates: string[] = [];
  private readonly parkingProcessesIds: string[] = [];
  private readonly person?: IPerson;
  private currentParkingProcessesId: string[] = [];

  constructor(config: NewDriverConstructor | ExistingDriverConstructor) {
    this.validateConfig(config);
    this.transportPlates = config.transportPlates;
    this.parkingProcessesIds = config.parkingProcessesIds;
    if ('person' in config && config.person) {
      this.person = config.person;
    }
    if (
      'currentParkingProcessesId' in config &&
      config.currentParkingProcessesId
    ) {
      this.currentParkingProcessesId = config.currentParkingProcessesId;
    }
    if ('id' in config && config.id) {
      this.id = config.id;
    } else {
      this.id = uuid();
    }
  }

  assignParkingProcess(pp: IParkingProcess) {
    const data = pp.privateData();
    if (data.transport.driverId !== this.id) {
      // TODO:
      throw new Error('');
    }
    if (!data.isCompleted) {
      this.currentParkingProcessesId.push(data.id);
      return;
    }
    this.parkingProcessesIds.push(data.id);
  }

  completeParkingProcess(ppId: string) {
    const pp = this.currentParkingProcessesId.find((el) => el === ppId);
    if (!pp) {
      // TODO:
      throw new Error('');
    }
    this.parkingProcessesIds.push(pp);
    this.currentParkingProcessesId = this.currentParkingProcessesId.filter(
      (id) => id !== ppId,
    );
  }

  isHasActiveParkingProcess() {
    return !!this.currentParkingProcessesId.length;
  }

  privateData(): IDriverPrivateData {
    const res: IDriverPrivateData = {
      id: this.id,
      transportPlates: this.transportPlates,
      parkingProcessesIds: this.parkingProcessesIds,
      currentParkingProcessesIds: this.currentParkingProcessesId,
    };
    if (this.person) {
      res['personData'] = this.person.privateData();
    }
    return res;
  }

  private validateConfig(
    config: NewDriverConstructor | ExistingDriverConstructor,
  ) {
    if (
      !(
        'transportPlates' in config &&
        config.transportPlates &&
        config.transportPlates.length > 0
      )
    ) {
    }
    if (!('parkingProcessesIds' in config && config.parkingProcessesIds)) {
    }
  }
}
