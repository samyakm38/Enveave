// filepath: d:\Enveave-SDOS\api\scripts\seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Import models
import Admin from '../models/admin.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import AuthOpportunityProvider from '../models/auth.opportunityprovider.model.js';
import Volunteer from '../models/volunteer.model.js';
import OpportunityProvider from '../models/opportunityprovider.model.js';
import Opportunity from '../models/opportunity.model.js';
import Story from '../models/story.model.js';
import connectDB from '../config/db.js';

// Initialize environment variables
dotenv.config();

// Connect to the database
await connectDB();

// Function to clear all collections
const clearCollections = async () => {
  console.log('Clearing all collections...');
  await Admin.deleteMany({});
  await AuthVolunteer.deleteMany({});
  await AuthOpportunityProvider.deleteMany({});
  await Volunteer.deleteMany({});
  await OpportunityProvider.deleteMany({});
  await Opportunity.deleteMany({});
  await Story.deleteMany({});
  console.log('All collections cleared.');
};

// Hash password function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed admins
const seedAdmins = async () => {
  console.log('Seeding admins...');
  const admins = [];
  
  for (let i = 0; i < 10; i++) {
    const admin = new Admin({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: await hashPassword('Password123!'),
      phoneNumber: faker.phone.number('+91##########'),
      profilePhoto: faker.image.avatar()
    });
    
    admins.push(admin);
  }
  
  await Admin.insertMany(admins);
  console.log('Admin seeding complete.');
};

// Seed auth volunteers and volunteers
const seedVolunteers = async () => {
  console.log('Seeding volunteers...');
  const authVolunteers = [];
  const volunteers = [];
  
  for (let i = 0; i < 10; i++) {
    // Create auth volunteer
    const authVolunteer = new AuthVolunteer({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: await hashPassword('Password123!'),
      profileStatus: 'COMPLETED'
    });
    
    authVolunteers.push(authVolunteer);
    
    // Create volunteer with reference to auth volunteer
    const volunteer = new Volunteer({
      auth: authVolunteer._id,
      profilePhoto: faker.image.avatar(),
      basicDetails: {
        phoneNumber: faker.phone.number('+91##########'),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other', 'Prefer not to say']),
        location: {
          pincode: faker.location.zipCode('######'),
          state: faker.location.state(),
          city: faker.location.city(),
          address: faker.location.streetAddress()
        }
      },
      interests: {
        causes: faker.helpers.arrayElements([
          'Climate Action',
          'Environmental Conservation',
          'Waste Management',
          'Wildlife Protection',
          'Marine Conservation',
          'Forest Conservation',
          'Water Conservation',
          'Air Quality',
          'Environmental Education',
          'Habitat Restoration',
          'Others'
        ], faker.number.int({ min: 1, max: 5 })),
        skills: faker.helpers.arrayElements([
          'Environmental Research',
          'Data Collection & Analysis',
          'Environmental Education',
          'Waste Management',
          'Community Outreach',
          'Project Management',
          'Field Work',
          'Social Media Management',
          'Photography',
          'Editorial Writing',
          'Graphic Designing',
          'Sustainable Design',
          'Water Quality Testing',
          'Others'
        ], faker.number.int({ min: 1, max: 5 }))
      },
      engagement: {
        availability: faker.helpers.arrayElements([
          'Yearly',
          'Monthly',
          'Weekly',
          'Daily',
          'On Weekends Only',
          'One Time',
          'Remotely'
        ], faker.number.int({ min: 1, max: 3 })),
        motivations: faker.helpers.arrayElements([
          'Civic Responsibility',
          'Family/Societal Expectations',
          'International Norms (e.g. SDGs)',
          'Networking',
          'Personal Interest',
          'Personal or Professional Development',
          'Resume-Building',
          'School, College or Employer Requirement',
          'Other'
        ], faker.number.int({ min: 1, max: 3 })),
        hasPreviousExperience: faker.datatype.boolean(),
        previousExperience: faker.lorem.paragraph()
      },
      profileCompletion: {
        step1: true,
        step2: true,
        step3: true
      },
      appliedOpportunities: []
    });
    
    volunteers.push(volunteer);
  }
  
  // Insert auth volunteers first
  const createdAuthVolunteers = await AuthVolunteer.insertMany(authVolunteers);
  
  // Update volunteers with correct auth IDs
  for (let i = 0; i < volunteers.length; i++) {
    volunteers[i].auth = createdAuthVolunteers[i]._id;
  }
  
  await Volunteer.insertMany(volunteers);
  console.log('Volunteer seeding complete.');
  
  return { authVolunteers: createdAuthVolunteers, volunteers: await Volunteer.find() };
};

