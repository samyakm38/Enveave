// api/controllers/auth.controller.js
import bcrypt from 'bcryptjs'; // Use bcryptjs consistently if installed
import jwt from 'jsonwebtoken';
// Remove Joi from here, import schemas from the validator file
// import Joi from 'joi';
import Admin from '../models/admin.model.js';
import AuthOpportunityProvider from '../models/auth.opportunityprovider.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import Otp from '../models/otp.model.js'; // <-- Import OTP model
import { env } from '../config/env.js';
import {
    sanitizeInput,
    sanitizeNestedObject,
    // Remove old failedAttempts map import
    // failedAttempts,
    // Remove old applySignupDelay import (middleware is applied in routes)
    // applySignupDelay,
    recordFailedAttempt, // <-- Import new helper
    resetAttempts      // <-- Import new helper
} from '../helpers/securityHelper.js';
import {generateOtp} from '../helpers/otpHelper.js'; // <-- Import OTP generator
import {sendOtpEmail} from '../helpers/otpHelper.js';   // <-- Import email helper
import {
    adminSchema,       // <-- Import from validator file
    providerSchema,    // <-- Import from validator file
    volunteerSchema,   // <-- Import from validator file
    otpSchema,         // <-- Import from validator file
    loginSchema        // <-- Import from validator file (assuming you created one)
} from '../validators/auth.validators.js'; // <-- Adjust path if needed

// Test signup function (keep or remove as needed)
export const signup = async (req, res) => {
    console.log("General signup endpoint hit:", req.body);
    res.status(200).json({ message: "General signup received." });
};

// --- Validation Schemas (Now Imported from ../validators/auth.validators.js) ---
// const adminSchema = Joi.object({...});
// const providerSchema = Joi.object({...});
// const volunteerSchema = Joi.object({...});
// const loginSchema = Joi.object({...}); // Define this in validators file

