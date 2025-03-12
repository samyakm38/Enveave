

// Just used for adding data in the mongoDB no other use



import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './models/admin.model.js';
import AuthOpportunityProvider from './models/auth.opportunityprovider.model.js';
import AuthVolunteer from './models/auth.volunteer.model.js';
import Story from './models/story.model.js';
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

// Seed Function
const seedData = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

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