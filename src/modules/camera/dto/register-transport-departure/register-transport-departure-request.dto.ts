import { ISO } from '../../../../core/utils/types';

export class RegisterTransportDepartureRequestDto {
  plate: string;
  departureTime: ISO;
  parkingId: string;
}
