import express from 'express';
import {
    signup,
    signupAdmin,
    signupOpportunityProvider,
    signupVolunteer,
    loginAdmin,
    loginOpportunityProvider,
    loginVolunteer, verifyOtp
} from '../controllers/auth.controller.js';
import {applyOtpRateLimit} from "../helpers/securityHelper.js";

const router = express.Router();

// Signup routes
router.post('/auth/admin/signup', signupAdmin);
router.post('/auth/opportunity-provider/signup', signupOpportunityProvider);
router.post('/auth/volunteer/signup', signupVolunteer);

// Login routes
router.post('/auth/admin/login', loginAdmin);
router.post('/auth/opportunity-provider/login', loginOpportunityProvider);
router.post('/auth/volunteer/login', loginVolunteer);

// Apply OTP specific rate limiting
router.post('/auth/volunteer/verify-otp', applyOtpRateLimit, verifyOtp);
router.post('/auth/opportunity-provider/verify-otp',applyOtpRateLimit, verifyOtp);


export default router;