// --- Admin Signup (Updated Rate Limiting) ---
export const signupAdmin = async (req, res) => {
    try {
        // 1. Validate input
        const { error: validationError, value: validatedData } = adminSchema.validate(req.body);
        if (validationError) {
            const messages = validationError.details.map(d => d.message).join('. ');
            return res.status(400).json({ message: messages });
        }

        // 2. Sanitize inputs (use validated data)
        const { name, email, password, phoneNumber } = validatedData;
        const sanitizedData = sanitizeNestedObject({ name, email, phoneNumber });
        const { name: sanitizedName, email: sanitizedEmail, phoneNumber: sanitizedPhoneNumber } = sanitizedData;

        if (!sanitizedEmail || !sanitizedName || !sanitizedPhoneNumber) {
            return res.status(400).json({ message: "Invalid characters in input fields after sanitization." });
        }

        // 3. Check for existing admin
        const existingAdmin = await Admin.findOne({ email: sanitizedEmail });
        if (existingAdmin) {
            // Record failed attempt if rate limiting middleware is active
            if (req.attemptInfo) {
                recordFailedAttempt(req); // Use the new helper
            }
            return res.status(409).json({ message: 'Admin with this email already exists' }); // Use 409 Conflict
        }

        // 4. Reset attempts for new user signup
        if (req.attemptInfo) {
            resetAttempts(req); // Use the new helper
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Save new admin
        const newAdmin = new Admin({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            phoneNumber: sanitizedPhoneNumber,
        });
        await newAdmin.save();

        // 7. Generate JWT (Admin signup grants immediate access)
        const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, env.jwtSecret, { expiresIn: env.jwtExpiration }); // Use configured expiration

        // 8. Exclude password from response
        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        res.status(201).json({ message: 'Admin registered successfully', admin: adminResponse, token });

    } catch (error) {
        console.error('Error in admin signup:', error);
        if (error.code === 11000) {
            if (req.attemptInfo) recordFailedAttempt(req); // Record failure on duplicate key error
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error during admin signup', error: error.message }); // Avoid sending raw error in prod
    }
};

// --- Opportunity Provider Signup (Updated Rate Limiting) ---
// --- Opportunity Provider Signup (REVISED - Stores data temporarily with OTP) ---
export const signupOpportunityProvider = async (req, res) => {
    // 1. Validate input
    const { error: validationError, value: validatedData } = providerSchema.validate(req.body);
    if (validationError) {
        const messages = validationError.details.map(d => d.message).join('. ');
        return res.status(400).json({ message: messages });
    }

    // 2. Sanitize inputs
    const { organizationName, contactPerson, password, profileStatus } = validatedData;
    const sanitizedData = sanitizeNestedObject({ organizationName, contactPerson });
    const { organizationName: sanitizedOrganizationName, contactPerson: sanitizedContactPerson } = sanitizedData;

    // Use contact person's email for OTP sending and primary lookup key
    const primaryEmail = sanitizedContactPerson?.email;

    // Check essential sanitized fields
    if (!sanitizedOrganizationName || !primaryEmail || !sanitizedContactPerson?.name || !sanitizedContactPerson?.phoneNumber) {
        return res.status(400).json({ message: "Invalid characters or missing required fields after sanitization." });
    }

    try {
        // 3. Check if a *verified* provider with this contact email already exists
        const existingVerifiedProvider = await AuthOpportunityProvider.findOne({ 'contactPerson.email': primaryEmail });
        if (existingVerifiedProvider) {
            if (req.attemptInfo) recordFailedAttempt(req); // Use primaryEmail as key
            return res.status(409).json({ message: 'A verified provider with this contact email already exists. Please log in.' });
        }

        // Reset attempts if proceeding (allow overriding previous pending OTP)
        if (req.attemptInfo) resetAttempts(req);

        // 4. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Generate OTP
        const otpCode = generateOtp();

        // --- Store Temporary Data with OTP ---
        // 6. Clear previous pending OTPs for this primary email
        await Otp.deleteMany({ email: primaryEmail });

        // 7. Create the temporary OTP record for the provider
        const otpEntry = new Otp({
            email: primaryEmail, // Primary email for lookup/sending
            hashedPassword: hashedPassword,
            profileStatus: profileStatus || 'NOT_STARTED',
            otp: otpCode,
            userType: 'provider', // Set the type
            // Provider specific data:
            organizationName: sanitizedOrganizationName,
            contactPerson: sanitizedContactPerson, // Store the whole sanitized object
        });
        await otpEntry.save(); // Save the temporary record

        // 8. Send OTP Email to the contact person's email
        const emailSent = await sendOtpEmail(primaryEmail, otpCode);

        if (!emailSent) {
            console.warn(`Provider signup data stored temporarily for ${primaryEmail}, but failed to send OTP email.`);
            return res.status(201).json({
                message: 'Signup initiated! Proceed to verify OTP. (Note: There might be issues sending the email, please check carefully or try again later if needed)',
                email: primaryEmail // Send back the email used
            });
        }

        // 9. Respond: Success - Ask for OTP verification
        res.status(201).json({
            message: 'Signup initiated! Please check your contact email for the OTP to complete registration.',
            email: primaryEmail // Send back the email used
        });
        // --- NO AuthOpportunityProvider RECORD CREATED YET ---

    } catch (error) {
        console.error('Error initiating provider signup:', error);
        res.status(500).json({ message: 'Server error during provider signup initiation.', error: error.message });
    }
};


// --- Volunteer Signup (MODIFIED FOR OTP) ---
// --- Volunteer Signup (REVISED - Stores data temporarily with OTP) ---
export const signupVolunteer = async (req, res) => {
    // 1. Validation
    const { error: validationError, value: validatedData } = volunteerSchema.validate(req.body);
    if (validationError) {
        const messages = validationError.details.map(d => d.message).join('. ');
        return res.status(400).json({ message: messages });
    }

    // 2. Sanitize
    const { name, email, password, profileStatus } = validatedData;
    const sanitizedInput = sanitizeNestedObject({ name, email });
    const sanitizedEmail = sanitizedInput.email;
    const sanitizedName = sanitizedInput.name;

    if (!sanitizedEmail || !sanitizedName) {
        return res.status(400).json({ message: "Invalid characters in name or email after sanitization." });
    }

    try {
        // 3. Check if a *verified* user already exists (important!)
        const existingVerifiedVolunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
        if (existingVerifiedVolunteer) {
            // If a permanent record exists, they cannot sign up again.
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(409).json({ message: 'A verified volunteer with this email already exists. Please log in.' });
        }

        // If rate limiting is active, reset attempts since we're proceeding
        // (We allow overriding a previous *pending* signup attempt)
        if (req.attemptInfo) resetAttempts(req);

        // 4. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Generate OTP
        const otpCode = generateOtp();

        // --- Store Temporary Data with OTP ---
        // 6. Clear any previous *pending* signup/OTP for this email first
        await Otp.deleteMany({ email: sanitizedEmail });

        // 7. Create the temporary OTP record containing user data
        const otpEntry = new Otp({
            name: sanitizedName,
            email: sanitizedEmail,
            hashedPassword: hashedPassword, // Store the hash
            profileStatus: profileStatus || 'NOT_STARTED',
            otp: otpCode,
            userType: 'volunteer', // Set the type
            // createdAt & expires are handled by the schema defaults/TTL
        });
        await otpEntry.save(); // Save the temporary record

        // 8. Send OTP Email
        const emailSent = await sendOtpEmail(sanitizedEmail, otpCode);

        if (!emailSent) {
            console.warn(`Signup data stored temporarily, but failed to send OTP email to ${sanitizedEmail}`);
            // Even if email fails, the temporary record exists. Inform user.
            // Consider deleting the Otp record here if email failure is critical? For now, let it exist.
            return res.status(201).json({ // Still 201 as the initial step succeeded
                message: 'Signup initiated! Proceed to verify OTP. (Note: There might be issues sending the email, please check carefully or try again later if needed)',
                email: sanitizedEmail
            });
        }

        // 9. Respond: Success - Ask for OTP verification
        res.status(201).json({
            message: 'Signup initiated! Please check your email for the OTP to complete registration.',
            email: sanitizedEmail
        });
        // --- NO AuthVolunteer RECORD CREATED YET ---

    } catch (error) {
        console.error('Error initiating volunteer signup:', error);
        // Don't record failed attempt for general server errors usually
        res.status(500).json({ message: 'Server error during signup initiation.', error: error.message });
    }
};

// --- VERIFY OTP (REVISED - Handles BOTH Volunteer and Provider) ---
export const verifyOtp = async (req, res) => {
    // 1. Validation
    const { error: validationError, value: validatedData } = otpSchema.validate(req.body);
    if (validationError) {
        const messages = validationError.details.map(d => d.message).join('. ');
        if (req.attemptInfo) recordFailedAttempt(req);
        return res.status(400).json({ message: messages });
    }

    // 2. Sanitize
    const { email, otp } = validatedData;
    const sanitizedEmail = sanitizeInput(email); // This is the primary email (volunteer or provider contact)

    if (!sanitizedEmail) {
        if (req.attemptInfo) recordFailedAttempt(req);
        return res.status(400).json({ message: "Invalid email format after sanitization." });
    }

    let otpRecord; // To potentially use in error handling

    try {
        // 3. Find the Temporary OTP Record
        otpRecord = await Otp.findOne({ email: sanitizedEmail, otp: otp });

        if (!otpRecord) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // --- OTP VALID - Determine User Type and Create Permanent Record ---
        const { userType } = otpRecord;

        if (userType === 'volunteer') {
            // --- Create Volunteer ---
            // 4a. Check if verified volunteer already exists (race condition)
            const existingVerifiedVolunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
            if (existingVerifiedVolunteer) {
                console.warn(`OTP verified for volunteer ${sanitizedEmail}, but user already exists. Possible race condition.`);
                await Otp.deleteOne({ _id: otpRecord._id }); // Clean up OTP
                if (req.attemptInfo) resetAttempts(req);
                return res.status(409).json({ message: 'This email is already registered and verified as a volunteer. Please log in.' });
            }

            // 5a. Create permanent AuthVolunteer record
            const newVolunteer = new AuthVolunteer({
                name: otpRecord.name, // Get data from OTP record
                email: otpRecord.email,
                password: otpRecord.hashedPassword,
                profileStatus: otpRecord.profileStatus,
            });
            await newVolunteer.save();
            console.log(`Volunteer record created successfully for ${sanitizedEmail}.`);

        } else if (userType === 'provider') {
            // --- Create Provider ---
            // 4b. Check if verified provider already exists (race condition)
            const existingVerifiedProvider = await AuthOpportunityProvider.findOne({ 'contactPerson.email': sanitizedEmail });
            if (existingVerifiedProvider) {
                console.warn(`OTP verified for provider contact ${sanitizedEmail}, but provider already exists. Possible race condition.`);
                await Otp.deleteOne({ _id: otpRecord._id }); // Clean up OTP
                if (req.attemptInfo) resetAttempts(req);
                return res.status(409).json({ message: 'An account with this contact email is already registered and verified. Please log in.' });
            }

            // 5b. Create permanent AuthOpportunityProvider record
            const newProvider = new AuthOpportunityProvider({
                organizationName: otpRecord.organizationName, // Get data from OTP record
                contactPerson: otpRecord.contactPerson,
                password: otpRecord.hashedPassword,
                profileStatus: otpRecord.profileStatus,
            });
            await newProvider.save();
            console.log(`Opportunity Provider record created successfully for contact ${sanitizedEmail}.`);

        } else {
            // Should not happen if validation is correct, but good to handle
            console.error(`Invalid userType '${userType}' found in OTP record ${otpRecord._id}`);
            await Otp.deleteOne({ _id: otpRecord._id }); // Clean up invalid OTP record
            return res.status(500).json({ message: 'Internal server error: Invalid user type during verification.' });
        }

        // 6. OTP successfully used: Delete the temporary OTP record
        await Otp.deleteOne({ _id: otpRecord._id });

        // 7. Reset OTP failure attempts
        if (req.attemptInfo) resetAttempts(req);

        // 8. Respond Success
        res.status(200).json({ message: 'Account verified and created successfully! Please log in.' });

    } catch (error) {
        console.error(`Error during OTP verification/user creation for ${sanitizedEmail}:`, error);
        // Clean up OTP record if user creation failed
        if (otpRecord?._id) {
            try { await Otp.deleteOne({ _id: otpRecord._id }); } catch (e) { console.error('Failed to cleanup OTP record after error:', e); }
        }
        // Handle potential duplicate key errors during the save (race condition)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Account registration conflict. Please try logging in.' });
        }
        res.status(500).json({ message: 'Server error during account verification.', error: error.message });
    }
};