// Seed auth opportunity providers and opportunity providers
const seedOpportunityProviders = async () => {
  console.log('Seeding opportunity providers...');
  const authProviders = [];
  const providers = [];
  
  for (let i = 0; i < 10; i++) {
    // Create auth opportunity provider
    const authProvider = new AuthOpportunityProvider({
      organizationName: faker.company.name(),
      contactPerson: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: faker.phone.number('+91##########')
      },
      password: await hashPassword('Password123!'),
      profileStatus: 'COMPLETED'
    });
    
    authProviders.push(authProvider);
    
    // Create opportunity provider with reference to auth provider
    const provider = new OpportunityProvider({
      auth: authProvider._id,
      profilePhoto: faker.image.avatar(),
      organizationDetails: {
        description: faker.company.catchPhrase() + '. ' + faker.lorem.paragraph(),
        logo: faker.image.urlLoremFlickr({ category: 'business' }),
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          pincode: faker.location.zipCode('######')
        },
        website: faker.internet.url()
      },
      workProfile: {
        geographicalAreaOfWork: faker.helpers.arrayElements(['Urban', 'Rural', 'Peri-urban'], 
                                faker.number.int({ min: 1, max: 3 })),
        thematicAreaOfWork: faker.helpers.shuffle([
          { 
            name: faker.helpers.arrayElement([
              'Climate Change Mitigation',
              'Waste Management & Recycling',
              'Renewable Energy',
              'Environmental Education',
              'Water Conservation',
              'Forest Conservation',
              'Wildlife Protection',
              'Marine Conservation',
              'Sustainable Agriculture',
              'Air Quality Management',
              'Biodiversity Conservation',
              'Green Technology',
              'Environmental Research',
              'Sustainable Urban Development',
              'Other'
            ]),
            customArea: 'Custom Environmental Initiative'
          }
        ]).slice(0, faker.number.int({ min: 1, max: 3 })),
        previousVolunteeringLink: faker.internet.url()
      },
      profileCompletion: {
        step1: true,
        step2: true
      },
      totalVolunteers: faker.number.int({ min: 10, max: 100 }),
      postedOpportunities: []
    });
    
    providers.push(provider);
  }
  
  // Insert auth providers first
  const createdAuthProviders = await AuthOpportunityProvider.insertMany(authProviders);
  
  // Update providers with correct auth IDs
  for (let i = 0; i < providers.length; i++) {
    providers[i].auth = createdAuthProviders[i]._id;
  }
  
  await OpportunityProvider.insertMany(providers);
  console.log('Opportunity provider seeding complete.');
  
  return { authProviders: createdAuthProviders, providers: await OpportunityProvider.find() };
};

// Seed opportunities
const seedOpportunities = async (providers) => {
  console.log('Seeding opportunities...');
  const opportunities = [];
  
  for (let i = 0; i < 10; i++) {
    // Randomly select a provider
    const provider = providers[faker.number.int({ min: 0, max: providers.length - 1 })];
    
    // Create an opportunity for the selected provider
    const startDate = faker.date.future({ years: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 7, max: 90 }));
    
    const applicationDeadline = new Date(startDate);
    applicationDeadline.setDate(applicationDeadline.getDate() - faker.number.int({ min: 7, max: 30 }));
    
    const opportunity = new Opportunity({
      provider: provider._id,
      basicDetails: {
        title: faker.helpers.arrayElement([
          'Environmental Cleanup Drive',
          'Tree Planting Initiative',
          'Wildlife Conservation Volunteer',
          'Sustainable Farming Project',
          'Ocean Cleanup Campaign',
          'Renewable Energy Workshop',
          'Climate Change Awareness Program',
          'Recycling Education Initiative',
          'Biodiversity Survey Volunteer',
          'Green Building Design Project'
        ]),
        description: faker.lorem.paragraphs(3),
        photo: faker.image.urlLoremFlickr({ category: 'nature' }),
        opportunityType: faker.helpers.arrayElement([
          'One-time Event',
          'Short-term Volunteering (1-4 weeks)',
          'Medium-term Volunteering (1-6 months)',
          'Long-term Volunteering (6+ months)',
          'Other'
        ]),
        category: [
          {
            name: faker.helpers.arrayElement([
              'Content Creation & Communication',
              'Field Work & Conservation',
              'Research & Data Collection',
              'Education & Awareness',
              'Administrative Support',
              'Event Management',
              'Technical & IT Support',
              'Fundraising & Grant Writing',
              'Community Outreach',
              'Project Coordination',
              'Waste Management',
              'Sustainability Planning',
              'Wildlife Protection',
              'Climate Action',
              'Other'
            ]),
            customCategory: 'Custom Category'
          }
        ],
        volunteersRequired: faker.number.int({ min: 3, max: 20 }),
        isPaid: faker.datatype.boolean(),
        compensation: 0
      },
      schedule: {
        location: faker.location.city() + ', ' + faker.location.state(),
        applicationDeadline: applicationDeadline,
        startDate: startDate,
        endDate: endDate,
        timeCommitment: faker.helpers.arrayElement([
          'Few hours per week',
          '1-2 days per week',
          '3-4 days per week',
          'Full-time'
        ]),
        contactPerson: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          phoneNumber: faker.phone.number('+91##########')
        }
      },
      evaluation: {
        support: [
          {
            name: faker.helpers.arrayElement([
              'Travel Reimbursement',
              'Food & Accommodation',
              'Certificate of Participation',
              'Letter of Recommendation',
              'Stipend/Monetary Incentive',
              'Learning/Training Sessions',
              'Networking Opportunities',
              'Other'
            ]),
            customSupport: 'Custom Support'
          }
        ],
        hasMilestones: faker.datatype.boolean(),
        milestones: []
      },
      additionalInfo: {
        resources: faker.lorem.paragraph(),
        consentAgreement: true
      },
      profileCompletion: {
        step1: true,
        step2: true,
        step3: true,
        step4: true
      },
      applicants: []
    });
    
    // If it's a paid opportunity, set compensation
    if (opportunity.basicDetails.isPaid) {
      opportunity.basicDetails.compensation = faker.number.int({ min: 1000, max: 10000 });
    }
    
    // Add milestones if hasMilestones is true
    if (opportunity.evaluation.hasMilestones) {
      for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
        opportunity.evaluation.milestones.push({
          question: faker.lorem.sentence() + '?',
          expectedAnswer: faker.datatype.boolean()
        });
      }
    }
    
    opportunities.push(opportunity);
  }
  
  await Opportunity.insertMany(opportunities);
  
  // Update providers with posted opportunities
  for (const opportunity of opportunities) {
    await OpportunityProvider.findByIdAndUpdate(
      opportunity.provider,
      { $push: { postedOpportunities: opportunity._id } }
    );
  }
  
  console.log('Opportunity seeding complete.');
  return await Opportunity.find();
};

