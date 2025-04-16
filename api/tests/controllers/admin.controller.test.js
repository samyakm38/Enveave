// filepath: d:\Enveave-SDOS\api\tests\admin.controller.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; // Corrected import path assuming app.js is in the parent directory
import Admin from '../../models/admin.model.js';
import AuthVolunteer from '../../models/auth.volunteer.model.js';
import Volunteer from '../../models/volunteer.model.js';
import AuthOpportunityProvider from '../../models/auth.opportunityprovider.model.js';
import OpportunityProvider from '../../models/opportunityprovider.model.js';
import Opportunity from '../../models/opportunity.model.js';
import Story from '../../models/story.model.js';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'; // Import Jest functions
import jwt from "jsonwebtoken";

// --- Mock JWT Verification ---
const mockAdminId = new mongoose.Types.ObjectId().toString();
// We don't need fixed IDs for these anymore, they will be generated
// const mockVolunteerId = new mongoose.Types.ObjectId().toString();
// const mockProviderId = new mongoose.Types.ObjectId().toString();
const adminToken = 'mock-admin-token'; // Use this token for admin requests
const nonAdminToken = 'mock-volunteer-token'; // Use this for non-admin auth checks

// --- Helper Functions ---
const createTestAdmin = async () => {
    // Keep using mockAdminId here for JWT mock consistency
    return await Admin.create({
        _id: mockAdminId,
        name: 'Test Admin',
        email: `admin-${Date.now()}@test.com`, // Ensure unique email
        password: 'hashedpassword', // In real tests, use bcrypt
        phoneNumber: `1234567890-${Date.now()}`, // Ensure unique phone
    });
};

const createTestVolunteer = async () => {
    // REMOVE the hardcoded _id here - let MongoDB generate it
    const authVol = await AuthVolunteer.create({
        // _id: mockVolunteerId, // REMOVED
        name: 'Test Volunteer',
        email: `volunteer-${Date.now()}@test.com`, // Ensure unique email
        password: 'hashedpassword',
        profileStatus: 'COMPLETED',
    });
    const volProfile = await Volunteer.create({
        auth: authVol._id,
        basicDetails: {
            phoneNumber: `0987654321-${Date.now()}`, // Ensure unique phone
            dateOfBirth: new Date('1995-01-01'),
            gender: 'Female',
            location: { pincode: '110011', state: 'Test State', city: 'Test City', address: `1 Test St ${Date.now()}` } // Add uniqueness
        },
        interests: { causes: ['Climate Action'], skills: ['Data Collection & Analysis'] },
        engagement: { availability: ['Weekly'], motivations: ['Personal Interest'], hasPreviousExperience: false },
        profileCompletion: { step1: true, step2: true, step3: true },
    });
    return { authVol, volProfile };
};

const createTestOrganization = async () => {
    // REMOVE the hardcoded _id here - let MongoDB generate it
    const authProvider = await AuthOpportunityProvider.create({
        // _id: mockProviderId, // REMOVED
        organizationName: `Test Org ${Date.now()}`, // Ensure unique name
        contactPerson: { name: 'Test Contact', email: `org-${Date.now()}@test.com`, phoneNumber: `1122334455-${Date.now()}` }, // Ensure unique email/phone
        password: 'hashedpassword',
        profileStatus: 'COMPLETED',
    });
    const providerProfile = await OpportunityProvider.create({
        auth: authProvider._id,
        organizationDetails: {
            description: 'A test organization',
            logo: '/test-logo.png',
            location: { address: `2 Test Ave ${Date.now()}`, city: 'Testville', state: 'Testland', pincode: '220022' }, // Add uniqueness
            website: `http://test-${Date.now()}.org` // Ensure unique website
        },
        workProfile: {
            geographicalAreaOfWork: ['Urban'],
            thematicAreaOfWork: [{ name: 'Waste Management & Recycling' }],
        },
        profileCompletion: { step1: true, step2: true },
    });
    return { authProvider, providerProfile };
};

