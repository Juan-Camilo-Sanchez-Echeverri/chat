declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string | undefined;

    NODE_ENV: string;

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
}
