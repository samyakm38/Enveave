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
      console.log("Test: Admin signup")
      const response = await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);


      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Admin registered successfully');
      expect(response.body.admin.name).toBe(mockAdmin.name);
      expect(response.body.admin.email).toBe(mockAdmin.email);
      expect(response.body.token).toBeDefined();
      expect(response.body.admin.password).toBeUndefined(); // Password should not be returned
      console.log("Test: Admin signup successful")
    });
    
    it('should not register an admin with an existing email', async () => {
      // First create an admin
      console.log("should not register an admin with an existing email")
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to create another with the same email
      const response = await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);

      // console.log(response.status);
      // console.log(response.body.message)
      
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Admin with this email already exists');
      console.log("register an admin with an existing email success")
    });
    
    it('should login an existing admin', async () => {
      // First register an admin
      console.log("Test admin login")
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockAdmin.email,
          password: mockAdmin.password
        });
      // console.log(response.status, response.body.message, response.body.token)
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin logged in successfully');
      expect(response.body.token).toBeDefined();
      console.log("Test admin login successfully");
    });
    
    it('should not login with incorrect password', async () => {
      // First register an admin
      console.log("Test: login with incorrect password")
      await request(app)
        .post('/api/auth/admin/signup')
        .send(mockAdmin);
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockAdmin.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
      console.log("login with incorrect password successfully");
    });
  });

  // Opportunity Provider authentication tests
  describe('Opportunity Provider Authentication', () => {
    it('should register a new opportunity provider', async () => {
      console.log("Test sign up opportunity provider ")
      const response = await request(app)
        .post('/api/auth/opportunity-provider/signup')
        .send(mockProvider);

      // console.log(response.status, response.body.message, response.body.email, response.body.otp)


       const response_verify_otp = await request(app)
          .post('/api/auth/opportunity-provider/verify-otp')
          .send({
            email: mockProvider.contactPerson.email,
            otp: response.body.otp
          });
      
      expect(response_verify_otp.status).toBe(200);
      expect(response_verify_otp.body.message).toBe('Account verified and created successfully! Please log in.');
      console.log("sign up opportunity provider successful")
    });
    

    
    it('should login an existing provider', async () => {
      console.log("Login for opportunity Provider")
      // First register a provider
      const response_signup = await request(app)
          .post('/api/auth/opportunity-provider/signup')
          .send(mockProvider);

      const response_verify_otp = await request(app)
          .post('/api/auth/opportunity-provider/verify-otp')
          .send({
            email: mockProvider.contactPerson.email,
            otp: response_signup.body.otp
          });
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockProvider.contactPerson.email,
          password: mockProvider.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Opportunity Provider logged in successfully');
      expect(response.body.token).toBeDefined();
      console.log("Login for opportunity Provider successfully");

    });
    
    it('should not login with incorrect password', async () => {
      console.log("login with incorrect password for opportunity Provider")
      // First register a provider
      const response_signup = await request(app)
          .post('/api/auth/opportunity-provider/signup')
          .send(mockProvider);

      const response_verify_otp = await request(app)
          .post('/api/auth/opportunity-provider/verify-otp')
          .send({
            email: mockProvider.contactPerson.email,
            otp: response_signup.body.otp
          });
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockProvider.contactPerson.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
      console.log("login with incorrect password for opportunity Provider success")
    });
  });

  // Volunteer authentication tests
  describe('Volunteer Authentication', () => {
    it('should register a new volunteer', async () => {
      console.log('Test: sign up volunteer')
      const response_signup = await request(app)
        .post('/api/auth/volunteer/signup')
        .send(mockVolunteer);

      const response = await request(app)
          .post('/api/auth/volunteer/verify-otp')
          .send({
            email: mockVolunteer.email,
            otp: response_signup.body.otp
          });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account verified and created successfully! Please log in.');
      console.log("sign up volunteer successfully");
    });
    

    
    it('should login an existing volunteer', async () => {
      console.log('Test: Login volunteer')
      // First register a volunteer
      const response_signup = await request(app)
          .post('/api/auth/volunteer/signup')
          .send(mockVolunteer);

      const response_verify_otp = await request(app)
          .post('/api/auth/volunteer/verify-otp')
          .send({
            email: mockVolunteer.email,
            otp: response_signup.body.otp
          });
      
      // Then try to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockVolunteer.email,
          password: mockVolunteer.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Volunteer logged in successfully');
      expect(response.body.token).toBeDefined();
      console.log("Login volunteer successfully");
    });
    
    it('should not login with incorrect password', async () => {

      console.log('Test: Login volunteer with incorrect password ')
      // First register a volunteer
      const response_signup = await request(app)
          .post('/api/auth/volunteer/signup')
          .send(mockVolunteer);

      const response_verify_otp = await request(app)
          .post('/api/auth/volunteer/verify-otp')
          .send({
            email: mockVolunteer.email,
            otp: response_signup.body.otp
          });
      
      // Then try to login with incorrect password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockVolunteer.email,
          password: 'wrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
      console.log("Login volunteer with incorrect password sucessfully");
    });
  });
});