import { GetDriverDataResponseDto } from '../get-driver-data/get-driver-data-response.dto';

export class LoginRequestDto extends GetDriverDataResponseDto {
  phone: string;
  confirmationCode: string;
}
