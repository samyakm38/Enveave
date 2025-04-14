import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../helpers/imageUpload.js';

// Create router
const router = express.Router();

// Apply authentication middleware to all admin routes
// The requireAdmin middleware ensures only admin users can access these endpoints
router.use(authenticateToken);
router.use(requireAdmin);

// --- Dashboard Statistics Route ---
router.get('/stats', adminController.getDashboardStats);

// --- Admin Profile Route ---
router.get('/profile', adminController.getAdminProfile);

// --- Organizations Routes ---
router.get('/organizations', adminController.getAllOrganizations);
router.delete('/organizations/:id', adminController.deleteOrganization);

// --- Volunteers Routes ---
router.get('/volunteers', adminController.getAllVolunteers);
router.delete('/volunteers/:id', adminController.deleteVolunteer);

// --- Opportunities Routes ---
router.get('/opportunities', adminController.getAllOpportunities);
router.delete('/opportunities/:id', adminController.deleteOpportunity);

// --- Stories Routes ---
router.get('/stories', adminController.getAllStories);
router.post('/stories', upload.single('photo'), adminController.createStory);
router.delete('/stories/:id', adminController.deleteStory);

export default router;
