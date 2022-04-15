import { Body, Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ParkingOwnerService } from './parking-owner.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Available,
  AvailableGuard,
  FromAvailableDto,
  Role,
} from '../availability';
import { GetParkingListResponseDto } from './dto';

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
}