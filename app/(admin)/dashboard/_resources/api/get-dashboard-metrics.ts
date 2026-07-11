import { apiClient } from "@/lib/api/api-client";

export interface FeeRecordStatusBreakdown {
  pending: number;
  partiallyPaid: number;
  paid: number;
  overdue: number;
}

export interface RecentPayment {
  id: string;
  reference: string;
  transactionReference: string;
  amount: number;
  status: string;
  paidAt: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
}

export interface DashboardTotals {
  totalCollected: number;
  totalOutstandingBalance: number;
  totalPartialPayments: number;
  collectionRate: number;
  overdueAmount: number;
  dueSoonInstallmentsCount: number;
  pendingPaymentsCount: number;
}

export interface DashboardMetricsData {
  totals: DashboardTotals;
  feeRecordStatusBreakdown: FeeRecordStatusBreakdown;
  recentPayments: RecentPayment[];
}

export interface DashboardMetricsResponse {
  success: boolean;
  data: DashboardMetricsData;
}

type DashboardMetricsRequestParams = {
  recentLimit?: number;
};

async function getDashboardMetrics({
  recentLimit = 5,
}: DashboardMetricsRequestParams = {}): Promise<DashboardMetricsResponse> {
  const response = await apiClient.get({
    url: `/dashboard?recentLimit=${recentLimit}`,
  });
  return response.data as DashboardMetricsResponse;
}

export { getDashboardMetrics };
