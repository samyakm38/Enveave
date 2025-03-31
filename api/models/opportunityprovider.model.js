import mongoose from "mongoose";

const opportunityProviderSchema = new mongoose.Schema({
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthOpportunityProvider",
        required: true,
        unique: true,
    },
        // Step 1: Organization Details
    organizationDetails: {
        description: {
            type: String,
            required: true,
            trim: true
        },
        logo: {
            type: String,  // URL to stored image
            required: true
        },
        location: {
            address: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                required: true,
                trim: true
            },
            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },
        website: {
            type: String,
            required: true,
            trim: true
        }
    },

    // Step 2: Work Areas and Experience
    workProfile: {
        geographicalAreaOfWork: [{
            type: String,
            required: true,
            enum: [
                'Urban',
                'Rural',
                'Peri-urban',
            ]
        }],
        thematicAreaOfWork: [{
        type: {
            name: {
                type: String,
                required: true,
                enum: [
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
                ]
            },
            customArea: {
                type: String,
                required: function() {
                    return this.name === 'Other';
                },
                trim: true
            }
        }
    }],
        previousVolunteeringLink: {
            type: String,
            required: false,
            trim: true
        }
    },

    profileCompletion: {
        step1: {
            type: Boolean,
            default: false
        },
        step2: {
            type: Boolean,
            default: false
        }
    },

    totalVolunteers: {
        type: Number,
        default: 0
    },

    postedOpportunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    }]
}, {
    timestamps: true
});

const OpportunityProvider = mongoose.model('OpportunityProvider', opportunityProviderSchema);

export default OpportunityProvider;