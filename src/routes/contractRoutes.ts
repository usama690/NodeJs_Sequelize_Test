import { Router } from 'express';
import { getContractById, getAllContracts } from '../controllers/contractController';

const router = Router();

router.get('/', getAllContracts);
router.get('/:id', getContractById);

export default router;
