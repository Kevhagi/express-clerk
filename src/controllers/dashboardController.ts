import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService.js';

// GET /api/dashboard - Get dashboard data
export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboardData = await DashboardService.getDashboardData();

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error });
  }
};
