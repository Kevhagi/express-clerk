import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { DashboardService } from '../services/dashboardService.js';

const router = Router();

// GET /api/dashboard - Get dashboard data
router.get('/', getDashboardData);



// GET /api/dashboard/debug/purchase - Debug purchase calculation for a specific date
router.get('/debug/purchase', async (req, res) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const debugData = await DashboardService.debugPurchaseCalculation(date);
    res.json({
      date,
      debug_data: debugData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to debug purchase calculation', details: error });
  }
});

// GET /api/dashboard/debug/monthly - Debug monthly date calculations
router.get('/debug/monthly', async (req, res) => {
  try {
    const debugData = await DashboardService.debugMonthlyDates();
    res.json(debugData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to debug monthly dates', details: error });
  }
});

export default router;
