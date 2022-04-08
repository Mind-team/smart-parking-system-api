import { SmartModel } from './smart-model.abstract';

import { IDriver } from '../../core/driver';
import { IParkingProcess } from '../../core/parking-process';
import { IParking } from '../../core/parking';

export interface ISmartModelFactory {
  driver: (model: IDriver) => Promise<SmartModel<IDriver, any>>;
  parkingProcess: (
    model: IParkingProcess,
  ) => Promise<SmartModel<IParkingProcess, any>>;
  parking: (model: IParking) => Promise<SmartModel<IParking, any>>;
}
