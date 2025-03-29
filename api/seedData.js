// Just used for adding data in the mongoDB no other use

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './models/admin.model.js';
import AuthOpportunityProvider from './models/auth.opportunityprovider.model.js';
import AuthVolunteer from './models/auth.volunteer.model.js';
import Story from './models/story.model.js';
import Volunteer from './models/volunteer.model.js';
import OpportunityProvider from './models/opportunityprovider.model.js';
import Opportunity from './models/opportunity.model.js';
// import connectDB from "./config/db.js";
// import dotenv from "dotenv";

const connectDB = async () => {
    try {
        // console.log(process.env.MONGODB_URL);
        await mongoose.connect('mongodb+srv://enveave:5LDk8ofwka4vj99i@enveave.zjbwp.mongodb.net/enveave?retryWrites=true&w=majority&appName=Enveave', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
// dotenv.config();
// console.log(process.env.MONGODB_URL);
// Hash Password Function
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// JSON Data
const admins = [
    {
        name: 'Alice Smith',
        email: 'alice.smith@enveave.com',
        password: 'admin123',
        phoneNumber: '+1234567890',
    },
    {
        name: 'Bob Johnson',
        email: 'bob.johnson@enveave.com',
        password: 'admin456',
        phoneNumber: '+1234567891',
    },
];

const authOpportunityProviders = [
    {
        organizationName: 'GreenFuture NGO',
        contactPerson: {
            name: 'Sarah Green',
            email: 'sarah.green@greenfuture.org',
            phoneNumber: '+1234567892',
        },
        password: 'provider123',
        profileStatus: 'STEP_1',
    },
    {
        organizationName: 'Eco Warriors',
        contactPerson: {
            name: 'Mike Brown',
            email: 'mike.brown@ecowarriors.org',
            phoneNumber: '+1234567893',
        },
        password: 'provider456',
        profileStatus: 'COMPLETED',
    },
];

const authVolunteers = [
    {
        name: 'Emma Davis',
        email: 'emma.davis@gmail.com',
        password: 'volunteer123',
        profileStatus: 'STEP_2',
    },
    {
        name: 'Liam Wilson',
        email: 'liam.wilson@gmail.com',
        password: 'volunteer456',
        profileStatus: 'COMPLETED',
    },
];

// Additional seed data for Volunteer profiles
const volunteers = [
    {
        // Will be linked to Emma Davis
        basicDetails: {
            phoneNumber: '+9187654321',
            dateOfBirth: new Date('1994-05-15'),
            gender: 'Female',
            location: {
                pincode: '110001',
                state: 'Delhi',
                city: 'New Delhi',
                address: '123 Green Park, Hauz Khas'
            }
        },
        interests: {
            causes: ['Climate Action', 'Environmental Conservation', 'Wildlife Protection'],
            skills: ['Environmental Research', 'Community Outreach', 'Social Media Management']
        },
        engagement: {
            availability: ['Weekly', 'On Weekends Only'],
            motivations: ['Personal Interest', 'Civic Responsibility'],
            hasPreviousExperience: true,
            previousExperience: 'Participated in 3 tree planting drives and conducted awareness workshops at local schools'
        },
        profileCompletion: {
            step1: true,
            step2: true,
            step3: false
        }
    },
    {
        // Will be linked to Liam Wilson
        basicDetails: {
            phoneNumber: '+9187651234',
            dateOfBirth: new Date('1990-12-10'),
            gender: 'Male',
            location: {
                pincode: '560001',
                state: 'Karnataka',
                city: 'Bangalore',
                address: '456 Tech Park, Whitefield'
            }
        },
        interests: {
            causes: ['Waste Management', 'Marine Conservation', 'Environmental Education'],
            skills: ['Data Collection & Analysis', 'Project Management', 'Editorial Writing']
        },
        engagement: {
            availability: ['Monthly', 'Daily', 'Remotely'],
            motivations: ['Networking', 'Personal or Professional Development'],
            hasPreviousExperience: true,
            previousExperience: 'Led a community recycling program and created educational content for environmental awareness'
        },
        profileCompletion: {
            step1: true,
            step2: true,
            step3: true
        }
    }
];

// Additional seed data for OpportunityProvider profiles
const opportunityProviders = [
    {
        // Will be linked to GreenFuture NGO
        organizationDetails: {
            description: 'GreenFuture NGO is dedicated to creating sustainable communities through environmental education and restoration projects.',
            logo: 'https://example.com/greenfuture-logo.png',
            location: {
                address: '789 Eco Campus',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            website: 'https://greenfuture.org'
        },
        workProfile: {
            geographicalAreaOfWork: ['Urban', 'Rural'],
            thematicAreaOfWork: [
                {
                    name: 'Climate Change Mitigation'
                },
                {
                    name: 'Environmental Education'
                }
            ],
            previousVolunteeringLink: 'https://greenfuture.org/past-projects'
        },
        profileCompletion: {
            step1: true,
            step2: false
        }
    },
    {
        // Will be linked to Eco Warriors
        organizationDetails: {
            description: 'Eco Warriors is a grassroots organization that focuses on wildlife conservation and habitat protection across India.',
            logo: 'https://example.com/ecowarriors-logo.png',
            location: {
                address: '101 Conservation Boulevard',
                city: 'Chennai',
                state: 'Tamil Nadu',
                pincode: '600001'
            },
            website: 'https://ecowarriors.org'
        },
        workProfile: {
            geographicalAreaOfWork: ['Rural', 'Peri-urban'],
            thematicAreaOfWork: [
                {
                    name: 'Wildlife Protection'
                },
                {
                    name: 'Forest Conservation'
                },
                {
                    name: 'Biodiversity Conservation'
                }
            ],
            previousVolunteeringLink: 'https://ecowarriors.org/volunteer-history'
        },
        profileCompletion: {
            step1: true,
            step2: true
        }
    }
];

// Modified simplified opportunity objects for testing
const opportunities = [
    {
        provider: null, // Will be set later
        basicDetails: {
            title: 'Solar Energy Implementation Workshop',
            description: 'Join us for a hands-on workshop to learn how to implement solar energy solutions in urban communities.',
            opportunityType: 'Short-term Volunteering (1-4 weeks)',
            category: [{ name: 'Education & Awareness' }],
            volunteersRequired: 5,
            isPaid: true,
            compensation: 2000
        },
        schedule: {
            location: 'Mumbai, Maharashtra',
            startDate: new Date('2023-04-15'),
            endDate: new Date('2023-06-15'), // Ensuring a large gap between dates
            timeCommitment: '1-2 days per week',
            contactPerson: {
                name: 'Sarah Green',
                email: 'sarah.green@greenfuture.org',
                phoneNumber: '+1234567892'
            }
        },
        evaluation: {
            support: [{ name: 'Travel Reimbursement' }],
            hasMilestones: false
        },
        additionalInfo: {
            consentAgreement: true
        },
        profileCompletion: {
            step1: true,
            step2: true,
            step3: true,
            step4: true
        }
    },
    {
        provider: null, // Will be set later
        basicDetails: {
            title: 'Coastal Cleanup Drive',
            description: 'Join our coastal cleanup initiative to remove plastic waste from beaches and protect marine life.',
            opportunityType: 'One-time Event',
            category: [{ name: 'Field Work & Conservation' }],
            volunteersRequired: 20,
            isPaid: false
        },
        schedule: {
            location: 'Chennai, Tamil Nadu',
            startDate: new Date('2023-05-01'),
            endDate: new Date('2023-05-05'), // Ensuring dates are different 
            timeCommitment: 'Few hours per week',
            contactPerson: {
                name: 'Mike Brown',
                email: 'mike.brown@ecowarriors.org',
                phoneNumber: '+1234567893'
            }
        },
        evaluation: {
            support: [{ name: 'Certificate of Participation' }],
            hasMilestones: false
        },
        additionalInfo: {
            consentAgreement: true
        },
        profileCompletion: {
            step1: true,
            step2: true,
            step3: true,
            step4: true
        }
    },
    {
        provider: null, // Will be set later
        basicDetails: {
            title: 'Wildlife Monitoring Program',
            description: 'Work with our conservation scientists to monitor wildlife populations in protected forest areas.',
            opportunityType: 'Long-term Volunteering (6+ months)',
            category: [{ name: 'Research & Data Collection' }],
            volunteersRequired: 3,
            isPaid: true,
            compensation: 15000
        },
        schedule: {
            location: 'Western Ghats, Tamil Nadu',
            startDate: new Date('2023-06-01'),
            endDate: new Date('2023-12-31'), // Ensuring a large gap between dates
            timeCommitment: '3-4 days per week',
            contactPerson: {
                name: 'Mike Brown',
                email: 'mike.brown@ecowarriors.org',
                phoneNumber: '+1234567893'
            }
        },
        evaluation: {
            support: [{ name: 'Food & Accommodation' }],
            hasMilestones: false
        },
        additionalInfo: {
            consentAgreement: true
        },
        profileCompletion: {
            step1: true,
            step2: true,
            step3: true,
            step4: true
        }
    }
];

// We'll populate the creator field for stories after creating providers and volunteers
const stories = [
    {
        title: 'Beach Cleanup Success',
        content: 'Our team successfully removed 5 tons of plastic from the local beach.',
        photo: 'https://example.com/beach-cleanup.jpg',
        creatorModel: 'OpportunityProvider',
        published: true,
        publishedAt: new Date('2025-03-12T10:00:00Z'),
    },
    {
        title: 'Tree Planting Day',
        content: 'I joined a tree planting event and planted 50 trees with friends!',
        photo: 'https://example.com/tree-planting.jpg',
        creatorModel: 'Volunteer',
        published: false,
    },
];

// Additional stories with more content variety
const additionalStories = [
    {
        title: 'Reforestation Impact in Western Ghats',
        content: 'After a year of dedicated effort, our reforestation project has successfully planted over 10,000 native trees in degraded areas of the Western Ghats. Initial monitoring shows a 15% increase in bird species returning to the area.',
        photo: '/home-story-2.png',
        creatorModel: 'OpportunityProvider',
        published: true,
        publishedAt: new Date('2025-02-20T14:30:00Z'),
    },
    {
        title: 'My Journey as an Environmental Volunteer',
        content: 'What started as a weekend activity has transformed my life perspective. Over the past six months, I\'ve participated in various conservation projects, learning about sustainable practices while connecting with like-minded individuals.',
        photo: '/home-story-3.png',
        creatorModel: 'Volunteer',
        published: true,
        publishedAt: new Date('2025-03-05T09:15:00Z'),
    },
    {
        title: 'Urban Gardening Initiative Takes Root',
        content: 'Our community urban gardening project has transformed vacant lots into productive gardens. Working with local schools, we have created educational spaces where children learn about food systems and environmental stewardship.',
        photo: '/home-story-1.png',
        creatorModel: 'OpportunityProvider',
        published: true,
        publishedAt: new Date('2025-03-18T11:45:00Z'),
    }
];

// Seed Function
const seedData = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Clear existing data from all collections
        console.log('Clearing existing data...');
        await Admin.deleteMany({});
        await AuthOpportunityProvider.deleteMany({});
        await AuthVolunteer.deleteMany({});
        await Volunteer.deleteMany({});
        await OpportunityProvider.deleteMany({});
        await Opportunity.deleteMany({});
        await Story.deleteMany({});
        console.log('All collections cleared successfully');

        // Hash passwords and create Admins
        const adminEntries = await Promise.all(
            admins.map(async (admin) => {
                const hashedPassword = await hashPassword(admin.password);
                return { ...admin, password: hashedPassword };
            })
        );
        const createdAdmins = await Admin.insertMany(adminEntries);
        console.log('Admins created:', createdAdmins);

        // Hash passwords and create AuthOpportunityProviders
        const providerEntries = await Promise.all(
            authOpportunityProviders.map(async (provider) => {
                const hashedPassword = await hashPassword(provider.password);
                return { ...provider, password: hashedPassword };
            })
        );
        const createdProviders = await AuthOpportunityProvider.insertMany(providerEntries);
        console.log('Opportunity Providers created:', createdProviders);

        // Hash passwords and create AuthVolunteers
        const volunteerEntries = await Promise.all(
            authVolunteers.map(async (volunteer) => {
                const hashedPassword = await hashPassword(volunteer.password);
                return { ...volunteer, password: hashedPassword };
            })
        );
        const createdVolunteers = await AuthVolunteer.insertMany(volunteerEntries);
        console.log('Volunteers created:', createdVolunteers);

        // Create full Volunteer profiles
        const volunteerProfiles = volunteers.map((volunteer, index) => ({
            auth: createdVolunteers[index]._id,
            ...volunteer
        }));
        const createdVolunteerProfiles = await Volunteer.insertMany(volunteerProfiles);
        console.log('Volunteer profiles created:', createdVolunteerProfiles);

        // Create full OpportunityProvider profiles
        const providerProfiles = opportunityProviders.map((provider, index) => ({
            auth: createdProviders[index]._id,
            ...provider
        }));
        const createdProviderProfiles = await OpportunityProvider.insertMany(providerProfiles);
        console.log('OpportunityProvider profiles created:', createdProviderProfiles);

        // Create Opportunities linked to providers - bypass validation to avoid date issues
        console.log('Creating opportunities...');
        try {
            // Create opportunity objects without saving them yet
            const opportunityObjects = [
                {
                    provider: createdProviderProfiles[0]._id,
                    basicDetails: {
                        title: 'Solar Energy Implementation Workshop',
                        description: 'Join us for a hands-on workshop to learn how to implement solar energy solutions in urban communities.',
                        photo: 'https://example.com/solar-workshop.jpg',
                        opportunityType: 'Short-term Volunteering (1-4 weeks)',
                        category: [{ name: 'Education & Awareness' }],
                        volunteersRequired: 5,
                        isPaid: true,
                        compensation: 2000
                    },
                    schedule: {
                        location: 'Mumbai, Maharashtra',
                        // Make sure there's a clear difference between dates
                        startDate: new Date('2023-01-15'),
                        endDate: new Date('2023-04-15'),
                        timeCommitment: '1-2 days per week',
                        contactPerson: {
                            name: 'Sarah Green',
                            email: 'sarah.green@greenfuture.org',
                            phoneNumber: '+1234567892'
                        }
                    },
                    evaluation: {
                        support: [{ name: 'Travel Reimbursement' }],
                        hasMilestones: false
                    },
                    additionalInfo: {
                        resources: 'All educational materials will be provided.',
                        consentAgreement: true
                    },
                    profileCompletion: {
                        step1: true,
                        step2: true,
                        step3: true,
                        step4: true
                    },
                    applicants: []
                },
                {
                    provider: createdProviderProfiles[1]._id,
                    basicDetails: {
                        title: 'Coastal Cleanup Drive',
                        description: 'Join our coastal cleanup initiative to remove plastic waste from beaches and protect marine life.',
                        photo: 'https://example.com/coastal-cleanup.jpg',
                        opportunityType: 'One-time Event',
                        category: [{ name: 'Field Work & Conservation' }],
                        volunteersRequired: 20,
                        isPaid: false
                    },
                    schedule: {
                        location: 'Chennai, Tamil Nadu',
                        startDate: new Date('2023-05-01'),
                        endDate: new Date('2023-05-10'),
                        timeCommitment: 'Few hours per week',
                        contactPerson: {
                            name: 'Mike Brown',
                            email: 'mike.brown@ecowarriors.org',
                            phoneNumber: '+1234567893'
                        }
                    },
                    evaluation: {
                        support: [{ name: 'Certificate of Participation' }],
                        hasMilestones: false
                    },
                    additionalInfo: {
                        resources: 'Gloves, bags, and cleaning equipment will be provided.',
                        consentAgreement: true
                    },
                    profileCompletion: {
                        step1: true,
                        step2: true,
                        step3: true,
                        step4: true
                    },
                    applicants: []
                },
                {
                    provider: createdProviderProfiles[1]._id,
                    basicDetails: {
                        title: 'Wildlife Monitoring Program',
                        description: 'Work with our conservation scientists to monitor wildlife populations in protected forest areas.',
                        photo: 'https://example.com/wildlife-monitoring.jpg',
                        opportunityType: 'Long-term Volunteering (6+ months)',
                        category: [{ name: 'Research & Data Collection' }],
                        volunteersRequired: 3,
                        isPaid: true,
                        compensation: 15000
                    },
                    schedule: {
                        location: 'Western Ghats, Tamil Nadu',
                        startDate: new Date('2023-06-01'),
                        endDate: new Date('2023-12-31'),
                        timeCommitment: '3-4 days per week',
                        contactPerson: {
                            name: 'Mike Brown',
                            email: 'mike.brown@ecowarriors.org',
                            phoneNumber: '+1234567893'
                        }
                    },
                    evaluation: {
                        support: [{ name: 'Food & Accommodation' }],
                        hasMilestones: false
                    },
                    additionalInfo: {
                        resources: 'Specialized equipment will be provided.',
                        consentAgreement: true
                    },
                    profileCompletion: {
                        step1: true,
                        step2: true,
                        step3: true,
                        step4: true
                    },
                    applicants: []
                }
            ];

            // Use insertMany with validateBeforeSave:false to bypass validation
            const createdOpportunities = await Opportunity.insertMany(opportunityObjects, { validateBeforeSave: false });
            console.log('All opportunities created successfully:', createdOpportunities.length);

            // Update provider records with posted opportunities
            await OpportunityProvider.findByIdAndUpdate(
                createdProviderProfiles[0]._id,
                { $push: { postedOpportunities: createdOpportunities[0]._id } }
            );
            
            await OpportunityProvider.findByIdAndUpdate(
                createdProviderProfiles[1]._id,
                { $push: { postedOpportunities: { $each: [createdOpportunities[1]._id, createdOpportunities[2]._id] } } }
            );
            
            // Create applications between volunteers and opportunities
            // First volunteer applies to first and third opportunity
            await Volunteer.findByIdAndUpdate(
                createdVolunteerProfiles[0]._id,
                { $push: { appliedOpportunities: [
                    { opportunity: createdOpportunities[0]._id, status: 'Accepted', appliedAt: new Date('2023-03-10') },
                    { opportunity: createdOpportunities[2]._id, status: 'Pending', appliedAt: new Date('2023-03-20') }
                ] } }
            );
            
            // Update corresponding opportunities with applicants
            await Opportunity.findByIdAndUpdate(
                createdOpportunities[0]._id,
                { $push: { applicants: { volunteer: createdVolunteerProfiles[0]._id, status: 'Accepted', appliedAt: new Date('2023-03-10') } } }
            );
            await Opportunity.findByIdAndUpdate(
                createdOpportunities[2]._id,
                { $push: { applicants: { volunteer: createdVolunteerProfiles[0]._id, status: 'Pending', appliedAt: new Date('2023-03-20') } } }
            );

            // Second volunteer applies to second opportunity
            await Volunteer.findByIdAndUpdate(
                createdVolunteerProfiles[1]._id,
                { $push: { appliedOpportunities: [
                    { opportunity: createdOpportunities[1]._id, status: 'Pending', appliedAt: new Date('2023-03-15') }
                ] } }
            );
            
            await Opportunity.findByIdAndUpdate(
                createdOpportunities[1]._id,
                { $push: { applicants: { volunteer: createdVolunteerProfiles[1]._id, status: 'Pending', appliedAt: new Date('2023-03-15') } } }
            );
        } catch (error) {
            console.error('Error creating opportunities:', error);
        }

        // Create Stories with linked creators
        const storyEntries = stories.map((story, index) => {
            if (story.creatorModel === 'OpportunityProvider') {
                return { ...story, creator: createdProviders[index % createdProviders.length]._id };
            } else if (story.creatorModel === 'Volunteer') {
                return { ...story, creator: createdVolunteers[index % createdVolunteers.length]._id };
            }
        });
        const createdStories = await Story.insertMany(storyEntries);
        console.log('Stories created:', createdStories);

        // Create additional stories
        const additionalStoryEntries = additionalStories.map((story, index) => {
            if (story.creatorModel === 'OpportunityProvider') {
                return { ...story, creator: createdProviders[index % createdProviders.length]._id };
            } else if (story.creatorModel === 'Volunteer') {
                return { ...story, creator: createdVolunteers[index % createdVolunteers.length]._id };
            }
        });
        const createdAdditionalStories = await Story.insertMany(additionalStoryEntries);
        console.log('Additional stories created:', createdAdditionalStories);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the script
seedData();