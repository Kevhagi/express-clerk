import { QueryTypes } from 'sequelize';
import { sequelize } from '../models/index.js';
import { DashboardData, MetricData } from '../types/index.js';

// Cache for dashboard data (5 minutes TTL)
interface CacheEntry {
  data: DashboardData;
  timestamp: number;
}

const DASHBOARD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
let dashboardCache: CacheEntry | null = null;

export class DashboardService {
  // Helper method to calculate month start and end dates
  private static getMonthDateRange(date: Date, isCurrentMonth: boolean = true): {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
  } {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    let startMonth, endMonth;
    
    if (isCurrentMonth) {
      startMonth = month;
      endMonth = month;
    } else {
      startMonth = month - 1;
      endMonth = month - 1;
    }
    
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, endMonth + 1, 0); // Last day of the month
    
    // Ensure we have the correct start and end times for the full day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return {
      start,
      end,
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0]
    };
  }

  private static calculateChange(current: number, previous: number): { type: 'UP' | 'DOWN' | 'STAY', percentage: number } {
    if (previous === 0) {
      if (current > 0) return { type: 'UP', percentage: 100 };
      if (current < 0) return { type: 'DOWN', percentage: 100 };
      return { type: 'STAY', percentage: 0 };
    }
    
    const change = ((current - previous) / previous) * 100;
    const roundedChange = Math.round(Math.abs(change) * 100) / 100; // Round to 2 decimal places
    
    if (roundedChange === 0) {
      return { type: 'STAY', percentage: 0 };
    }
    
    return {
      type: change > 0 ? 'UP' : 'DOWN',
      percentage: roundedChange
    };
  }

  private static getVerdict(metric: string, change: { type: 'UP' | 'DOWN' | 'STAY', percentage: number }, current: number, previous: number, periodLabel: string): string {
    // Handle case when current === 0 for daily comparisons
    if (current === 0 && periodLabel === 'kemarin') {
      switch (metric) {
        case 'sales':
          return 'Belum ada penjualan untuk hari ini';
        case 'purchase':
          return 'Belum ada pembelian untuk hari ini';
        case 'expense':
          return 'Belum ada pengeluaran untuk hari ini';
        case 'profit':
          return 'Belum ada profit untuk hari ini';
        case 'initial_balance':
          return 'Belum ada saldo awal untuk hari ini';
        case 'final_balance':
          return 'Belum ada saldo akhir untuk hari ini';
        default:
          return 'Belum ada aktivitas untuk hari ini';
      }
    }
    
    switch (change.type) {
      case 'UP':
        switch (metric) {
          case 'sales':
            if (previous === 0) {
              return `Penjualan meningkat, ${periodLabel} tidak ada penjualan`;
            }
            return `Penjualan meningkat dibandingkan ${periodLabel}`;
          case 'purchase':
            if (previous === 0) {
              return `Pembelian meningkat, ${periodLabel} tidak ada pembelian`;
            }
            return `Pembelian meningkat dibandingkan ${periodLabel}`;
          case 'expense':
            if (previous === 0) {
              return `Biaya meningkat, ${periodLabel} tidak ada pengeluaran`;
            }
            return 'Biaya meningkat, coba evaluasi';
          case 'profit':
            if (previous === 0) {
              return `Untung dibandingkan ${periodLabel}, ${periodLabel} hanya balik modal`;
            }
            if (current < 0) {
              return `Masih rugi, tetapi keuntungan meningkat dibandingkan ${periodLabel}`;
            }
            return 'Keuntungan meningkat, pertahankan';
          case 'initial_balance':
            return 'Saldo awal meningkat';
          case 'final_balance':
            return 'Saldo akhir meningkat';
          default:
            return `Meningkat dibandingkan ${periodLabel}`;
        }
      case 'DOWN':
        switch (metric) {
          case 'sales':
            return `Penjualan menurun dibandingkan ${periodLabel}`;
          case 'purchase':
            return `Pembelian menurun dibandingkan ${periodLabel}`;
          case 'expense':
            return 'Biaya menurun, pertahankan';
          case 'profit':
            if (previous === 0) {
              return `Rugi dibandingkan ${periodLabel}`;
            }
            if (current < 0) {
              return `Rugi dibandingkan ${periodLabel}`;
            }
            return 'Keuntungan menurun, coba evaluasi';
          case 'initial_balance':
            return 'Saldo awal menurun';
          case 'final_balance':
            return 'Saldo akhir menurun';
          default:
            return `Menurun dibandingkan ${periodLabel}`;
        }
      case 'STAY':
        switch (metric) {
          case 'sales':
            return 'Penjualan stabil';
          case 'purchase':
            return 'Pembelian stabil';
          case 'expense':
            return 'Biaya stabil';
          case 'profit':
            return 'Profit stabil';
          case 'initial_balance':
            return 'Saldo awal stabil';
          case 'final_balance':
            return 'Saldo akhir stabil';
          default:
            return 'Stabil';
        }
    }
  }



  private static async calculatePeriodData(
    currentStartDate: string, 
    currentEndDate: string, 
    previousStartDate: string, 
    previousEndDate: string,
    periodLabel: string
  ): Promise<{
    sales: MetricData;
    purchase: MetricData;
    expense: MetricData;
    profit: MetricData;
    initial_balance: MetricData;
    final_balance: MetricData;
  }> {
    // Optimized query using LAG() function for better analytics
    const result = await sequelize.query(`
      WITH current_period_sales AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_sales
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'sell' 
          AND t.transaction_date BETWEEN :currentStartDate AND :currentEndDate
      ),
      current_period_purchase AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_purchase
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'buy' 
          AND t.transaction_date BETWEEN :currentStartDate AND :currentEndDate
      ),
      current_period_expense AS (
        SELECT COALESCE(SUM(te.amount), 0) as total_expense
        FROM transactions t
        INNER JOIN transaction_expenses te ON t.id = te.transaction_id
        WHERE t.transaction_date BETWEEN :currentStartDate AND :currentEndDate
      ),
      previous_period_sales AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_sales
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'sell' 
          AND t.transaction_date BETWEEN :previousStartDate AND :previousEndDate
      ),
      previous_period_purchase AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_purchase
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'buy' 
          AND t.transaction_date BETWEEN :previousStartDate AND :previousEndDate
      ),
      previous_period_expense AS (
        SELECT COALESCE(SUM(te.amount), 0) as total_expense
        FROM transactions t
        INNER JOIN transaction_expenses te ON t.id = te.transaction_id
        WHERE t.transaction_date BETWEEN :previousStartDate AND :previousEndDate
      )
      SELECT 
        cps.total_sales as current_sales,
        cpp.total_purchase as current_purchase,
        cpe.total_expense as current_expense,
        (cps.total_sales - cpp.total_purchase - cpe.total_expense) as current_profit,
        0 as current_initial_balance, -- Hardcoded as requested
        0 as current_final_balance,   -- Hardcoded as requested
        pps.total_sales as previous_sales,
        ppp.total_purchase as previous_purchase,
        ppe.total_expense as previous_expense,
        (pps.total_sales - ppp.total_purchase - ppe.total_expense) as previous_profit,
        0 as previous_initial_balance, -- Hardcoded as requested
        0 as previous_final_balance    -- Hardcoded as requested
      FROM current_period_sales cps
      CROSS JOIN current_period_purchase cpp
      CROSS JOIN current_period_expense cpe
      CROSS JOIN previous_period_sales pps
      CROSS JOIN previous_period_purchase ppp
      CROSS JOIN previous_period_expense ppe
    `, {
      replacements: { 
        currentStartDate, 
        currentEndDate, 
        previousStartDate, 
        previousEndDate 
      },
      type: QueryTypes.SELECT,
      raw: true
    });

    const data = result[0] as any;

    return {
      sales: {
        amount: parseFloat(data?.current_sales || '0'),
        change: this.calculateChange(parseFloat(data?.current_sales || '0'), parseFloat(data?.previous_sales || '0')),
        verdict: this.getVerdict('sales', this.calculateChange(parseFloat(data?.current_sales || '0'), parseFloat(data?.previous_sales || '0')), parseFloat(data?.current_sales || '0'), parseFloat(data?.previous_sales || '0'), periodLabel)
      },
      purchase: {
        amount: parseFloat(data?.current_purchase || '0'),
        change: this.calculateChange(parseFloat(data?.current_purchase || '0'), parseFloat(data?.previous_purchase || '0')),
        verdict: this.getVerdict('purchase', this.calculateChange(parseFloat(data?.current_purchase || '0'), parseFloat(data?.previous_purchase || '0')), parseFloat(data?.current_purchase || '0'), parseFloat(data?.previous_purchase || '0'), periodLabel)
      },
      expense: {
        amount: parseFloat(data?.current_expense || '0'),
        change: this.calculateChange(parseFloat(data?.current_expense || '0'), parseFloat(data?.previous_expense || '0')),
        verdict: this.getVerdict('expense', this.calculateChange(parseFloat(data?.current_expense || '0'), parseFloat(data?.previous_expense || '0')), parseFloat(data?.current_expense || '0'), parseFloat(data?.previous_expense || '0'), periodLabel)
      },
      profit: {
        amount: parseFloat(data?.current_profit || '0'),
        change: this.calculateChange(parseFloat(data?.current_profit || '0'), parseFloat(data?.previous_profit || '0')),
        verdict: this.getVerdict('profit', this.calculateChange(parseFloat(data?.current_profit || '0'), parseFloat(data?.previous_profit || '0')), parseFloat(data?.current_profit || '0'), parseFloat(data?.previous_profit || '0'), periodLabel)
      },
      initial_balance: {
        amount: parseFloat(data?.current_initial_balance || '0'),
        change: this.calculateChange(parseFloat(data?.current_initial_balance || '0'), parseFloat(data?.previous_initial_balance || '0')),
        verdict: this.getVerdict('initial_balance', this.calculateChange(parseFloat(data?.current_initial_balance || '0'), parseFloat(data?.previous_initial_balance || '0')), parseFloat(data?.current_initial_balance || '0'), parseFloat(data?.previous_initial_balance || '0'), periodLabel)
      },
      final_balance: {
        amount: parseFloat(data?.current_final_balance || '0'),
        change: this.calculateChange(parseFloat(data?.current_final_balance || '0'), parseFloat(data?.previous_final_balance || '0')),
        verdict: this.getVerdict('final_balance', this.calculateChange(parseFloat(data?.current_final_balance || '0'), parseFloat(data?.previous_final_balance || '0')), parseFloat(data?.current_final_balance || '0'), parseFloat(data?.previous_final_balance || '0'), periodLabel)
      }
    };
  }

  static async getDashboardData(): Promise<DashboardData> {
    // Check cache first
    if (dashboardCache && (Date.now() - dashboardCache.timestamp) < DASHBOARD_CACHE_TTL) {
      return dashboardCache.data;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dayBeforeYesterday = new Date(yesterday);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

    // Format dates as YYYY-MM-DD
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0];

    // Calculate monthly data using helper method
    const currentMonth = this.getMonthDateRange(today, true);
    const previousMonth = this.getMonthDateRange(today, false);

    // Debug log for monthly dates
    console.log('Monthly Date Debug:', {
      currentMonthStart: currentMonth.startStr,
      currentMonthEnd: currentMonth.endStr,
      previousMonthStart: previousMonth.startStr,
      previousMonthEnd: previousMonth.endStr,
      currentMonthStartFull: currentMonth.start.toISOString(),
      currentMonthEndFull: currentMonth.end.toISOString(),
      previousMonthStartFull: previousMonth.start.toISOString(),
      previousMonthEndFull: previousMonth.end.toISOString()
    });

    const [daily, monthly] = await Promise.all([
      this.calculatePeriodData(todayStr, todayStr, yesterdayStr, yesterdayStr, 'kemarin'),
      this.calculatePeriodData(currentMonth.startStr, currentMonth.endStr, previousMonth.startStr, previousMonth.endStr, 'bulan lalu')
    ]);

    const dashboardData = {
      daily,
      monthly
    };

    // Cache the result
    dashboardCache = {
      data: dashboardData,
      timestamp: Date.now()
    };

    return dashboardData;
  }

  // Method to clear cache (useful for testing or manual cache invalidation)
  static clearCache(): void {
    dashboardCache = null;
  }

  // Debug method to check purchase calculation
  static async debugPurchaseCalculation(date: string): Promise<any> {
    const result = await sequelize.query(`
      SELECT 
        t.id as transaction_id,
        t.type,
        t.transaction_date,
        ti.subtotal as item_subtotal,
        t.total as transaction_total
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      WHERE t.type = 'buy' 
        AND DATE(t.transaction_date) = :date
      ORDER BY t.transaction_date
    `, {
      replacements: { date },
      type: QueryTypes.SELECT,
      raw: true
    });

    return result;
  }

  // Debug method to check monthly date calculations
  static async debugMonthlyDates(): Promise<any> {
    const today = new Date();
    
    const currentMonth = this.getMonthDateRange(today, true);
    const previousMonth = this.getMonthDateRange(today, false);

    // Test the monthly calculation
    const result = await sequelize.query(`
      WITH current_period_sales AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_sales
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'sell' 
          AND t.transaction_date BETWEEN :currentMonthStart AND :currentMonthEnd
      ),
      current_period_purchase AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_purchase
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'buy' 
          AND t.transaction_date BETWEEN :currentMonthStart AND :currentMonthEnd
      ),
      previous_period_sales AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_sales
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'sell' 
          AND t.transaction_date BETWEEN :previousMonthStart AND :previousMonthEnd
      ),
      previous_period_purchase AS (
        SELECT COALESCE(SUM(ti.subtotal), 0) as total_purchase
        FROM transactions t
        INNER JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE t.type = 'buy' 
          AND t.transaction_date BETWEEN :previousMonthStart AND :previousMonthEnd
      )
      SELECT 
        cps.total_sales as current_sales,
        cpp.total_purchase as current_purchase,
        pps.total_sales as previous_sales,
        ppp.total_purchase as previous_purchase
      FROM current_period_sales cps
      CROSS JOIN current_period_purchase cpp
      CROSS JOIN previous_period_sales pps
      CROSS JOIN previous_period_purchase ppp
    `, {
      replacements: { 
        currentMonthStart: currentMonth.startStr,
        currentMonthEnd: currentMonth.endStr,
        previousMonthStart: previousMonth.startStr,
        previousMonthEnd: previousMonth.endStr
      },
      type: QueryTypes.SELECT,
      raw: true
    });

    return {
      dates: {
        currentMonthStart: currentMonth.startStr,
        currentMonthEnd: currentMonth.endStr,
        previousMonthStart: previousMonth.startStr,
        previousMonthEnd: previousMonth.endStr
      },
      data: result[0]
    };
  }

  // Historical trend analysis using LAG() function
  static async getTrendAnalysis(days: number = 30): Promise<{
    date: string;
    sales: number;
    purchase: number;
    expense: number;
    profit: number;
    sales_trend: number; // LAG comparison
    purchase_trend: number; // LAG comparison
    expense_trend: number; // LAG comparison
    profit_trend: number; // LAG comparison
  }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await sequelize.query(`
      WITH daily_metrics AS (
        SELECT 
          DATE(t.transaction_date) as date,
          COALESCE(SUM(CASE WHEN t.type = 'sell' THEN ti.subtotal ELSE 0 END), 0) as sales,
          COALESCE(SUM(CASE WHEN t.type = 'buy' THEN ti.subtotal ELSE 0 END), 0) as purchase,
          COALESCE(SUM(te.amount), 0) as expense,
          (COALESCE(SUM(CASE WHEN t.type = 'sell' THEN ti.subtotal ELSE 0 END), 0) - 
           COALESCE(SUM(CASE WHEN t.type = 'buy' THEN ti.subtotal ELSE 0 END), 0) - 
           COALESCE(SUM(te.amount), 0)) as profit
        FROM transactions t
        LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
        LEFT JOIN transaction_expenses te ON t.id = te.transaction_id
        WHERE t.transaction_date BETWEEN :startDate AND :endDate
        GROUP BY DATE(t.transaction_date)
      ),
      metrics_with_lag AS (
        SELECT 
          date,
          sales,
          purchase,
          expense,
          profit,
          -- LAG() function to get previous day values for trend calculation
          LAG(sales, 1) OVER (ORDER BY date) as prev_sales,
          LAG(purchase, 1) OVER (ORDER BY date) as prev_purchase,
          LAG(expense, 1) OVER (ORDER BY date) as prev_expense,
          LAG(profit, 1) OVER (ORDER BY date) as prev_profit,
          -- Moving averages for trend smoothing
          AVG(sales) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as sales_7day_avg,
          AVG(purchase) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as purchase_7day_avg,
          AVG(expense) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as expense_7day_avg,
          AVG(profit) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as profit_7day_avg
        FROM daily_metrics
      )
      SELECT 
        date,
        sales,
        purchase,
        expense,
        profit,
        -- Trend calculation (day-over-day change) - rounded to 2 decimal places
        CASE 
          WHEN prev_sales = 0 THEN 0 
          ELSE ROUND(((sales - prev_sales) / prev_sales) * 100, 2)
        END as sales_trend,
        CASE 
          WHEN prev_purchase = 0 THEN 0 
          ELSE ROUND(((purchase - prev_purchase) / prev_purchase) * 100, 2)
        END as purchase_trend,
        CASE 
          WHEN prev_expense = 0 THEN 0 
          ELSE ROUND(((expense - prev_expense) / prev_expense) * 100, 2)
        END as expense_trend,
        CASE 
          WHEN prev_profit = 0 THEN 0 
          ELSE ROUND(((profit - prev_profit) / prev_profit) * 100, 2)
        END as profit_trend
      FROM metrics_with_lag
      ORDER BY date DESC
      LIMIT :days
    `, {
      replacements: { 
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days
      },
      type: QueryTypes.SELECT,
      raw: true
    });

    return result as any[];
  }
}
