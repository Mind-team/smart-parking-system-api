import { IDriverMerge } from './driver-merge.interface';
import { Driver, IDriver, NewDriverConstructor } from '../../../driver';
import { IPerson } from '../../../person';

// TODO: все работает, но нужно заранее определить айдишник и во всех паркинг процессах поставить этот айдишник
// а то сохраняется старый айдишник
export class DriverMerge implements IDriverMerge {
  merge(drivers: IDriver[], otherPlates: string[], person: IPerson): IDriver {
    if (
      drivers.filter((driver) => driver.privateData().personData).length > 0
    ) {
      // TODO:
      throw new Error('уже есть аккаунт');
    }
    const currentParkingProcessesDriver = drivers.filter((driver) =>
      driver.isHasActiveParkingProcess(),
    );
    const parkingProcessesIds: string[] = [];
    const plates: string[] = [];
    drivers.forEach((driver) => {
      const data = driver.privateData();
      parkingProcessesIds.push(...data.parkingProcessesIds);
      plates.push(...data.transportPlates);
    });
    const driversWithCurrentParkings = [];
    currentParkingProcessesDriver.forEach((el) => {
      driversWithCurrentParkings.push(
        ...el.privateData().currentParkingProcessesIds,
      );
    });
    const config: NewDriverConstructor = {
      currentParkingProcessesId: driversWithCurrentParkings,
      parkingProcessesIds: parkingProcessesIds,
      transportPlates: [...plates, ...otherPlates],
      person: person,
    };
    return new Driver(config);
  }
}