// --- Admin Login (Updated Rate Limiting) ---
export const loginAdmin = async (req, res) => {
    try {
        // 1. Validate input
        const { error: validationError, value: validatedData } = loginSchema.validate(req.body); // Use imported schema
        if (validationError) {
            const messages = validationError.details.map(d => d.message).join('. ');
            if (req.attemptInfo) recordFailedAttempt(req); // Record failed attempt
            return res.status(400).json({ message: messages });
        }

        // 2. Sanitize
        const { email, password } = validatedData;
        const sanitizedEmail = sanitizeInput(email);
        if (!sanitizedEmail) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: "Invalid email format after sanitization." });
        }

        // 3. Find admin
        const admin = await Admin.findOne({ email: sanitizedEmail });
        if (!admin) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 5. Login Success - Reset attempts
        if (req.attemptInfo) resetAttempts(req);

        // 6. Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            env.jwtSecret,
            { expiresIn: env.jwtExpiration } // Use configured expiration
        );

        // 7. Prepare Response
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(200).json({
            message: 'Admin logged in successfully',
            admin: adminResponse,
            token
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ message: 'Server error during admin login', error: error.message });
    }
};

// --- Opportunity Provider Login (REVISED - No pending OTP check needed) ---
export const loginOpportunityProvider = async (req, res) => {
    try {
        // 1. Validate input
        const { error: validationError, value: validatedData } = loginSchema.validate(req.body); // Use imported schema
        if (validationError) {
            const messages = validationError.details.map(d => d.message).join('. ');
            if (req.attemptInfo) recordFailedAttempt(req); // Record failed attempt
            return res.status(400).json({ message: messages });
        }

        // 2. Sanitize
        const { email, password } = validatedData;
        const sanitizedEmail = sanitizeInput(email); // This is the contact person's email
        if (!sanitizedEmail) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: "Invalid email format after sanitization." });
        }

        // 3. Find provider by contact email (in the permanent collection)
        const provider = await AuthOpportunityProvider.findOne({ 'contactPerson.email': sanitizedEmail });
        if (!provider) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, provider.password);
        if (!isPasswordValid) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // --- Pending OTP Check is REMOVED ---
        // Existence in AuthOpportunityProvider collection means OTP was verified previously.

        // 5. Login Success - Reset attempts
        if (req.attemptInfo) resetAttempts(req);

        // 6. Generate JWT
        const token = jwt.sign(
            { id: provider._id, role: 'provider' },
            env.jwtSecret,
            { expiresIn: env.jwtExpiration } // Use configured expiration
        );

        // 7. Prepare Response
        const providerResponse = provider.toObject();
        delete providerResponse.password;

        res.status(200).json({
            message: 'Opportunity Provider logged in successfully',
            provider: providerResponse,
            token
        });
    } catch (error) {
        console.error('Error in opportunity provider login:', error);
        res.status(500).json({ message: 'Server error during provider login', error: error.message });
    }
};

