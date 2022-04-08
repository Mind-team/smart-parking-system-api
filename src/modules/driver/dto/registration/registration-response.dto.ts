export class RegistrationResponseDto {
  id: string;
  transportPlates: string[];
  parkingProcessesIds: string[];
  currentParkingProcessId: string | null;
  personData?: {
    phone: string;
    email?: string;
  };
}
