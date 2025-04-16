// tests/provider.test.js
import {beforeEach, describe, expect, it, jest} from '@jest/globals'; // Import jest from @jest/globals
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; // Import your express app
import AuthOpportunityProvider from '../../models/auth.opportunityprovider.model.js';
import OpportunityProvider from '../../models/opportunityprovider.model.js';
import Opportunity from '../../models/opportunity.model.js';


// Use the validMongoId generated in setupTests.js
const validMongoId = new mongoose.Types.ObjectId().toString();
const validToken = 'valid-provider-token'; // Use a placeholder, JWT mock handles it
const invalidToken = 'invalid-token';

// Mock JWT verify from setupTests.js (re-stated for clarity, but setup handles it)
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn().mockImplementation((token) => {
        if (token === invalidToken) throw new Error('Invalid token');
        // Simulate successful verification for any other token
        // ***** THIS IS THE FIX *****
        // Return the *actual* validMongoId used in the test scope
        return { id: validMongoId, role: 'provider' };
    })
}));

// --- Test Suite ---
describe('Provider Controller API Tests', () => {
    let authProviderData;
    let providerProfileData;

    beforeEach(() => {
        // Reset data before each test
        authProviderData = {
            _id: validMongoId, // Ensure consistent ID
            organizationName: 'Test Org',
            contactPerson: {
                name: 'Test Contact',
                email: 'test@org.com',
                phoneNumber: '1234567890'
            },
            password: 'hashedpassword', // In real scenarios, hash it
            profileStatus: 'NOT_STARTED'
        };

        providerProfileData = {
            auth: validMongoId,
            organizationDetails: {
                description: 'Org Description',
                logo: 'http://example.com/logo.png',
                location: {
                    address: '123 Test St',
                    city: 'Test City',
                    state: 'TS',
                    pincode: '12345'
                },
                website: 'http://testorg.com'
            },
            workProfile: {
                geographicalAreaOfWork: ['Urban'],
                thematicAreaOfWork: [{ name: 'Waste Management & Recycling' }],
                previousVolunteeringLink: 'http://example.com/prev'
            },
            profileCompletion: {
                step1: false,
                step2: false
            }
        };
    });

    // --- GET /api/provider/profile ---
    describe('GET /api/provider/profile', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/provider/profile');
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain('No token provided');
        });

        it('should return 403 if token is invalid', async () => {
            const res = await request(app)
                .get('/api/provider/profile')
                .set('Authorization', `Bearer ${invalidToken}`);
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Invalid or expired token');
        });





    });

    // --- PUT /api/provider/profile ---
    describe('PUT /api/provider/profile', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).put('/api/provider/profile').send({});
            expect(res.statusCode).toEqual(401);
        });




    });

    // --- GET /api/provider/stats ---
    describe('GET /api/provider/stats', () => {
        beforeEach(async () => {
            // Ensure provider exists for stats calculation
            await AuthOpportunityProvider.create(authProviderData);
            // We don't strictly need the OpportunityProvider record for *this* endpoint
            // but the Opportunity schema requires a provider ref (using the Auth ID here based on controller logic)
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/provider/stats');
            expect(res.statusCode).toEqual(401);
        });

        it('should return stats with zeros if provider has no opportunities', async () => {
            await Opportunity.deleteMany({}); // Ensure no opportunities

            const res = await request(app)
                .get('/api/provider/stats')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({
                totalOpportunities: 0,
                totalVolunteers: 0,
                completedProjects: 0
            });
        });

        it('should return correct stats based on provider opportunities', async () => {
            const pastDate = new Date('2023-01-01');
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30); // 30 days in the future

            // Create opportunities
            await Opportunity.create([
                { // Completed project, 2 accepted volunteers
                    provider: validMongoId, // Linked to the Auth ID
                    basicDetails: { title: 'Past Opp 1', description: 'Desc', opportunityType: 'One-time Event', category: [{ name: 'Field Work & Conservation'}], volunteersRequired: 5, isPaid: false },
                    schedule: { location: 'Past Loc', applicationDeadline: pastDate, startDate: pastDate, endDate: pastDate, timeCommitment: 'Few hours per week', contactPerson: {name: 'A', email:'a@b.com', phoneNumber:'1'} },
                    evaluation: { support: [{name:'Certificate of Participation'}], hasMilestones: false },
                    additionalInfo: { consentAgreement: true },
                    applications: [ // Mongoose doesn't auto-populate here, but controller logic simulates it
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Accepted' },
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Accepted' },
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Rejected' },
                    ]
                },
                { // Ongoing project, 1 accepted volunteer
                    provider: validMongoId,
                    basicDetails: { title: 'Ongoing Opp 1', description: 'Desc', opportunityType: 'Short-term Volunteering (1-4 weeks)', category: [{ name: 'Education & Awareness'}], volunteersRequired: 3, isPaid: false },
                    schedule: { location: 'Current Loc', applicationDeadline: futureDate, startDate: new Date(), endDate: futureDate, timeCommitment: '1-2 days per week', contactPerson: {name: 'A', email:'a@b.com', phoneNumber:'1'} },
                    evaluation: { support: [{name:'Food & Accommodation'}], hasMilestones: false },
                    additionalInfo: { consentAgreement: true },
                    applications: [
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Accepted' },
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Pending' },
                    ]
                },
                { // Completed project, 0 accepted volunteers
                    provider: validMongoId,
                    basicDetails: { title: 'Past Opp 2', description: 'Desc', opportunityType: 'One-time Event', category: [{ name: 'Waste Management'}], volunteersRequired: 2, isPaid: false },
                    schedule: { location: 'Past Loc 2', applicationDeadline: pastDate, startDate: pastDate, endDate: pastDate, timeCommitment: 'Few hours per week', contactPerson: {name: 'A', email:'a@b.com', phoneNumber:'1'} },
                    evaluation: { support: [], hasMilestones: false },
                    additionalInfo: { consentAgreement: true },
                    applications: [
                        { volunteer: new mongoose.Types.ObjectId(), status: 'Rejected' },
                    ]
                }
            ]);

            // Manually update applications for testing (since we aren't using real applications)
            // Find created opps to simulate population
            const opps = await Opportunity.find({ provider: validMongoId });
            // Simulate the controller's populate logic result for stats calculation
            opps[0].applications = [ { status: 'Accepted' }, { status: 'Accepted' }, { status: 'Rejected' } ];
            opps[1].applications = [ { status: 'Accepted' }, { status: 'Pending' } ];
            opps[2].applications = [ { status: 'Rejected' } ];
            // Mock the find().populate() call to return our modified opps
            jest.spyOn(Opportunity, 'find').mockReturnValue({
                populate: jest.fn().mockResolvedValue(opps) // Return our manually adjusted opps
            });


            const res = await request(app)
                .get('/api/provider/stats')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({
                totalOpportunities: 3, // 3 opportunities created
                totalVolunteers: 3,    // 2 from opp1 + 1 from opp2 + 0 from opp3
                completedProjects: 2   // opp1 and opp3 have past end dates
            });

            // Restore the original Opportunity.find method
            jest.restoreAllMocks();
        });
    });

    // --- GET /api/provider/dashboard ---
    describe('GET /api/provider/dashboard', () => {
        beforeEach(async () => {
            // Need both Auth and potentially Profile for the dashboard profile section
            await AuthOpportunityProvider.create(authProviderData);
            // Create the detailed profile as well for a more complete test
            await OpportunityProvider.create(providerProfileData);
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/provider/dashboard');
            expect(res.statusCode).toEqual(401);
        });

        it('should return 404 if provider auth record not found', async () => {
            await AuthOpportunityProvider.deleteMany({});
            const res = await request(app)
                .get('/api/provider/dashboard')
                .set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Provider not found');
        });




    });
});