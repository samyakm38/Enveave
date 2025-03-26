// helpers/securityHelper.js
// In-memory store for tracking failed attempts


import {env} from "../config/env.js";

export const failedAttempts = new Map();

// Sanitize Input Function
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/['"\\;-]/g, ''); // Remove quotes, apostrophes, hyphens, semicolons
};

// Sanitize Nested Object
export const sanitizeNestedObject = (obj) => {
    const sanitized = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitized[key] = sanitizeNestedObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }
    return sanitized;
};

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