import express from 'express';
import { 
    getAllOpportunities, 
    getLatestOpportunities, 
    getOpportunitiesFeed,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
} from "../controllers/opportunity.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get('/', getAllOpportunities);
router.get('/latest', getLatestOpportunities);
router.get('/feed', getOpportunitiesFeed);

// Protected routes (require authentication)
router.post('/', authenticateToken, createOpportunity);
router.put('/:id', authenticateToken, updateOpportunity);
router.delete('/:id', authenticateToken, deleteOpportunity);

export default router;