// api/validators/authValidators.js
import Joi from 'joi';

// --- Reusable Validation Logic ---

// Guideline patterns and checks
const namePattern = /^[a-zA-Z\s'-]{2,100}$/; // Allows letters, spaces, hyphen, apostrophe. Min 2, Max 100.
// E.164 format-like pattern for phone numbers (starts with +, followed by digits)
const phonePattern = /^\+\d{10,15}$/; // Example: +11234567890
const potentiallyHarmfulChars = /['"\\;]|--|\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|DECLARE|CAST|CONVERT)\b/i;

// Custom validator function to check against harmful characters/keywords
const checkHarmfulChars = (value, helpers) => {
    // Skip check if value isn't a string (e.g., for nested objects handled elsewhere)
    if (typeof value !== 'string') return value;
    if (potentiallyHarmfulChars.test(value)) {
        return helpers.error('string.invalidChars');
    }
    return value; // Pass validation if no harmful chars found
};

// Standard error messages for reuse
const commonMessages = {
    name: {
        'string.max': 'Name must be less than or equal to 100 characters.',
        'string.pattern.base': 'Name contains invalid characters (only letters, spaces, hyphens, apostrophes allowed).',
        'string.invalidChars': 'Name contains potentially harmful characters or keywords.',
        'string.empty': 'Name is required.',
        'any.required': 'Name is required.',
    },
    email: {
        'string.max': 'Email must be less than or equal to 254 characters.',
        'string.email': 'Please provide a valid email address.',
        'string.invalidChars': 'Email contains potentially harmful characters or keywords.',
        'string.empty': 'Email is required.',
        'any.required': 'Email is required.',
    },
    password: {
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must be less than or equal to 72 characters.', // bcrypt limit
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.',
    },
    phoneNumber: {
        'string.pattern.base': 'Phone number must be in international format (e.g., +11234567890).',
        'string.empty': 'Phone number is required.',
        'any.required': 'Phone number is required.',
    },
    organizationName: {
        'string.max': 'Organization Name must be less than or equal to 150 characters.', // Increased slightly
        'string.invalidChars': 'Organization Name contains potentially harmful characters or keywords.',
        'string.empty': 'Organization Name is required.',
        'any.required': 'Organization Name is required.',
    }
};

// --- Specific Schemas ---

// Schema for Admin Signup
export const adminSchema = Joi.object({
    name: Joi.string().trim().max(100).required()
        .pattern(namePattern, { name: 'valid characters' })
        .custom(checkHarmfulChars, 'Harmful Character Check')
        .messages(commonMessages.name),

    email: Joi.string().trim().email({ minDomainSegments: 2 }).max(254).required()
        .custom(checkHarmfulChars, 'Harmful Character Check')
        .messages(commonMessages.email),

    // Use consistent password rules
    password: Joi.string().min(8).max(72).required()
        .messages(commonMessages.password),

    phoneNumber: Joi.string().trim().pattern(phonePattern).required()
        .custom(checkHarmfulChars, 'Harmful Character Check') // Check phone number too
        .messages(commonMessages.phoneNumber)

}).options({ abortEarly: false });


// Schema for Opportunity Provider Signup
export const providerSchema = Joi.object({
    organizationName: Joi.string().trim().max(150).required() // Slightly longer max for org names
        .custom(checkHarmfulChars, 'Harmful Character Check')
        .messages(commonMessages.organizationName),

    // Nested validation for contactPerson
    contactPerson: Joi.object({
        name: Joi.string().trim().max(100).required()
            .pattern(namePattern, { name: 'valid characters' })
            .custom(checkHarmfulChars, 'Harmful Character Check')
            .messages(commonMessages.name),

        email: Joi.string().trim().email({ minDomainSegments: 2 }).max(254).required()
            .custom(checkHarmfulChars, 'Harmful Character Check')
            .messages(commonMessages.email),

        phoneNumber: Joi.string().trim().pattern(phonePattern).required()
            .custom(checkHarmfulChars, 'Harmful Character Check')
            .messages(commonMessages.phoneNumber)

    }).required().messages({ // Message if contactPerson object itself is missing
        'any.required': 'Contact person details are required.',
        'object.base': 'Contact person details must be provided.',
    }),

    // Use consistent password rules
    password: Joi.string().min(8).max(72).required()
        .messages(commonMessages.password),

    profileStatus: Joi.string().valid('NOT_STARTED', 'STEP_1', 'STEP_2', 'COMPLETED').optional(),

}).options({ abortEarly: false });


// Schema for Volunteer Signup (Existing - Kept for completeness)
export const volunteerSchema = Joi.object({
    name: Joi.string().trim().max(100).required()
        .pattern(namePattern, { name: 'valid characters' })
        .custom(checkHarmfulChars, 'Harmful Character Check')
        .messages(commonMessages.name),

    email: Joi.string().trim().email({ minDomainSegments: 2 }).max(254).required()
        .custom(checkHarmfulChars, 'Harmful Character Check')
        .messages(commonMessages.email),

    password: Joi.string().min(8).max(72).required()
        .messages(commonMessages.password),

    profileStatus: Joi.string().valid('NOT_STARTED', 'STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED').optional(),

}).options({ abortEarly: false });


// Schema for OTP Verification (Existing)
export const otpSchema = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).max(254).required()
        .messages(commonMessages.email), // Re-use email messages

    otp: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required()
        .messages({
            'string.length': 'OTP must be exactly 6 digits.',
            'string.pattern.base': 'OTP must only contain digits (0-9).',
            'string.empty': 'OTP is required.',
            'any.required': 'OTP is required.',
        }),
}).options({ abortEarly: false });


// Schema for Generic Login (Existing)
export const loginSchema = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).max(254).required()
        .messages(commonMessages.email), // Re-use email messages

    password: Joi.string().max(72).required() // Max length only check for login
        .messages({
            'string.max': commonMessages.password['string.max'], // Re-use message
            'string.empty': commonMessages.password['string.empty'],
            'any.required': commonMessages.password['any.required'],
        }),
}).options({ abortEarly: false });