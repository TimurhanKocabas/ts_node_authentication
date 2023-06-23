import dotenv from 'dotenv';
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017/?authMechanism=DEFAULT`;

const LOG_LEVEL = process.env.LOG_LEVEL;

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_SECURE = process.env.SMTP_SECURE;

export const config = {
    server: {
        port: SERVER_PORT
    },
    mongo: {
        url: MONGO_URL
    },
    logging: {
        level: LOG_LEVEL
    },
    smtp: {
        user: SMTP_USER,
        pass: SMTP_PASS,
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE
    }
};
