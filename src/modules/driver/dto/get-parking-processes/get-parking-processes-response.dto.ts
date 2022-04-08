export class GetParkingProcessesResponseDto {
  id: string;
  parking: {
    id: string;
    title: string;
  };
  transport: {
    driverId: string;
    plate: string;
  };
  time: {
    entry: string;
    departure: string;
  };
  payment: {
    value: number;
    currency: string;
    status: number;
  };
  isCompleted: boolean;
}
