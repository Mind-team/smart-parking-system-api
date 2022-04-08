import { IDriverPrivateData } from './driver-private-data.interface';
import { IParkingProcess } from '../../parking-process';

export interface IDriver {
  assignParkingProcess: (pp: IParkingProcess) => void;
  privateData: () => IDriverPrivateData;
  completeParkingProcess: (ppId: string) => void;
  isHasActiveParkingProcess: () => boolean;
}
