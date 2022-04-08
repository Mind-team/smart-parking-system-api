import {
  IAsCompletedParkingProcessPrivateData,
  ICompletedParkingProcessPrivateData,
  IParkingProcessPrivateData,
} from './parking-process-private-data.interface';
import { Role } from '../../common';

type PriceCalculator = (intervalMin: number) => number;

export interface IPrivateDataOptions {
  withCurrentParkingProcess: boolean;
}

export interface IParkingProcess {
  complete: (time: Date | string, priceCalculator: PriceCalculator) => void;
  asCompleted: (
    priceCalculator: PriceCalculator,
  ) =>
    | IAsCompletedParkingProcessPrivateData
    | ICompletedParkingProcessPrivateData;
  privateData: (initiator?: Role) => IParkingProcessPrivateData;
}
