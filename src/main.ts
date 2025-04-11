import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { envs } from './modules/config/envs';

const logger = new Logger('App');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.use(compression());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(envs.port);
  logger.log(
    `Server running on http://localhost:${envs.port} 🚀 in ${envs.nodeEnv}`,
  );
}

void bootstrap();
