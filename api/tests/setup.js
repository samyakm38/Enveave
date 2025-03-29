// Set up global test environment for Jest
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { jest } from '@jest/globals'; // Import jest from @jest/globals for ES modules

dotenv.config();

// Generate a valid MongoDB ObjectId for testing
const validMongoId = new mongoose.Types.ObjectId().toString();

// Connect to the test database before running tests
beforeAll(async () => {
  try {
    // Save original connection URL
    const originalMongoURL = process.env.MONGODB_URL;
    
    // Force using a test database
    process.env.MONGODB_URL = process.env.TEST_MONGODB_URL || 'mongodb://localhost:27017/enveave-test';
    
    await connectDB();
    console.log('Connected to test database:', process.env.MONGODB_URL);
    
    // Store the original URL for restoration after tests
    process.env._ORIGINAL_MONGODB_URL = originalMongoURL;
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
});

// Clear all collections after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Close database connection after all tests finish
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    // Restore original database URL
    if (process.env._ORIGINAL_MONGODB_URL) {
      process.env.MONGODB_URL = process.env._ORIGINAL_MONGODB_URL;
      delete process.env._ORIGINAL_MONGODB_URL;
    }
  }
});

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'invalid-token') throw new Error('Invalid token');
    return { id: validMongoId, role: 'provider' };
  })
}));