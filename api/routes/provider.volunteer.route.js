import express from 'express';
import { getVolunteerById } from '../controllers/provider.volunteer.controller.js';
import { authenticateToken, requireProvider } from '../middleware/auth.middleware.js';

const router = express.Router();

// Provider routes to access volunteer information
router.get('/volunteers/:id', authenticateToken, requireProvider, getVolunteerById);

export default router;