const createTestOpportunity = async (providerProfileId) => {
    // Make opportunity details slightly unique if needed, though less likely to cause conflicts
    const uniqueSuffix = Date.now();
    return await Opportunity.create({
        provider: providerProfileId,
        basicDetails: {
            title: `Test Opportunity ${uniqueSuffix}`,
            description: 'Help test things',
            opportunityType: 'One-time Event',
            category: [{ name: 'Event Management' }],
            volunteersRequired: 5,
            isPaid: false,
        },
        schedule: {
            location: `Test Location ${uniqueSuffix}`,
            applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            timeCommitment: 'Few hours per week',
            contactPerson: { name: 'Opp Contact', email: `opp-${uniqueSuffix}@test.com`, phoneNumber: `3344556677-${uniqueSuffix}` }
        },
        evaluation: { support: [{ name: 'Certificate of Participation' }], hasMilestones: false },
        additionalInfo: { consentAgreement: true },
        profileCompletion: { step1: true, step2: true, step3: true, step4: true },
        applicants: [
            { volunteer: new mongoose.Types.ObjectId(), status: 'Pending' },
            { volunteer: new mongoose.Types.ObjectId(), status: 'Accepted' },
        ]
    });
};

const createTestStory = async (creatorId, creatorModel = 'Admin') => {
    return await Story.create({
        title: `Test Story ${Date.now()}`, // Ensure unique title
        content: `This is a test story content. ${Date.now()}`,
        photo: '/test-story.png',
        creator: creatorId,
        creatorModel: creatorModel,
        published: true,
        publishedAt: new Date()
    });
};

