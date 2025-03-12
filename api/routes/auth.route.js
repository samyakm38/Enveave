import express from 'express';
import {signup, signupAdmin, signupOpportunityProvider, signupVolunteer} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/admin/signup', signupAdmin);
router.post('/auth/provider/signup', signupOpportunityProvider);
router.post('/auth/volunteer/signup', signupVolunteer);

export default router;