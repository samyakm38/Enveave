// config/env.js
import dotenv from 'dotenv';

dotenv.config();

export const env = {
    mongodbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) * 60 * 1000 || 5 * 60 * 1000, // Default 5 minutes in ms
    maxAttempts: parseInt(process.env.MAX_ATTEMPTS) || 3,
};