// --- Volunteer Login (MODIFIED FOR OTP CHECK) ---
// --- Volunteer Login (REVISED - No pending OTP check needed) ---
export const loginVolunteer = async (req, res) => {
    try {
        // 1. Validate input
        const { error: validationError, value: validatedData } = loginSchema.validate(req.body);
        if (validationError) {
            const messages = validationError.details.map(d => d.message).join('. ');
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: messages });
        }

        // 2. Sanitize
        const { email, password } = validatedData;
        const sanitizedEmail = sanitizeInput(email);
        if (!sanitizedEmail) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: "Invalid email format after sanitization." });
        }

        // 3. Find volunteer (in the permanent collection)
        // If they don't exist here, they haven't completed signup/verification.
        const volunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
        if (!volunteer) {
            if (req.attemptInfo) recordFailedAttempt(req);
            // Generic message covers both non-existent user and wrong password scenarios
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, volunteer.password);
        if (!isPasswordValid) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // --- Pending OTP Check is REMOVED ---
        // If we found the user in AuthVolunteer, they ARE verified by definition of the new flow.

        // 5. Login Success - Reset attempts
        if (req.attemptInfo) resetAttempts(req);

        // 6. Generate JWT
        const token = jwt.sign(
            { id: volunteer._id, role: 'volunteer' },
            env.jwtSecret,
            { expiresIn: env.jwtExpiration }
        );

        // 7. Prepare Response
        const volunteerResponse = volunteer.toObject();
        delete volunteerResponse.password;

        res.status(200).json({
            message: 'Volunteer logged in successfully',
            volunteer: volunteerResponse,
            token
        });
    } catch (error) {
        console.error('Error in volunteer login:', error);
        res.status(500).json({ message: 'Server error during volunteer login', error: error.message });
    }
};

