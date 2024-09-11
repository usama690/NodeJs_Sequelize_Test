import { Router } from 'express';
import { getAllJobs, getAllUnpaidJobs,payForJob } from '../controllers/jobController';

const router = Router();

router.get('/unpaid', getAllUnpaidJobs);
router.get('/', getAllJobs);
router.patch('/:id/pay', payForJob);

export default router;
