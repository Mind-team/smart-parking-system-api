import { ISO } from '../../../../core/utils/types';
import { Currency, PaymentStatus } from '../../../../core/payment';

export class GetParkingResponseDto {
  id: string;
  title: string;
  ownerId: string;
  activeParkingProcessIds: string[];
  activeParkingProcess: {
    time: {
      entry: ISO;
      departure: ISO;
    };
    payment: {
      value: number;
      currency: Currency;
      status: PaymentStatus;
    };
    parking: {
      id: string;
      title: string;
    };
    transport: {
      driverId: string;
      plate: string;
    };
    isCompleted: boolean;
  };
}
