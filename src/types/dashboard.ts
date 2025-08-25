export type ChangeType = 'UP' | 'DOWN' | 'STAY';

export interface ChangeData {
  type: ChangeType;
  percentage: number;
}

export interface MetricData {
  amount: number;
  change: ChangeData;
  verdict: string;
}

export interface DashboardPeriod {
  sales: MetricData;
  purchase: MetricData;
  expense: MetricData;
  profit: MetricData;
  initial_balance: MetricData;
  final_balance: MetricData;
}

export interface DashboardData {
  daily: DashboardPeriod;
  monthly: DashboardPeriod;
}
