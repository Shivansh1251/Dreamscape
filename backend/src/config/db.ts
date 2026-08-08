import mongoose from 'mongoose';
import { logger } from '../logger';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dreamscapes';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info(`MongoDB Connected successfully to ${MONGO_URI}`);
    } catch (error) {
        logger.warn('Failed to connect to MongoDB. Is the database running?');
        logger.warn('App will still start in mock mode, but User profiles & trips won\'t be saved.');
        if (error instanceof Error) {
            logger.error(`MongoDB connection error: ${error.message}`);
        }
    }
};
