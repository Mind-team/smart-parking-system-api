import { NewParkingProcessConstructor } from './new-parking-process-constructor.type';
import { ISO } from '../../utils/types';
import { IPayment } from '../../payment';

export type ExistingParkingProcessConstructor = NewParkingProcessConstructor & {
  departureTime?: ISO;
  id: string;
  payment?: IPayment;
};
