import express from 'express';
import {
    getAllOpportunities,
    getLatestOpportunities,
    getOpportunitiesFeed,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    completeOpportunity,
    cancelOpportunity,
    getProviderOpportunities, 
    getIndividualOpporunity
} from "../controllers/opportunity.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { upload } from "../helpers/imageUpload.js";

const router = express.Router();

// Public routes
router.get('/', getAllOpportunities);
router.get('/latest', getLatestOpportunities);
router.get('/feed', getOpportunitiesFeed);

// Protected routes (require authentication)
router.post('/', authenticateToken, upload.single('photo'), createOpportunity);

// IMPORTANT: Provider route must come BEFORE the /:id route to avoid conflict
router.get('/provider', authenticateToken, getProviderOpportunities);

// The wildcard route should come after all specific routes
router.get('/:id', getIndividualOpporunity);

router.put('/:id', authenticateToken, upload.single('photo'), updateOpportunity);
router.delete('/:id', authenticateToken, deleteOpportunity);
router.put('/:id/complete', authenticateToken, completeOpportunity);
router.put('/:id/cancel', authenticateToken, cancelOpportunity);

export default router;