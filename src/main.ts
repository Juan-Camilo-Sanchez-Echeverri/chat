import { NestFactory } from '@nestjs/core';

import { NestExpressApplication } from '@nestjs/platform-express';

import {
  ConsoleLogger,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { envs } from '@config/envs';

import { getClassValidatorErrors } from '@common/helpers';

const logger = new ConsoleLogger({ prefix: 'Ml-Chat' });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.use(compression());
  app.use(helmet());

  app.set('trust proxy', true);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors): UnprocessableEntityException => {
        const message = 'Validation failed';
        const errors = getClassValidatorErrors(validationErrors);

        return new UnprocessableEntityException({ message, errors });
      },
    }),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '2.0',
  });

  await app.listen(envs.port);
  logger.log(`Server running on ${await app.getUrl()} 🚀 in ${envs.nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