// --- Test Suite ---
describe('Admin Controller API Tests', () => {
    let admin;
    let jwtVerifySpy; // To hold the spy instance

    // Create a base admin user and set up JWT mock before all tests
    beforeAll(async () => {
        // Clear potential leftover admin from previous failed runs if needed
        await Admin.deleteMany({});
        admin = await createTestAdmin();

        // Spy on jwt.verify and control its behavior
        jwtVerifySpy = jest.spyOn(jwt, 'verify').mockImplementation((token, secret) => {
            // console.log(`Verifying token: ${token}`); // Debugging line
            if (token === adminToken) {
                // console.log('Returning admin payload'); // Debugging line
                return { id: admin._id.toString(), role: 'admin' };
            }
            if (token === nonAdminToken) {
                // console.log('Returning volunteer payload'); // Debugging line
                // Return a generic non-admin role, ID doesn't need to be fixed
                return { id: new mongoose.Types.ObjectId().toString(), role: 'volunteer' };
            }
            // console.log('Throwing invalid token error'); // Debugging line
            // Match the error message or type expected by the auth middleware
            const error = new Error('Invalid or expired token');
            error.name = 'JsonWebTokenError'; // Or TokenExpiredError depending on the case
            throw error;
            // throw new Error('Invalid or expired token');
        });
    });

    // Restore original jwt.verify after all tests
    afterAll(() => {
        if (jwtVerifySpy) {
            jwtVerifySpy.mockRestore();
        }
    });


    // Clear relevant collections before each test if setupTests.js doesn't handle it fully
    // (This is often handled globally in setupTests.js, but can be done here too if needed)
    beforeEach(async () => {
        // await Promise.all([
        //     AuthVolunteer.deleteMany({}),
        //     Volunteer.deleteMany({}),
        //     AuthOpportunityProvider.deleteMany({}),
        //     OpportunityProvider.deleteMany({}),
        //     Opportunity.deleteMany({}),
        //     Story.deleteMany({})
        //     // Do NOT delete the Admin here if it's created in beforeAll
        // ]);
        // Assuming setupTests.js afterEach handles cleanup correctly
    });

    // --- Auth/Admin Middleware Tests ---
    describe('Authorization Middleware', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/admin/stats');
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain('No token provided');
        });

        it('should return 403 if token is invalid', async () => {
            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', 'Bearer invalid-token'); // This will trigger the error in the mock
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Invalid or expired token');
        });

        it('should return 403 if user is not an admin', async () => {
            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', `Bearer ${nonAdminToken}`); // Use a non-admin token
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Only administrators');
        });
    });

    // --- Dashboard Statistics ---
    describe('GET /api/admin/stats', () => {
        beforeEach(async () => {
            // Clean relevant collections before seeding for this specific test block
            await Promise.all([
                AuthOpportunityProvider.deleteMany({}), OpportunityProvider.deleteMany({}), Opportunity.deleteMany({}),
                AuthVolunteer.deleteMany({}), Volunteer.deleteMany({}),
                Story.deleteMany({})
            ]);
        });

        it('should return dashboard statistics', async () => {
            // Seed data specifically for this test
            const { providerProfile } = await createTestOrganization();
            await createTestVolunteer();
            await createTestOpportunity(providerProfile._id);
            await createTestStory(admin._id);
            await createTestStory(admin._id);

            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('totalOrganizations', 1);
            expect(res.body.data).toHaveProperty('totalVolunteers', 1);
            expect(res.body.data).toHaveProperty('totalOpportunities', 1);
            expect(res.body.data).toHaveProperty('totalStories', 2);
        });
    });



    // --- Organizations Management ---
    describe('Organization Management', () => {
        let org1, org2;

        // Clean before seeding specific to this block
        beforeEach(async () => {
            await Promise.all([AuthOpportunityProvider.deleteMany({}), OpportunityProvider.deleteMany({}), Opportunity.deleteMany({})]);
            org1 = await createTestOrganization();
            org2 = await createTestOrganization(); // Create a second distinct org
        });

        it('GET /api/admin/organizations - should return a list of organizations', async () => {
            const res = await request(app)
                .get('/api/admin/organizations')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            // Order isn't guaranteed, so check total and presence of expected properties
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0]).toHaveProperty('name'); // Check one has a name
            expect(res.body.data[0]).toHaveProperty('email');
            expect(res.body.data[0]).toHaveProperty('status');
        });

        it('GET /api/admin/organizations - should handle pagination', async () => {
            const res = await request(app)
                .get('/api/admin/organizations?page=2&limit=1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.pagination.page).toBe(2);
            expect(res.body.pagination.limit).toBe(1);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.pagination.pages).toBe(2);
        });

        it('DELETE /api/admin/organizations/:id - should delete an organization and related data', async () => {
            // Use one of the orgs created in beforeEach
            const orgToDelete = org1;
            const providerProfileId = orgToDelete.providerProfile._id;
            await createTestOpportunity(providerProfileId); // Create an opportunity linked to this org

            const orgAuthId = orgToDelete.authProvider._id.toString();

            const res = await request(app)
                .delete(`/api/admin/organizations/${orgAuthId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('deleted successfully');

            // Verify deletion
            const deletedAuthProvider = await AuthOpportunityProvider.findById(orgAuthId);
            const deletedProviderProfile = await OpportunityProvider.findById(providerProfileId); // Find by profile ID now
            const relatedOpportunities = await Opportunity.find({ provider: providerProfileId });

            expect(deletedAuthProvider).toBeNull();
            expect(deletedProviderProfile).toBeNull();
            expect(relatedOpportunities.length).toBe(1); // Check opportunities were deleted
        });

        it('DELETE /api/admin/organizations/:id - should return 404 for non-existent ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/admin/organizations/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Organization not found');
        });

        it('DELETE /api/admin/organizations/:id - should return 400 for invalid ID format', async () => {
            const res = await request(app)
                .delete(`/api/admin/organizations/invalid-id-format`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid organization ID format');
        });
    });

    // --- Volunteers Management ---
    describe('Volunteer Management', () => {
        let vol1, vol2;

        // Clean before seeding specific to this block
        beforeEach(async () => {
            await Promise.all([AuthVolunteer.deleteMany({}), Volunteer.deleteMany({})]);
            vol1 = await createTestVolunteer();
            vol2 = await createTestVolunteer(); // Create a second distinct volunteer
        });

        it('GET /api/admin/volunteers - should return a list of volunteers', async () => {
            const res = await request(app)
                .get('/api/admin/volunteers')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0]).toHaveProperty('name'); // Check one has a name
            expect(res.body.data[0]).toHaveProperty('email');
            expect(res.body.data[0]).toHaveProperty('city');
        });

        it('GET /api/admin/volunteers - should handle pagination', async () => {
            const res = await request(app)
                .get('/api/admin/volunteers?page=1&limit=1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.pagination.page).toBe(1);
            expect(res.body.pagination.limit).toBe(1);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.pagination.pages).toBe(2);
        });

        it('DELETE /api/admin/volunteers/:id - should delete a volunteer', async () => {
            // Use one of the vols created in beforeEach
            const volToDelete = vol1;
            const volAuthId = volToDelete.authVol._id.toString();
            const volProfileId = volToDelete.volProfile._id.toString();

            const res = await request(app)
                .delete(`/api/admin/volunteers/${volAuthId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('deleted successfully');

            // Verify deletion
            const deletedAuthVol = await AuthVolunteer.findById(volAuthId);
            const deletedVolProfile = await Volunteer.findById(volProfileId); // Find by profile ID
            expect(deletedAuthVol).toBeNull();
            expect(deletedVolProfile).toBeNull();
        });

        it('DELETE /api/admin/volunteers/:id - should return 404 for non-existent ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/admin/volunteers/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toContain('Volunteer not found');
        });

        it('DELETE /api/admin/volunteers/:id - should return 400 for invalid ID format', async () => {
            const res = await request(app)
                .delete(`/api/admin/volunteers/invalid-format`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('Invalid volunteer ID format');
        });
    });

    // --- Opportunities Management ---
    describe('Opportunity Management', () => {
        let opp1, opp2, providerProfile, authProvider;

        // Clean and seed before each test in this block
        beforeEach(async () => {
            await Promise.all([
                AuthOpportunityProvider.deleteMany({}), OpportunityProvider.deleteMany({}), Opportunity.deleteMany({})
            ]);
            const orgData = await createTestOrganization();
            providerProfile = orgData.providerProfile; // Store for use
            authProvider = orgData.authProvider; // Store auth part too
            opp1 = await createTestOpportunity(providerProfile._id);
            opp2 = await createTestOpportunity(providerProfile._id);
        });

        // --- Helper function for delay ---
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        it('GET /api/admin/opportunities - should return a list of opportunities', async () => {
            // --- Add delay here ---
            const delayMs = 150; // Delay in milliseconds (adjust as needed)
            console.log(`Waiting for ${delayMs}ms before fetching opportunities...`);
            await sleep(delayMs);
            // --- Delay ends ---

            const res = await request(app)
                .get('/api/admin/opportunities')
                .set('Authorization', `Bearer ${adminToken}`);

            console.log("GET /api/admin/opportunities - should return a list of opportunities - Response:", res.statusCode, JSON.stringify(res.body, null, 2)); // Log the full body for inspection

            // --- Assertions ---
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);

            // Check the total count first, as order isn't guaranteed
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.data.length).toBe(2); // Should match the total if no pagination applied by default

            // Check properties on the first element (assuming order or just checking one)
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0]).toHaveProperty('name');
            expect(res.body.data[0]).toHaveProperty('org', authProvider.organizationName); // Use stored authProvider name
            expect(res.body.data[0]).toHaveProperty('location');
            expect(res.body.data[0]).toHaveProperty('volunteers', 1); // Count of 'Accepted' applicants
        });

        it('GET /api/admin/opportunities - should handle pagination', async () => {
            const res = await request(app)
                .get('/api/admin/opportunities?page=2&limit=1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.pagination.page).toBe(2);
            expect(res.body.pagination.limit).toBe(1);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.pagination.pages).toBe(2);
        });

        it('DELETE /api/admin/opportunities/:id - should delete an opportunity', async () => {
            const oppId = opp1._id.toString();

            const res = await request(app)
                .delete(`/api/admin/opportunities/${oppId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('deleted successfully');

            // Verify deletion
            const deletedOpp = await Opportunity.findById(oppId);
            expect(deletedOpp).toBeNull();
        });

        it('DELETE /api/admin/opportunities/:id - should return 404 for non-existent ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/admin/opportunities/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toContain('Opportunity not found');
        });

        it('DELETE /api/admin/opportunities/:id - should return 400 for invalid ID format', async () => {
            const res = await request(app)
                .delete(`/api/admin/opportunities/invalid-opp-id`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('Invalid opportunity ID format');
        });
    });

    // --- Stories Management ---
    describe('Story Management', () => {
        let story1, story2;

        // Clean and seed before each test in this block
        beforeEach(async () => {
            await Story.deleteMany({});
            story1 = await createTestStory(admin._id, 'Admin');
            story2 = await createTestStory(admin._id, 'Admin');
        });

        it('GET /api/admin/stories - should return a list of stories', async () => {
            const res = await request(app)
                .get('/api/admin/stories')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0]).toHaveProperty('title'); // Check one has title
            expect(res.body.data[0]).toHaveProperty('description');
        });

        it('GET /api/admin/stories - should handle pagination', async () => {
            const res = await request(app)
                .get('/api/admin/stories?page=1&limit=1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.pagination.page).toBe(1);
            expect(res.body.pagination.limit).toBe(1);
            expect(res.body.pagination.total).toBe(2);
            expect(res.body.pagination.pages).toBe(2);
        });

        it('POST /api/admin/stories - should create a new story (without image upload)', async () => {
            const newStoryData = {
                title: 'A Brand New Story',
                content: 'Content for the new story.'
            };

            const res = await request(app)
                .post('/api/admin/stories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newStoryData); // Send JSON data directly

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Story created successfully');
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.title).toBe(newStoryData.title);
            expect(res.body.data.content).toBe(newStoryData.content);
            expect(res.body.data.creator).toBe(admin._id.toString());
            expect(res.body.data.creatorModel).toBe('Admin');
            expect(res.body.data.published).toBe(true);
            expect(res.body.data.photo).toBe('/home-story-3.png'); // Default photo check

            // Verify creation in DB
            const createdStory = await Story.findById(res.body.data._id);
            expect(createdStory).not.toBeNull();
            expect(createdStory.title).toBe(newStoryData.title);
        });

        it('POST /api/admin/stories - should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/api/admin/stories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ content: 'Only content' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Title and content are required');
        });

        it('POST /api/admin/stories - should return 400 if content is missing', async () => {
            const res = await request(app)
                .post('/api/admin/stories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Only Title' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Title and content are required');
        });

        it('DELETE /api/admin/stories/:id - should delete a story', async () => {
            const storyId = story1._id.toString();

            const res = await request(app)
                .delete(`/api/admin/stories/${storyId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Story deleted successfully');

            // Verify deletion
            const deletedStory = await Story.findById(storyId);
            expect(deletedStory).toBeNull();
        });

        it('DELETE /api/admin/stories/:id - should return 404 for non-existent ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/admin/stories/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toContain('Story not found');
        });

        it('DELETE /api/admin/stories/:id - should return 400 for invalid ID format', async () => {
            const res = await request(app)
                .delete(`/api/admin/stories/invalid-story-id`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('Invalid story ID format');
        });
    });
});