import express from 'express';
import {
    signup, 
    signupAdmin, 
    signupOpportunityProvider, 
    signupVolunteer,
    loginAdmin,
    loginOpportunityProvider,
    loginVolunteer
} from '../controllers/auth.controller.js';

const router = express.Router();

// Signup routes
router.post('/auth/admin/signup', signupAdmin);
router.post('/auth/provider/signup', signupOpportunityProvider);
router.post('/auth/volunteer/signup', signupVolunteer);

// Login routes
router.post('/auth/admin/login', loginAdmin);
router.post('/auth/opportunity-provider/login', loginOpportunityProvider);
router.post('/auth/volunteer/login', loginVolunteer);

export default router;