// Assign volunteers to opportunities
const assignVolunteers = async (volunteers, opportunities) => {
  console.log('Assigning volunteers to opportunities...');
  
  for (const volunteer of volunteers) {
    // Randomly select 1-3 opportunities to apply for
    const selectedOpportunities = faker.helpers.arrayElements(
      opportunities,
      faker.number.int({ min: 1, max: 3 })
    );
    
    for (const opportunity of selectedOpportunities) {
      // Generate application status
      const status = faker.helpers.arrayElement(['Pending', 'Accepted', 'Rejected']);
      const isCompleted = status === 'Accepted' ? faker.datatype.boolean() : false;
      
      // Add opportunity to volunteer's applied opportunities
      const appliedOpportunity = {
        opportunity: opportunity._id,
        status: status,
        isCompleted: isCompleted,
        completionDate: isCompleted ? faker.date.recent() : null,
        appliedAt: faker.date.recent(60)
      };
      
      await Volunteer.findByIdAndUpdate(
        volunteer._id,
        { $push: { appliedOpportunities: appliedOpportunity } }
      );
      
      // Add volunteer to opportunity's applicants
      const applicant = {
        volunteer: volunteer._id,
        status: status,
        appliedAt: faker.date.recent(60)
      };
      
      await Opportunity.findByIdAndUpdate(
        opportunity._id,
        { $push: { applicants: applicant } }
      );
      
      // Update provider's total volunteers if accepted
      if (status === 'Accepted') {
        await OpportunityProvider.findByIdAndUpdate(
          opportunity.provider,
          { $inc: { totalVolunteers: 1 } }
        );
      }
    }
  }
  
  console.log('Volunteer assignment complete.');
};

// Seed stories
const seedStories = async (volunteers, providers) => {
  console.log('Seeding stories...');
  const stories = [];
  
  // Create 5 stories from volunteers
  for (let i = 0; i < 5; i++) {
    const volunteer = volunteers[faker.number.int({ min: 0, max: volunteers.length - 1 })];
    
    const story = new Story({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      photo: faker.image.urlLoremFlickr({ category: 'nature' }),
      creator: volunteer._id,
      creatorModel: 'Volunteer',
      published: true,
      publishedAt: faker.date.recent(30)
    });
    
    stories.push(story);
  }
  
  // Create 5 stories from providers
  for (let i = 0; i < 5; i++) {
    const provider = providers[faker.number.int({ min: 0, max: providers.length - 1 })];
    
    const story = new Story({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      photo: faker.image.urlLoremFlickr({ category: 'nature' }),
      creator: provider._id,
      creatorModel: 'OpportunityProvider',
      published: true,
      publishedAt: faker.date.recent(30)
    });
    
    stories.push(story);
  }
  
  await Story.insertMany(stories);
  console.log('Story seeding complete.');
};

// Main function to run the seeding process
const seedDatabase = async () => {
  try {
    // Clear all collections
    await clearCollections();
    
    // Seed admins
    await seedAdmins();
    
    // Seed volunteers
    const { volunteers } = await seedVolunteers();
    
    // Seed opportunity providers
    const { providers } = await seedOpportunityProviders();
    
    // Seed opportunities
    const opportunities = await seedOpportunities(providers);
    
    // Assign volunteers to opportunities
    await assignVolunteers(volunteers, opportunities);
    
    // Seed stories
    await seedStories(volunteers, providers);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the main function
seedDatabase();