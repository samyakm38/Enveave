// File: __tests__/provider.volunteer.test.js (or similar path)

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; // Adjust the path to your main app export
import Volunteer from '../../models/volunteer.model.js';
import AuthVolunteer from '../../models/auth.volunteer.model.js';
import {beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals'; // Ensure jest is imported if needed for mocking within the test file itself

// Use the mocked jwt verify from setupTests.js
// We will rely on the setupTests.js mock for most cases.
// If we needed fine-grained control per test, we'd mock here.

describe('GET /api/provider/volunteers/:id', () => {
    let providerToken;
    let volunteerAuthId;
    let volunteerId;
    let testVolunteerData;
    let testAuthVolunteerData;

    // Use the validMongoId generated in setupTests.js if available, or generate one
    const setupValidMongoId = new mongoose.Types.ObjectId().toString();

    beforeAll(() => {
        // The mock JWT setup uses a fixed ID, let's align or generate dynamically
        // Assuming the mock uses setupValidMongoId for the 'provider' user ID
        providerToken = 'Bearer mock-valid-provider-token'; // Token value doesn't matter due to mock
    });

    // Create fresh volunteer data before each test in this suite
    beforeEach(async () => {
        // 1. Create AuthVolunteer
        testAuthVolunteerData = {
            _id: new mongoose.Types.ObjectId(), // Generate specific ID for linking
            name: 'Test Volunteer User',
            email: `test.volunteer.${Date.now()}@example.com`, // Ensure unique email
            password: 'hashedpassword', // In reality, this would be hashed
            profileStatus: 'COMPLETED',
        };
        const createdAuthVolunteer = await AuthVolunteer.create(testAuthVolunteerData);
        volunteerAuthId = createdAuthVolunteer._id;

        // 2. Create Volunteer linked to AuthVolunteer
        testVolunteerData = {
            auth: volunteerAuthId,
            profilePhoto: '/images/test-photo.jpg',
            basicDetails: {
                phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`, // Unique phone
                dateOfBirth: new Date('1995-06-15'),
                gender: 'Female',
                location: {
                    pincode: '12345',
                    state: 'Test State',
                    city: 'Test City',
                    address: '123 Test St',
                },
            },
            interests: {
                causes: ['Environmental Conservation', 'Waste Management'],
                skills: ['Data Collection & Analysis', 'Community Outreach'],
            },
            engagement: {
                availability: ['Weekly', 'On Weekends Only'],
                motivations: ['Personal Interest', 'Civic Responsibility'],
                hasPreviousExperience: true,
                previousExperience: 'Volunteered at local park cleanup.',
            },
            profileCompletion: {
                step1: true,
                step2: true,
                step3: true,
            },
            appliedOpportunities: [] // Assuming empty for this test focus
        };
        const createdVolunteer = await Volunteer.create(testVolunteerData);
        volunteerId = createdVolunteer._id.toString(); // Store the ID as string for API call
    });

    // Clean up database after each test (handled by setupTests.js's afterEach)

    // --- Test Cases ---

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get(`/api/provider/volunteers/${volunteerId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('No token provided');
    });

    it('should return 403 if token is invalid or expired', async () => {
        const response = await request(app)
            .get(`/api/provider/volunteers/${volunteerId}`)
            .set('Authorization', 'Bearer invalid-token'); // Use the token the mock rejects

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid or expired token');
    });

    // This test assumes `requireProvider` middleware is in place and works.
    // Since our global mock *always* returns 'provider', testing the role failure
    // would require temporarily overriding the mock within this test case.
    // For simplicity, we'll trust the global mock ensures provider access for success cases
    // and rely on the 401/403 tests for authentication/token issues.
    // If testing the non-provider role is critical, the mock needs adjustment:
    /*
    it('should return 403 if user role is not provider', async () => {
        // Temporarily override mock for this test
        const jwt = require('jsonwebtoken');
        const originalVerify = jwt.verify; // Store original mock
        jwt.verify = jest.fn().mockImplementation((token) => {
             if (token === 'mock-volunteer-token') return { id: setupValidMongoId, role: 'volunteer' };
             throw new Error('Invalid token');
        });

        const response = await request(app)
            .get(`/api/provider/volunteers/${volunteerId}`)
            .set('Authorization', 'Bearer mock-volunteer-token');

        expect(response.status).toBe(403);
        expect(response.body.message).toContain('Access denied'); // Or specific message from requireProvider

        jwt.verify = originalVerify; // Restore original mock
    });
    */

    it('should return 400 if volunteer ID is invalid', async () => {
        const invalidId = 'invalid-mongo-id-format';
        const response = await request(app)
            .get(`/api/provider/volunteers/${invalidId}`)
            .set('Authorization', providerToken);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid volunteer ID');
    });

    it('should return 404 if volunteer is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString(); // Valid format, but doesn't exist
        const response = await request(app)
            .get(`/api/provider/volunteers/${nonExistentId}`)
            .set('Authorization', providerToken);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Volunteer not found');
    });


    it('should handle volunteers with missing optional fields gracefully (e.g., skills)', async () => {
        // Create a volunteer with no skills defined in interests
        await Volunteer.findByIdAndUpdate(volunteerId, {
            $unset: { 'interests.skills': "" } // Remove the skills array
        });

        // Refetch the auth details as they might not be cached if populated lazily
        const updatedVolunteer = await Volunteer.findById(volunteerId).populate('auth', 'name email');

        const response = await request(app)
            .get(`/api/provider/volunteers/${volunteerId}`)
            .set('Authorization', providerToken);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.skills).toEqual([]); // Expect empty array if skills are missing
        expect(response.body.data.name).toBe(updatedVolunteer.auth.name); // Ensure other data is still correct
    });
});