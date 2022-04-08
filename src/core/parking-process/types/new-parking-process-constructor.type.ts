import { ISO } from '../../utils/types';

export type NewParkingProcessConstructor = {
  entryTime: ISO;
  parking: { id: string; title: string };
  transport: { driverId: string; plate: string };
};
