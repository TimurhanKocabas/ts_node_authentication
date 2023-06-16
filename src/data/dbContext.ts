import mongoose from 'mongoose';
import { config } from '../config/config';
import log from '../utils/logger';

async function connectDatabase() {
    try {
        await mongoose.connect(config.mongo.url);
        log.info('Connected to DB');
    } catch (error) {
        log.error(error);
        process.exit(1);
    }
}

export const dbContext = {
    connectDatabase
};