// --- Unified Login (Handles all three user types: admin, provider, volunteer) ---
export const unifiedLogin = async (req, res) => {
    try {
        // 1. Validate input
        const { error: validationError, value: validatedData } = loginSchema.validate(req.body);
        if (validationError) {
            const messages = validationError.details.map(d => d.message).join('. ');
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: messages });
        }

        // 2. Sanitize
        const { email, password } = validatedData;
        const sanitizedEmail = sanitizeInput(email);
        if (!sanitizedEmail) {
            if (req.attemptInfo) recordFailedAttempt(req);
            return res.status(400).json({ message: "Invalid email format after sanitization." });
        }

        // 3. Determine user type by checking all collections
        // Try admin first
        const admin = await Admin.findOne({ email: sanitizedEmail });
        if (admin) {
            // User is an admin
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                if (req.attemptInfo) recordFailedAttempt(req);
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Login Success - Reset attempts
            if (req.attemptInfo) resetAttempts(req);

            // Generate JWT
            const token = jwt.sign(
                { id: admin._id, role: 'admin' },
                env.jwtSecret,
                { expiresIn: env.jwtExpiration }
            );

            // Prepare Response
            const adminResponse = admin.toObject();
            delete adminResponse.password;

            return res.status(200).json({
                message: 'Admin logged in successfully',
                user: adminResponse,
                userType: 'admin',
                token
            });
        }

        // Try volunteer
        const volunteer = await AuthVolunteer.findOne({ email: sanitizedEmail });
        if (volunteer) {
            // User is a volunteer
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, volunteer.password);
            if (!isPasswordValid) {
                if (req.attemptInfo) recordFailedAttempt(req);
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Login Success - Reset attempts
            if (req.attemptInfo) resetAttempts(req);

            // Generate JWT
            const token = jwt.sign(
                { id: volunteer._id, role: 'volunteer' },
                env.jwtSecret,
                { expiresIn: env.jwtExpiration }
            );

            // Prepare Response
            const volunteerResponse = volunteer.toObject();
            delete volunteerResponse.password;

            return res.status(200).json({
                message: 'Volunteer logged in successfully',
                user: volunteerResponse,
                userType: 'volunteer',
                token
            });
        }

        // Try opportunity provider (check contact person email)
        const provider = await AuthOpportunityProvider.findOne({ 'contactPerson.email': sanitizedEmail });
        if (provider) {
            // User is a provider
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, provider.password);
            if (!isPasswordValid) {
                if (req.attemptInfo) recordFailedAttempt(req);
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Login Success - Reset attempts
            if (req.attemptInfo) resetAttempts(req);

            // Generate JWT
            const token = jwt.sign(
                { id: provider._id, role: 'provider' },
                env.jwtSecret,
                { expiresIn: env.jwtExpiration }
            );

            // Prepare Response
            const providerResponse = provider.toObject();
            delete providerResponse.password;

            return res.status(200).json({
                message: 'Opportunity Provider logged in successfully',
                user: providerResponse,
                userType: 'provider',
                token
            });
        }

        // If we get here, no user was found with the provided email
        if (req.attemptInfo) recordFailedAttempt(req);
        return res.status(401).json({ message: 'Invalid email or password' });

    } catch (error) {
        console.error('Error in unified login:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};