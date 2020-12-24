import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  configureSwagger,
  configureRequestLimiter,
  runSeeders,
} from './shared/configs/app.config';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await runSeeders();
  configureSwagger(app);
  configureRequestLimiter(app);
  app.use(helmet()); //Securing HTTP Headers

  await app.listen(port);
  Logger.log(`Server running on port ${port}`);
}
bootstrap();
