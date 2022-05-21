import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Put, Version } from '@nestjs/common';
import { RefreshTokenRequestDto, SendConfirmationCodeRequestDto } from './dto';
import { AuthService } from './auth.service';
import { RefreshTokenResponseDto } from './dto/refresh/refresh-token-response.dto';

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

  @Version('1')
  @Put('refresh')
  @ApiOperation({
    summary: 'Рефреш токена',
  })
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  async refreshToken(@Body() data: RefreshTokenRequestDto) {
    return await this.service.refreshToken(data.refreshToken);
  }
}
