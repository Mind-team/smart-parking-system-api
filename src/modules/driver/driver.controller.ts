import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import {
  GetParkingProcessesResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RegistrationRequestDto,
  RegistrationResponseDto,
} from './dto';
import {
  Available,
  AvailableGuard,
  FromAvailableDto,
  Role,
} from '../availability';
import { GetDriverDataResponseDto } from './dto/get-driver-data/get-driver-data-response.dto';

@ApiTags('Водитель')
@Controller('driver-person')
export class DriverController {
  constructor(private readonly service: DriverService) {}

  @Version('1')
  @Post('registration')
  @ApiBody({ type: RegistrationRequestDto })
  @ApiOperation({
    summary: 'Регистрация водителя в ЛК',
    description: 'Создает профиль для водителя в ЛК',
  })
  @ApiCreatedResponse({
    description: 'Все прошло успешно',
    type: RegistrationResponseDto,
  })
  async registrationDriverProfile(@Body() data: RegistrationRequestDto) {
    return await this.service.registrationDriverProfile(
      data.phone,
      data.plates,
      { email: data.email },
    );
  }

  @Version('1')
  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  @ApiOperation({ summary: 'Логин водителя' })
  @ApiCreatedResponse({
    description: 'Данные успешно отправлены',
    type: LoginResponseDto,
  })
  async loginDriverProfile(@Body() data: LoginRequestDto) {
    return await this.service.loginDriverProfile(
      data.phone,
      data.confirmationCode,
    );
  }

  @Version('1')
  @Get('parking-processes')
  @UseGuards(AvailableGuard)
  @Available(Role.AuthorizedUser)
  @ApiOperation({
    summary: 'Получение паркингов пользователя',
    description:
      'По дефолту возвращает все завершенные процессы. Фильтры настраиваются через квери',
  })
  @ApiOkResponse({ type: GetParkingProcessesResponseDto })
  @ApiQuery({ name: 'timeFrom', type: 'string' })
  @ApiQuery({ name: 'timeTo', type: 'string' })
  @ApiQuery({ name: 'limit', type: 'number' })
  @ApiQuery({ name: 'includeUncompleted', type: 'boolean' })
  async parkingProcesses(@Body() data: FromAvailableDto) {
    return await this.service.parkingProcesses(data.guardData.decodedJwt.id);
  }

  @Version('1')
  @Get('parking-processes/:id')
  @UseGuards(AvailableGuard)
  @Available(Role.AuthorizedUser)
  @ApiOperation({
    summary: 'Конкретный паркинг пользователя',
    description: 'id - либо число либо current',
  })
  @ApiOkResponse({ type: GetParkingProcessesResponseDto })
  async parkingProcess(
    @Param('id') id: string,
    @Body() data: FromAvailableDto,
  ) {
    return await this.service.parkingProcessById(
      id,
      data.guardData.decodedJwt.id,
    );
  }

  @Version('1')
  @Get('')
  @UseGuards(AvailableGuard)
  @Available(Role.AuthorizedUser)
  @ApiOperation({
    summary: 'Получение данных водителя',
  })
  @ApiOkResponse({ type: GetDriverDataResponseDto })
  async data(@Body() data: FromAvailableDto) {
    return await this.service.personalData(data.guardData.decodedJwt.id);
  }
}
