import { Body, Controller, Post, Put, Version } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  RegisterTransportDepartureRequestDto,
  RegisterTransportEntryRequestDto,
} from './dto';
import { CameraService } from './camera.service';

@ApiTags('Камера')
@Controller('camera')
export class CameraController {
  constructor(private readonly service: CameraService) {}

  @Version('1')
  @Post('register-entry')
  @ApiBody({ type: RegisterTransportEntryRequestDto })
  @ApiOperation({
    summary: 'Регистрация въезда транспорта',
    description:
      'Запрос отправляет только камера. Рест создает новый парковочный процесс',
  })
  @ApiCreatedResponse({
    description: 'Создан парковочный процесс на переданный номер',
  })
  async registerTransport(@Body() data: RegisterTransportEntryRequestDto) {
    await this.service.startParkingProcess(
      data.plate,
      data.entryTime,
      data.parkingId,
    );
  }

  @Version('1')
  @Put('register-departure')
  @ApiBody({ type: RegisterTransportDepartureRequestDto })
  @ApiOperation({
    summary: 'Регистрация выезда транспорта',
    description: 'Запрос отправляет только камера',
  })
  @ApiOkResponse({ description: 'Регистрация выезда прошла успешно' })
  async registerTransportDeparture(
    @Body() data: RegisterTransportDepartureRequestDto,
  ) {
    await this.service.endParkingProcess(
      data.plate,
      data.departureTime,
      data.parkingId,
    );
  }
}
