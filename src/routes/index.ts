import express, { Router } from 'express';
import { getProfile } from '../middleware/getProfile';  // Import your middleware
import profileRoutes from './profileRoutes';            // Import your profile routes
import contractRoutes from './contractRoutes';            // Import your profile routes
import jobRoutes from './jobRoutes';            // Import your profile routes
// Add other routes imports here if you have more, e.g., contractRoutes, jobRoutes, etc.

const router: Router = express.Router();

router.use(getProfile);

// Define routes
router.use('/profiles', profileRoutes);
router.use('/contracts', contractRoutes);
router.use('/jobs', jobRoutes);

export default router;
