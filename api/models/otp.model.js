// api/models/otp.model.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    // --- Common Fields Required for OTP Process ---
    email: { // Primary email for OTP sending/lookup (volunteer email OR provider contact email)
        type: String,
        required: [true, 'Primary email is required for OTP.'],
        trim: true,
        lowercase: true,
        index: true, // Index for efficient lookups
    },
    otp: {
        type: String,
        required: [true, 'OTP code is required.'],
    },
    hashedPassword: { // Store the hash temporarily
        type: String,
        required: [true, 'Hashed password is required.'],
    },
    userType: { // To distinguish between volunteer and provider data
        type: String,
        required: [true, 'User type is required.'],
        enum: {
            values: ['volunteer', 'provider'],
            message: '{VALUE} is not a supported user type for OTP.'
        }
    },

    // --- User Data (Fields relevant to the specific user type) ---
    // Common Status Field
    profileStatus: {
        type: String,
        // Ensure all possible statuses from both models are included if they differ, otherwise use common ones
        enum: ['NOT_STARTED', 'STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED'],
        default: 'NOT_STARTED'
    },
    // Volunteer Specific Data (Only required if userType is 'volunteer')
    name: { // Volunteer's name
        type: String,
        trim: true,
        // Conditionally required based on userType during validation/save if needed,
        // but simpler to just store it if provided for volunteers.
        // required: function() { return this.userType === 'volunteer'; } // Can add function-based required
    },
    // Provider Specific Data (Only required if userType is 'provider')
    organizationName: {
        type: String,
        trim: true,
        // required: function() { return this.userType === 'provider'; }
    },
    contactPerson: { // Store the nested contact person object
        _id: false, // Don't create a separate _id for the subdocument here
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true }, // Provider contact email
        phoneNumber: { type: String, trim: true }
        // required: function() { return this.userType === 'provider'; } // Require the object if provider
    },

    // --- Expiration ---
    createdAt: {
        type: Date,
        default: Date.now,
        // Automatically delete this temporary record after 10 minutes (600 seconds)
        expires: 600, // TTL index
    },
});

// Ensure the TTL index is created on createdAt
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
// Ensure email index exists
otpSchema.index({ email: 1 });

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;