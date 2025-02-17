import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    // Basic Admin Information
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
    phoneNumber: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;