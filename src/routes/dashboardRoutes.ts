import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard - Get dashboard data
router.get('/', getDashboardData);

export default router;
