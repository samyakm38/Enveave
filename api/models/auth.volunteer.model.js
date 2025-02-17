import mongoose from "mongoose";

const authVolunteerSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    profileStatus: {
        type: String,
        enum: ['NOT_STARTED', 'STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED'],
        default: 'NOT_STARTED'
    }
}, {
    timestamps: true
});

const AuthVolunteer = mongoose.model('AuthVolunteer', authVolunteerSchema);
export default AuthVolunteer;