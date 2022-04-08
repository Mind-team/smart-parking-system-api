import { ISO } from '../../utils/types';
import { IReceipt } from '../../payment';

interface IBaseParkingProcessPrivateData {
  id: string;
  parking: {
    id: string;
    title: string;
  };
  transport: {
    driverId: string;
    plate: string;
  };
}

export interface ICompletedParkingProcessPrivateData
  extends IBaseParkingProcessPrivateData {
  time: {
    entry: ISO;
    departure: ISO;
  };
  payment: IReceipt;
  isCompleted: true;
}

export interface IUncompletedParkingProcessPrivateData
  extends IBaseParkingProcessPrivateData {
  time: {
    entry: ISO;
    departure: null;
  };
  isCompleted: false;
}

export interface IAsCompletedParkingProcessPrivateData
  extends IBaseParkingProcessPrivateData {
  time: {
    entry: ISO;
    departure: ISO;
  };
  payment: IReceipt;
  isCompleted: boolean;
}

export type IParkingProcessPrivateData =
  | ICompletedParkingProcessPrivateData
  | IUncompletedParkingProcessPrivateData;
