import { Request, Response } from 'express';
import { DashboardData } from '../types';

// GET /api/dashboard - Get dashboard data
export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboardData: DashboardData = {
      daily: {
        sales: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 20
          },
          verdict: 'Penjualan meningkat dibanding kemarin'
        },
        purchase: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 20
          },
          verdict: 'Pembelian meningkat dibanding kemarin'
        },
        expense: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'DOWN',
            percentage: 12.5
          },
          verdict: 'Biaya meningkat dibanding kemarin'
        },
        profit: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 4.5
          },
          verdict: 'Profit meningkat dibanding kemarin'
        },
        balance: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 12.5
          },
          verdict: 'Saldo akhir meningkat dibanding kemarin'
        }
      },
      monthly: {
        sales: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 15
          },
          verdict: 'Penjualan meningkat dibanding bulan lalu'
        },
        purchase: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 10
          },
          verdict: 'Pembelian meningkat dibanding bulan lalu'
        },
        expense: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 8
          },
          verdict: 'Biaya meningkat dibanding bulan lalu'
        },
        profit: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 5
          },
          verdict: 'Profit meningkat dibanding bulan lalu'
        },
        balance: {
          amount: Math.floor(Math.random() * 10_000_000),
          change: {
            type: 'UP',
            percentage: 10
          },
          verdict: 'Saldo akhir meningkat dibanding bulan lalu'
        }
      }
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error });
  }
};
