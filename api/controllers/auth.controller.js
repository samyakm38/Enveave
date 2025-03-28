// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Admin from '../models/admin.model.js';
import AuthOpportunityProvider from '../models/auth.opportunityprovider.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import { env } from '../config/env.js';
import { sanitizeInput, sanitizeNestedObject, failedAttempts, applySignupDelay } from '../helpers/securityHelper.js';

export const signup = async (req, res) => {
    console.log(req.body);
};

// Validation Schemas
const adminSchema = Joi.object({
    name: Joi.string().max(50).required().trim(),
    email: Joi.string().email().max(100).required().trim(),
    password: Joi.string().min(6).max(50).required(),
    phoneNumber: Joi.string().pattern(/^\+\d{10,15}$/).required(),
});

const providerSchema = Joi.object({
    organizationName: Joi.string().max(100).required().trim(),
    contactPerson: Joi.object({
        name: Joi.string().max(50).required().trim(),
        email: Joi.string().email().max(100).required().trim(),
        phoneNumber: Joi.string().pattern(/^\+\d{10,15}$/).required(),
    }).required(),
    password: Joi.string().min(6).max(50).required(),
    profileStatus: Joi.string().valid('NOT_STARTED', 'STEP_1', 'STEP_2', 'COMPLETED').optional(),
});

const volunteerSchema = Joi.object({
    name: Joi.string().max(50).required().trim(),
    email: Joi.string().email().max(100).required().trim(),
    password: Joi.string().min(6).max(50).required(),
    profileStatus: Joi.string().valid('NOT_STARTED', 'STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED').optional(),
});

