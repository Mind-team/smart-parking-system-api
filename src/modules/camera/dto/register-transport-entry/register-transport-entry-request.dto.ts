import { ISO } from '../../../../core/utils/types';

export class RegisterTransportEntryRequestDto {
  plate: string;
  entryTime: ISO;
  parkingId: string;
}
