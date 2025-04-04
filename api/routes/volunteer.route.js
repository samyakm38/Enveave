import express from 'express';
import { 
    test, 
    getVolunteerProfile,
    updateBasicDetails,
    updateInterests,
    updateEngagement,
    uploadProfilePhoto,
    updateProfileStatus
} from '../controllers/volunteer.controller.js';
import { authenticateToken, requireVolunteer } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test route
router.get('/test', test);

// Profile routes - all secured with authentication
router.get('/profile', authenticateToken, requireVolunteer, getVolunteerProfile);
router.put('/profile/basic', authenticateToken, requireVolunteer, updateBasicDetails);
router.put('/profile/interests', authenticateToken, requireVolunteer, updateInterests);
router.put('/profile/engagement', authenticateToken, requireVolunteer, updateEngagement);
router.post('/profile/photo', authenticateToken, requireVolunteer, uploadProfilePhoto);
router.put('/profile/status', authenticateToken, requireVolunteer, updateProfileStatus);

export default router;