// Admin Signup
export const signupAdmin = async (req, res) => {
    try {
        // Validate input
        const { error } = adminSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, phoneNumber } = req.body;

        // Sanitize inputs
        const sanitizedData = sanitizeNestedObject({ name, email, phoneNumber });
        const { name: sanitizedName, email: sanitizedEmail, phoneNumber: sanitizedPhoneNumber } = sanitizedData;

        // Update failed attempts if security middleware is active
        if (req.attempt) {
            req.attempt.count += 1;
            req.attempt.lastAttempt = Date.now();
            failedAttempts.set(sanitizedEmail, req.attempt);
        }

        // Check for existing admin
        const existingAdmin = await Admin.findOne({ email: sanitizedEmail });
        if (existingAdmin) {
            if (req.attempt && req.attempt.count >= env.maxAttempts) {
                req.attempt.lockedUntil = Date.now() + env.lockoutDuration;
                failedAttempts.set(sanitizedEmail, req.attempt);
            }
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Reset failed attempts on success if security middleware is active
        if (req.attempt) {
            failedAttempts.delete(sanitizedEmail);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new admin
        const newAdmin = new Admin({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            phoneNumber: sanitizedPhoneNumber,
        });
        await newAdmin.save();

        // Generate JWT
        const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, env.jwtSecret, { expiresIn: '15m' });

        // Exclude password from response
        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        res.status(201).json({ message: 'Admin registered successfully', admin: adminResponse, token });
    } catch (error) {
        console.error('Error in admin signup:', error);
        if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Opportunity Provider Signup
export const signupOpportunityProvider = async (req, res) => {
    try {
        // Validate input
        const { error } = providerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { organizationName, contactPerson, password, profileStatus } = req.body;

        // Sanitize inputs
        const sanitizedData = sanitizeNestedObject({ organizationName, contactPerson });
        const { organizationName: sanitizedOrganizationName, contactPerson: sanitizedContactPerson } = sanitizedData;

        // Update failed attempts if security middleware is active
        if (req.attempt) {
            req.attempt.count += 1;
            req.attempt.lastAttempt = Date.now();
            failedAttempts.set(sanitizedContactPerson.email, req.attempt);
        }

        // Check for existing provider
        const existingProvider = await AuthOpportunityProvider.findOne({
            'contactPerson.email': sanitizedContactPerson.email,
        });
        if (existingProvider) {
            if (req.attempt && req.attempt.count >= env.maxAttempts) {
                req.attempt.lockedUntil = Date.now() + env.lockoutDuration;
                failedAttempts.set(sanitizedContactPerson.email, req.attempt);
            }
            return res.status(400).json({ message: 'Opportunity Provider with this email already exists' });
        }

        // Reset failed attempts on success if security middleware is active
        if (req.attempt) {
            failedAttempts.delete(sanitizedContactPerson.email);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new provider
        const newProvider = new AuthOpportunityProvider({
            organizationName: sanitizedOrganizationName,
            contactPerson: sanitizedContactPerson,
            password: hashedPassword,
            profileStatus: profileStatus || 'NOT_STARTED',
        });
        await newProvider.save();

        // Generate JWT
        const token = jwt.sign({ id: newProvider._id, role: 'provider' }, env.jwtSecret, { expiresIn: '15m' });

        // Exclude password from response
        const providerResponse = newProvider.toObject();
        delete providerResponse.password;

        res.status(201).json({ message: 'Opportunity Provider registered successfully', provider: providerResponse, token });
    } catch (error) {
        console.error('Error in provider signup:', error);
        if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Volunteer Signup
export const signupVolunteer = async (req, res) => {
    try {
        const { error } = volunteerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, profileStatus } = req.body;

        // Sanitize inputs
        const sanitizedData = sanitizeNestedObject({ name, email });
        const { name: sanitizedName, email: sanitizedEmail } = sanitizedData;

        // Update failed attempts if security middleware is active
        if (req.attempt) {
            req.attempt.count = (req.attempt.count || 0) + 1;
            req.attempt.lastAttempt = Date.now();
            failedAttempts.set(sanitizedEmail, req.attempt);
        }

        // Check for existing volunteer
        const existingVolunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
        if (existingVolunteer) {
            if (req.attempt && req.attempt.count >= env.maxAttempts) {
                req.attempt.lockedUntil = Date.now() + env.lockoutDuration;
                failedAttempts.set(sanitizedEmail, req.attempt);
            }
            return res.status(400).json({ message: 'Volunteer with this email already exists' });
        }

        // Reset failed attempts on success if security middleware is active
        if (req.attempt) {
            failedAttempts.delete(sanitizedEmail);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new volunteer
        const newVolunteer = new AuthVolunteer({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            profileStatus: profileStatus || 'NOT_STARTED',
        });
        await newVolunteer.save();

        // Generate JWT
        const token = jwt.sign({ id: newVolunteer._id, role: 'volunteer' }, env.jwtSecret, { expiresIn: '15m' });

        // Exclude password from response
        const volunteerResponse = newVolunteer.toObject();
        delete volunteerResponse.password;

        res.status(201).json({ message: 'Volunteer registered successfully', volunteer: volunteerResponse, token });
    } catch (error) {
        console.error('Error in volunteer signup:', error);
        if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        // Validate input
        const loginSchema = Joi.object({
            email: Joi.string().email().required().trim(),
            password: Joi.string().required()
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        
        // Sanitize email
        const sanitizedEmail = sanitizeInput(email);
        
        // Find admin by email
        const admin = await Admin.findOne({ email: sanitizedEmail });
        if (!admin) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: 'admin' }, 
            env.jwtSecret, 
            { expiresIn: '8h' }
        );
        
        // Exclude password from response
        const adminResponse = admin.toObject();
        delete adminResponse.password;
        
        res.status(200).json({ 
            message: 'Admin logged in successfully', 
            admin: adminResponse, 
            token 
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Opportunity Provider Login
export const loginOpportunityProvider = async (req, res) => {
    try {
        // Validate input
        const loginSchema = Joi.object({
            email: Joi.string().email().required().trim(),
            password: Joi.string().required()
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        
        // Sanitize email
        const sanitizedEmail = sanitizeInput(email);
        
        // Find provider by email
        const provider = await AuthOpportunityProvider.findOne({ 'contactPerson.email': sanitizedEmail });
        if (!provider) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, provider.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Generate JWT
        const token = jwt.sign(
            { id: provider._id, role: 'provider' }, 
            env.jwtSecret, 
            { expiresIn: '8h' }
        );
        
        // Exclude password from response
        const providerResponse = provider.toObject();
        delete providerResponse.password;
        
        res.status(200).json({ 
            message: 'Opportunity Provider logged in successfully', 
            provider: providerResponse, 
            token 
        });
    } catch (error) {
        console.error('Error in opportunity provider login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Volunteer Login
export const loginVolunteer = async (req, res) => {
    try {
        // Validate input
        const loginSchema = Joi.object({
            email: Joi.string().email().required().trim(),
            password: Joi.string().required()
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        
        // Sanitize email
        const sanitizedEmail = sanitizeInput(email);
        
        // Find volunteer by email
        const volunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
        if (!volunteer) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, volunteer.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Generate JWT
        const token = jwt.sign(
            { id: volunteer._id, role: 'volunteer' }, 
            env.jwtSecret, 
            { expiresIn: '8h' }
        );
        
        // Exclude password from response
        const volunteerResponse = volunteer.toObject();
        delete volunteerResponse.password;
        
        res.status(200).json({ 
            message: 'Volunteer logged in successfully', 
            volunteer: volunteerResponse, 
            token 
        });
    } catch (error) {
        console.error('Error in volunteer login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};