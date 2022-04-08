import { IParkingPrivateData } from './parking-private-data.interface';
import { IDriver } from '../../driver';
import { IParkingProcess } from '../../parking-process';

type RegisterTransport = (
  plate: string,
  time: Date | string,
  driver: IDriver,
) => IParkingProcess;

export interface IParking {
  privateData: () => IParkingPrivateData;
  registerTransportEntry: RegisterTransport;
  registerTransportDeparture: RegisterTransport;
}
