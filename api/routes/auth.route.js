import express from 'express';
import {
    signup,
    signupAdmin,
    signupOpportunityProvider,
    signupVolunteer,
    loginAdmin,
    loginOpportunityProvider,
    loginVolunteer,
    verifyOtp,
    unifiedLogin,
    forgotPasswordRequest,
    forgotPasswordVerifyOtp,
    resetPassword
} from '../controllers/auth.controller.js';
import {applyOtpRateLimit, applyLoginRateLimit} from "../helpers/securityHelper.js";

const router = express.Router();

// Signup routes
router.post('/auth/admin/signup', signupAdmin);
router.post('/auth/opportunity-provider/signup', signupOpportunityProvider);
router.post('/auth/volunteer/signup', signupVolunteer);

// Unified login route (new) with rate limiting
router.post('/auth/login', applyLoginRateLimit, unifiedLogin);

// Individual login routes (kept for backward compatibility) with rate limiting
router.post('/auth/admin/login', applyLoginRateLimit, loginAdmin);
router.post('/auth/opportunity-provider/login', applyLoginRateLimit, loginOpportunityProvider);
router.post('/auth/volunteer/login', applyLoginRateLimit, loginVolunteer);

// Apply OTP specific rate limiting
router.post('/auth/volunteer/verify-otp', applyOtpRateLimit, verifyOtp);
router.post('/auth/opportunity-provider/verify-otp', applyOtpRateLimit, verifyOtp);

// Forgot Password Routes
router.post('/auth/forgot-password/request', applyOtpRateLimit, forgotPasswordRequest);
router.post('/auth/forgot-password/verify-otp', applyOtpRateLimit, forgotPasswordVerifyOtp);
router.post('/auth/forgot-password/reset', applyOtpRateLimit, resetPassword);

export default router;