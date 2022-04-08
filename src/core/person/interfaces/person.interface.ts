import { IPersonPrivateData } from './person-private-data.interface';

export interface IPerson {
  privateData: () => IPersonPrivateData;
}
