import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ParkingOwnerService } from './parking-owner.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Available,
  AvailableGuard,
  FromAvailableDto,
  Role,
} from '../availability';
import { GetParkingListResponseDto, GetParkingResponseDto } from './dto';
import { GetDriverResponseDto } from './dto/driver/get-driver-response.dto';

@ApiTags('Владелец паркинга')
@Controller('parking-owner')
export class ParkingOwnerController {
  constructor(private readonly parkingOwner: ParkingOwnerService) {}

  @Version('1')
  @Get('parking-list')
  @UseGuards(AvailableGuard)
  @Available(Role.ParkingOwner)
  @ApiOperation({ summary: 'Получение списка паркингов' })
  @ApiOkResponse({ type: GetParkingListResponseDto })
  async parkingList(@Body() data: FromAvailableDto) {
    return await this.parkingOwner.parkingList(
      data.guardData.decodedBasic.login,
    );
  }

  @Version('1')
  @Get('parking/:id')
  @UseGuards(AvailableGuard)
  @Available(Role.ParkingOwner)
  @ApiOperation({ summary: 'Получение конкретного паринга' })
  @ApiOkResponse({ type: GetParkingResponseDto })
  async parking(@Param('id') id: string, @Body() data: FromAvailableDto) {
    return await this.parkingOwner.parking(
      id,
      data.guardData.decodedBasic.login,
    );
  }

  @Version('1')
  @Get('driver')
  @UseGuards(AvailableGuard)
  @Available(Role.ParkingOwner)
  @ApiQuery({ name: 'phone', type: 'string' })
  @ApiOperation({ summary: 'Получение данные водителя' })
  @ApiOkResponse({
    type: GetDriverResponseDto,
    description:
      'Если пользователь зарегистрирован, то точно вернется номер телефон. Если он в лк указал свои данные, то они тоже. Если пользователь не зарегистрирован, то поля будут null',
  })
  async driver(@Query('phone') phone: string) {
    if (!phone || phone.length < 11) {
      throw new BadRequestException('Неправильный формат номера телефона');
    }
    return await this.parkingOwner.driver(phone);
  }
}
