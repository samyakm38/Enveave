import mongoose from "mongoose";

const authOpportunityProviderSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: true
    },
    profileStatus: {
        type: String,
        enum: ['NOT_STARTED', 'STEP_1', 'STEP_2', 'COMPLETED'],
        default: 'NOT_STARTED'
    }
}, {
    timestamps: true
});

const AuthOpportunityProvider = mongoose.model('AuthOpportunityProvider', authOpportunityProviderSchema);

export default AuthOpportunityProvider;