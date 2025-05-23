import { config } from 'dotenv';
import * as joi from 'joi';

import { resolve } from 'path';

import { ExecModes } from '@common/enums';

const nodeEnv = (process.env.NODE_ENV.trim() as ExecModes) || ExecModes.LOCAL;

const envFile = nodeEnv === ExecModes.PROD ? '.env' : `.env.${nodeEnv}`;

const envPath = resolve(process.cwd(), envFile);

config({ path: envPath });

interface EnvVars {
  PORT: number;

  NODE_ENV: ExecModes;

  DB_URL: string;
  BASE_URL_TALENTS: string;

  JWT_KEY: string;

  ONE_SIGNAL_APP_ID: string;
  ONE_SIGNAL_API_KEY: string;

  OPENAI_API_VERSION: string;
  AZURE_OPENAI_ENDPOINT: string;
  AZURE_OPENAI_API_KEY: string;

  AWS_S3_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),

    NODE_ENV: joi.string().valid(...Object.values(ExecModes)),

    DB_URL: joi.string().required(),
    BASE_URL_TALENTS: joi.string().uri().required(),

    JWT_KEY: joi.string().required(),

    ONE_SIGNAL_APP_ID: joi.string().required(),
    ONE_SIGNAL_API_KEY: joi.string().required(),

    OPENAI_API_VERSION: joi.string().required(),
    AZURE_OPENAI_ENDPOINT: joi.string().required(),
    AZURE_OPENAI_API_KEY: joi.string().required(),

    AWS_S3_REGION: joi.string().required(),
    AWS_ACCESS_KEY_ID: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required(),
    AWS_S3_BUCKET: joi.string().required(),
  })
  .unknown(true);

const result = envSchema.validate(process.env, { abortEarly: false });
const error = result.error;
const value = result.value as EnvVars;

if (error) throw new Error(`Config validation error: \n ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  nodeEnv: envVars.NODE_ENV,

  dbUrl: envVars.DB_URL,
  baseUrlTalents: envVars.BASE_URL_TALENTS,

  jwtKey: envVars.JWT_KEY,

  oneSignalAppId: envVars.ONE_SIGNAL_APP_ID,
  oneSignalApiKey: envVars.ONE_SIGNAL_API_KEY,

  openaiApiVersion: envVars.OPENAI_API_VERSION,
  azureOpenaiEndpoint: envVars.AZURE_OPENAI_ENDPOINT,
  azureOpenaiApiKey: envVars.AZURE_OPENAI_API_KEY,

  awsS3Region: envVars.AWS_S3_REGION,
  awsS3Bucket: envVars.AWS_S3_BUCKET,
};
