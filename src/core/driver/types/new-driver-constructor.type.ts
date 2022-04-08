import { IPerson } from '../../person';

export type NewDriverConstructor = {
  transportPlates: string[];
  parkingProcessesIds: string[];
  person?: IPerson;
  currentParkingProcessesId?: string[];
};
