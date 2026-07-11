import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

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
  recentPaymentsPagination: Pagination;
}

export interface DashboardMetricsResponse {
  success: boolean;
  data: DashboardMetricsData;
}

type DashboardMetricsRequestParams = {
  page?: number;
  limit?: number;
};

async function getDashboardMetrics({
  page = 1,
  limit = 5,
}: DashboardMetricsRequestParams = {}): Promise<DashboardMetricsResponse> {
  const response = await apiClient.get({
    url: `/dashboard?limit=${limit}&page=${page}`,
  });
  return response.data as DashboardMetricsResponse;
}

export { getDashboardMetrics };
