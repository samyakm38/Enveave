// config/env.js
import dotenv from 'dotenv';

dotenv.config();


export const env = {
    mongodbUri: process.env.MONGODB_URL,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'enveave-development-secret-key-2024', // Added default secret
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) * 60 * 1000 || 5 * 60 * 1000, // Default 5 minutes in ms
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION) || 3600,
    mongodbTest: process.env.TEST_MONGODB_URL,
    emailHost: process.env.EMAIL_HOST,
    emailPort: parseInt(process.env.EMAIL_PORT),
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailFrom: process.env.EMAIL_FROM,
// Parse EMAIL_SECURE as boolean, default based on common ports
    emailSecure: process.env.EMAIL_SECURE,
};
