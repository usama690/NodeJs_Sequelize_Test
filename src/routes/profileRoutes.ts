import { Router } from 'express';
import { depositMoney, getAllProfiles, getBestClients, getBestProfession } from '../controllers/profileController';

const router = Router();

router.get('/', getAllProfiles);
router.patch('/balances/deposit', depositMoney);
router.get('/admin/best-profession', getBestProfession);
router.get('/admin/best-clients', getBestClients);

export default router;
