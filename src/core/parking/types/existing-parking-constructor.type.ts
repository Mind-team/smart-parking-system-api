import { IParkingProcess } from '../../parking-process';

export type ExistingParkingConstructor = {
  id: string;
  title: string;
  ownerId: string;
  activeParkingProcess: IParkingProcess[];
};
