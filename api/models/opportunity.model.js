import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
    // Reference to provider
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OpportunityProvider',
        required: true
    },

    // Step 1: Basic Details
    basicDetails: {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            type: String, // URL to stored image
            required: false
        },
        opportunityType: {
            type: String,
            required: true,
            enum: [
                'One-time Event',
                'Short-term Volunteering (1-4 weeks)',
                'Medium-term Volunteering (1-6 months)',
                'Long-term Volunteering (6+ months)',
                'Other'
            ]
        },
        category: [{
            type: {
                name: {
                    type: String,
                    required: true,
                    enum: [
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
                    ]
                },
                customCategory: {
                    type: String,
                    required: function() {
                        return this.name === 'Other';
                    }
                }
            }
        }],
        volunteersRequired: {
            type: Number,
            required: true,
            min: 1
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        compensation: {
            type: Number,
            required: function() { 
                return this.isPaid; 
            }
        }
    },

    // Step 2: Location and Schedule
    schedule: {
        location: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return this.startDate <= value;
                },
                message: 'End date must be after start date'
            }
        },
        timeCommitment: {
            type: String,
            required: true,
            enum: [
                'Few hours per week',
                '1-2 days per week',
                '3-4 days per week',
                'Full-time'
            ]
        },
        contactPerson: {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            phoneNumber: {
                type: String,
                required: true
            }
        }
    },

    // Step 3: Support and Milestones
    evaluation: {
        support: [{
        type: {
            name: {
                type: String,
                required: true,
                enum: [
                    'Travel Reimbursement',
                    'Food & Accommodation',
                    'Certificate of Participation',
                    'Letter of Recommendation',
                    'Stipend/Monetary Incentive',
                    'Learning/Training Sessions',
                    'Networking Opportunities',
                    'Other'
                ]
            },
            customSupport: {
                type: String,
                required: function() {
                    return this.name === 'Other';
                },
                trim: true
            }
        }
    }],
        hasMilestones: {
            type: Boolean,
            required: true,
            default: false
        },
        milestones: [{
            question: {
                type: String,
                required: function() { 
                    return this.parent().hasMilestones; 
                }
            },
            expectedAnswer: {
                type: Boolean,
                required: function() { 
                    return this.parent().hasMilestones; 
                }
            }
        }]
    },

    // Step 4: Additional Information
    additionalInfo: {
        resources: {
            type: String,
            required: false,
            trim: true
        },
        consentAgreement: {
            type: Boolean,
            required: true,
            default: false
        }
    },

    // Progress Tracking
    profileCompletion: {
        step1: {
            type: Boolean,
            default: false
        },
        step2: {
            type: Boolean,
            default: false
        },
        step3: {
            type: Boolean,
            default: false
        },
        step4: {
            type: Boolean,
            default: false
        }
    },

    // Applicants tracking
    applicants: [{
        volunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Volunteer'
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;