import { IPersonPrivateData } from '../../person';

export interface IDriverPrivateData {
  id: string;
  transportPlates: string[];
  parkingProcessesIds: string[];
  currentParkingProcessesIds: string[];
  personData?: IPersonPrivateData;
}
