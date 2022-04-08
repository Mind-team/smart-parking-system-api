import { IDriver } from '../../../driver';
import { IPerson } from '../../../person';

export interface IDriverMerge {
  merge: (
    drivers: IDriver[],
    otherPlates: string[],
    person: IPerson,
  ) => IDriver;
}
