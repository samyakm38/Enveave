import express from 'express';
import { 
    getProviderProfile,
    getProviderStats,
    updateProviderProfile,
    uploadProviderLogo,
    getProviderDashboard
} from "../controllers/provider.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { upload } from "../helpers/imageUpload.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Provider profile routes
router.get('/profile', getProviderProfile);
router.put('/profile', updateProviderProfile);

// Provider stats route
router.get('/stats', getProviderStats);

// Provider dashboard route (provides opportunities and stats)
router.get('/dashboard', getProviderDashboard);

// Provider logo upload route
router.post('/upload-logo', upload.single('logo'), uploadProviderLogo);

export default router;