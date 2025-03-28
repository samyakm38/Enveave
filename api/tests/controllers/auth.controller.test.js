import request from 'supertest';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../../index.js';
import Admin from '../../models/admin.model.js';
import AuthOpportunityProvider from '../../models/auth.opportunityprovider.model.js';
import AuthVolunteer from '../../models/auth.volunteer.model.js';
import * as jsonwebtoken from 'jsonwebtoken';

// Mock bcrypt to avoid actual password hashing during tests
jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedpassword'));
jest.spyOn(bcrypt, 'compare').mockImplementation((plainPwd, hashedPwd) => {
  // Only return true if the password matches our test data
  if (plainPwd === 'adminPassword123' || 
      plainPwd === 'providerPassword123' || 
      plainPwd === 'volunteerPassword123') {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
});

// Mock data
const mockAdmin = {
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'adminPassword123',
  phoneNumber: '+1234567891'
};

const mockProvider = {
  organizationName: 'Test Organization',
  contactPerson: {
    name: 'Test Provider',
    email: 'provider@test.com',
    phoneNumber: '+1234567892'
  },
  password: 'providerPassword123'
};

const mockVolunteer = {
  name: 'Test Volunteer',
  email: 'volunteer@test.com',
  password: 'volunteerPassword123'
};

describe('Authentication Controller Tests', () => {
  // Clear test data before each test
  beforeEach(async () => {
    await Admin.deleteMany({});
    await AuthOpportunityProvider.deleteMany({});
    await AuthVolunteer.deleteMany({});
  });
  
  afterAll(async () => {
    await Admin.deleteMany({});
    await AuthOpportunityProvider.deleteMany({});
    await AuthVolunteer.deleteMany({});
  });

  // Admin authentication tests
  describe('Admin Authentication', () => {
    it('should register a new admin', async () => {
      const response = await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Admin registered successfully');
      expect(response.body.admin.name).toBe(mockAdmin.name);
      expect(response.body.admin.email).toBe(mockAdmin.email);
      expect(response.body.token).toBeDefined();
      expect(response.body.admin.password).toBeUndefined(); // Password should not be returned
    });
    
    it('should not register an admin with an existing email', async () => {
      // First create an admin
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to create another with the same email
      const response = await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
    
    it('should login an existing admin', async () => {
      // First register an admin
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: mockAdmin.email,
          password: mockAdmin.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin logged in successfully');
      expect(response.body.token).toBeDefined();
    });
    
    it('should not login with incorrect password', async () => {
      // First register an admin
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: mockAdmin.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  // Opportunity Provider authentication tests
  describe('Opportunity Provider Authentication', () => {
    it('should register a new opportunity provider', async () => {
      const response = await request(app)
        .post('/api/auth/provider/signup')
        .send(mockProvider);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Opportunity Provider registered successfully');
      expect(response.body.provider.organizationName).toBe(mockProvider.organizationName);
      expect(response.body.provider.contactPerson.email).toBe(mockProvider.contactPerson.email);
      expect(response.body.token).toBeDefined();
      expect(response.body.provider.password).toBeUndefined(); // Password should not be returned
    });
    
    it('should not register a provider with an existing email', async () => {
      // First create a provider
      await request(app)
        .post('/api/auth/provider/signup')
        .send(mockProvider);
      
      // Then try to create another with the same email
      const response = await request(app)
        .post('/api/auth/provider/signup')
        .send(mockProvider);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
    
    it('should login an existing provider', async () => {
      // First register a provider
      await request(app)
        .post('/api/auth/provider/signup')
        .send(mockProvider);
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/opportunity-provider/login')
        .send({
          email: mockProvider.contactPerson.email,
          password: mockProvider.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Opportunity Provider logged in successfully');
      expect(response.body.token).toBeDefined();
    });
    
    it('should not login with incorrect password', async () => {
      // First register a provider
      await request(app)
        .post('/api/auth/provider/signup')
        .send(mockProvider);
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/opportunity-provider/login')
        .send({
          email: mockProvider.contactPerson.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  // Volunteer authentication tests
  describe('Volunteer Authentication', () => {
    it('should register a new volunteer', async () => {
      const response = await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Volunteer registered successfully');
      expect(response.body.volunteer.name).toBe(mockVolunteer.name);
      expect(response.body.volunteer.email).toBe(mockVolunteer.email);
      expect(response.body.token).toBeDefined();
      expect(response.body.volunteer.password).toBeUndefined(); // Password should not be returned
    });
    
    it('should not register a volunteer with an existing email', async () => {
      // First create a volunteer
      await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);
      
      // Then try to create another with the same email
      const response = await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
    
    it('should login an existing volunteer', async () => {
      // First register a volunteer
      await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/volunteer/login')
        .send({
          email: mockVolunteer.email,
          password: mockVolunteer.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Volunteer logged in successfully');
      expect(response.body.token).toBeDefined();
    });
    
    it('should not login with incorrect password', async () => {
      // First register a volunteer
      await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/volunteer/login')
        .send({
          email: mockVolunteer.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});