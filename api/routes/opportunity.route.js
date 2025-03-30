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
import { upload } from "../helpers/imageUpload.js";

const router = express.Router();

// Public routes
router.get('/', getAllOpportunities);
router.get('/latest', getLatestOpportunities);
router.get('/feed', getOpportunitiesFeed);

// Protected routes (require authentication)
router.post('/', authenticateToken, upload.single('photo'), createOpportunity);
router.put('/:id', authenticateToken, upload.single('photo'), updateOpportunity);
router.delete('/:id', authenticateToken, deleteOpportunity);

export default router;