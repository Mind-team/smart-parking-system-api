import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Version } from '@nestjs/common';
import { SendConfirmationCodeRequestDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Version('1')
  @Post('send-code')
  @ApiBody({ type: SendConfirmationCodeRequestDto })
  @ApiOperation({
    summary: 'Отправка подтверждающего кода',
    description: 'На данный момент код можно отправить только по СМС',
  })
  async sendCode(@Body() data: SendConfirmationCodeRequestDto) {
    await this.service.sendConfirmationSMSCode(data.target);
  }
}
