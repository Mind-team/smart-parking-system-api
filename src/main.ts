import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

import { EnvVariable } from './infrastructure/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning();

  const APP_VERSION = process.env.npm_package_version;

  const config = new DocumentBuilder()
    .setTitle('SPS API')
    .setDescription('Server API description')
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'SPS API',
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, customOptions);

  await app.listen(configService.get(EnvVariable.Port) || 5000);
}
bootstrap();
