// filepath: d:\Enveave-SDOS\api\routes\application.route.js
import express from 'express';
import { 
    getAllApplications,
    getOpportunityApplications,
    getUserApplications,
    getApplicationById,
    submitApplication,
    updateApplicationStatus,
    updateCompletionStatus,
    withdrawApplication
} from '../controllers/application.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes (all require authentication)
router.get('/', authenticateToken, getAllApplications);
router.get('/opportunity/:opportunityId', authenticateToken, getOpportunityApplications);
router.get('/user', authenticateToken, getUserApplications);
router.get('/:id', authenticateToken, getApplicationById);
router.post('/', authenticateToken, submitApplication);
router.patch('/:id/status', authenticateToken, updateApplicationStatus);
router.patch('/:id/complete', authenticateToken, updateCompletionStatus);
router.delete('/:id', authenticateToken, withdrawApplication);

export default router;