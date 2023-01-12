import { config } from 'dotenv';

config();

const {
  APP_PORT,
  SECRET_KEY,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_CLIENT,
  GYAZO_UPLOAD_API_URL,
  GYAZO_ACCESS_TOKEN,
  EMAIL_USERNAME,
  EMAIL_PASSWORD
} = process.env;

const ENV = {
  APP: {
    API_PATH: '/api',
    PORT: APP_PORT
  },
  JWT: {
    SECRET: SECRET_KEY,
    EXPIRES_IN: '24h'
  },
  DB: {
    DATABASE: DB_NAME,
    USERNAME: DB_USERNAME,
    PASSWORD: DB_PASSWORD,
    HOST: DB_HOST,
    PORT: DB_PORT,
    CLIENT: DB_CLIENT,
    DEBUG: false
  },
  GYAZO: {
    ACCESS_KEY: GYAZO_ACCESS_TOKEN,
    UPLOAD_API_URL: GYAZO_UPLOAD_API_URL,
    FILE_SIZE: 10000000
  },
  EMAIL: {
    HOST: 'mail.binary-studio.com',
    PORT: 465,
    SECURE: true,
    USERNAME: String(EMAIL_USERNAME),
    PASSWORD: String(EMAIL_PASSWORD)
  }
};

export { ENV };
