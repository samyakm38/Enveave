import express from 'express';
import { 
  sendMessage, 
  getHistory, 
  clearHistory,
  submitFeedback,
  getSuggestions 
} from '../controllers/chatbot.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/message', sendMessage);
router.post('/suggestions', getSuggestions);

// Protected routes (require authentication)
router.get('/history', authenticateToken, getHistory);
router.delete('/history', authenticateToken, clearHistory);
router.post('/feedback', authenticateToken, submitFeedback);

export default router;
