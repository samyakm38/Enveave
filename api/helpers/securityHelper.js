// api/helpers/securityHelper.js
import { env } from "../config/env.js"; // Ensure env is correctly imported

// Store for failed LOGIN attempts
export const failedLoginAttempts = new Map();
// Store for failed OTP verification attempts
export const failedOtpAttempts = new Map();

// Improved Sanitize Input Function (Stricter based on guidelines)
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Disallow ' " \ ; -- and SQL keywords (case-insensitive)
    // Added common SQL keywords and structure manipulators
    const forbiddenChars = /['"\\;]|--/g;
    const forbiddenKeywords = /\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|DECLARE|CAST|CONVERT)\b/i;
    // Remove null bytes which can cause issues
    let sanitized = input.replace(/\0/g, '');
    sanitized = sanitized.replace(forbiddenChars, ''); // Remove forbidden characters
    sanitized = sanitized.replace(forbiddenKeywords, ''); // Remove known SQL keywords
    // Trim whitespace after sanitization
    return sanitized.trim();
};

// Sanitize Nested Object (Uses updated sanitizeInput)
export const sanitizeNestedObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj; // Handle non-objects

    const sanitized = {};
    for (const key in obj) {
        // Ensure we only process own properties
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                sanitized[key] = sanitizeInput(value);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
                // Recursively sanitize nested plain objects
                sanitized[key] = sanitizeNestedObject(value);
            } else {
                // Keep other types (numbers, booleans, arrays, dates, null) as is
                sanitized[key] = value;
            }
        }
    }
    return sanitized;
};


// --- Reusable Rate Limiting Logic ---

// Generic Rate Limiting Middleware Factory
const createRateLimiter = (attemptsMap, maxAttemptsConfigKey, lockoutDurationConfigKey, identifierKey = 'email') => {
    return async (req, res, next) => {
        const identifier = req.body?.[identifierKey];

        if (!identifier || typeof identifier !== 'string') {
            // Cannot apply rate limiting without a valid string identifier
            return next();
        }

        // Sanitize the identifier before using it
        const sanitizedIdentifier = sanitizeInput(identifier);
        if (!sanitizedIdentifier) {
            // If sanitization removes the identifier entirely, it's invalid
            return res.status(400).json({ message: 'Invalid identifier provided.' });
        }

        const now = Date.now();
        // Use sanitized identifier as the key in the map
        const attempt = attemptsMap.get(sanitizedIdentifier) || { count: 0, lastAttempt: 0, lockedUntil: 0 };

        // Read limits from environment config, using keys provided
        const maxAttempts = env[maxAttemptsConfigKey];
        const lockoutDuration = env[lockoutDurationConfigKey];

        // Check if locked out
        if (attempt.lockedUntil > now) {
            const remainingTime = Math.ceil((attempt.lockedUntil - now) / 1000);
            return res.status(429).json({ message: `Too many attempts. Try again in ${remainingTime} seconds.` });
        }

        // Apply increasing delay *before* processing the request (after the first failed attempt)
        // Guideline: Delays between failed login attempts
        const delay = Math.min(attempt.count * 1000, 5000); // e.g., 1s, 2s, ..., up to 5s delay
        if (attempt.count > 0 && delay > 0) {
            console.log(`Applying delay of ${delay}ms for identifier: ${sanitizedIdentifier} (Attempt ${attempt.count + 1})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Attach attempt info to request for controllers to use
        req.attemptInfo = {
            map: attemptsMap,
            key: sanitizedIdentifier, // Use sanitized key
            currentAttempt: attempt,
            maxAttempts: maxAttempts,
            lockoutDuration: lockoutDuration
        };

        next();
    };
};

// Create specific middleware instances using the factory
// Pass the KEYS from the 'env' object for configuration
export const applyLoginRateLimit = createRateLimiter(failedLoginAttempts, 'maxLoginAttempts', 'loginLockoutDuration', 'email');
export const applyOtpRateLimit = createRateLimiter(failedOtpAttempts, 'maxOtpAttempts', 'otpLockoutDuration', 'email');

// Helper function for controllers to record a failed attempt
export const recordFailedAttempt = (req) => {
    if (!req.attemptInfo) {
        // console.warn("recordFailedAttempt called but req.attemptInfo is missing.");
        return;
    }

    const { map, key, currentAttempt, maxAttempts, lockoutDuration } = req.attemptInfo;
    const now = Date.now();
    currentAttempt.count = (currentAttempt.count || 0) + 1;
    currentAttempt.lastAttempt = now;

    console.log(`Failed attempt ${currentAttempt.count}/${maxAttempts} recorded for: ${key}`);

    if (currentAttempt.count >= maxAttempts) {
        currentAttempt.lockedUntil = now + lockoutDuration;
        console.log(`Account locked for ${key} until ${new Date(currentAttempt.lockedUntil).toISOString()}`);
    }
    map.set(key, currentAttempt); // Update the map with the modified attempt object
};

// Helper function for controllers to reset attempts on success
export const resetAttempts = (req) => {
    if (!req.attemptInfo) {
        // console.warn("resetAttempts called but req.attemptInfo is missing.");
        return;
    }
    const { map, key } = req.attemptInfo;
    if (map.has(key)) {
        map.delete(key);
        console.log(`Cleared failed attempts cache for: ${key}`);
    }
};
export const failedAttempts = new Map();
// Middleware for Increasing Delay and Lockout
export const applySignupDelay = async (req, res, next) => {
    // Only apply delay and lockout logic to signup routes
    if (!req.path.endsWith('/signup')) return next();

    const email = req.body.email || (req.body.contactPerson && req.body.contactPerson.email);
    if (!email) return next();

    const now = Date.now();
    const attempt = failedAttempts.get(email) || { count: 0, lastAttempt: 0, lockedUntil: 0 };
    const { lockoutDuration, maxAttempts } = env;

    if (attempt.lockedUntil > now) {
        const remainingTime = Math.ceil((attempt.lockedUntil - now) / 1000);
        return res.status(429).json({ message: `Account locked. Try again in ${remainingTime} seconds.` });
    }

    const delay = Math.min(attempt.count * 1000, 5000); // Increase delay up to 5 seconds
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    req.attempt = attempt;
    next();
};