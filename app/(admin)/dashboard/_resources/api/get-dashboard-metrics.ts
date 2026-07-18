import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export interface DashboardTotals {
  totalBilled: number;
  totalCollected: number;
  totalOutstandingBalance: number;
  fullyUnpaidOutstandingBalance: number;
  partiallyPaidOutstandingBalance: number;
  partiallyPaidFeeRecordsCount: number;
  partiallyPaidFeeRecordsPercentage: number;
  collectionRate: number;
  overdueAmount: number;
  dueSoonInstallmentsCount: number;
  dueSoonInstallmentsPercentage: number;
  pendingPaymentsCount: number;
  pendingPaymentsPercentage: number;
}

export interface FeeRecordStatusBreakdown {
  pending: number;
  partiallyPaid: number;
  paid: number;
  overdue: number;
}

export interface RecentPaymentInstallment {
  id: string;
  sequence: number;
  dueDate: string; // ISO 8601
}

export interface RecentPaymentFeeRecord {
  id: string;
  title: string;
  status: string;
}

export interface RecentPaymentStudent {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
}

export interface RecentPayment {
  id: string;
  reference: string;
  transactionReference: string;
  amount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  paidAt: string | null;
  createdAt: string;

  installment: RecentPaymentInstallment;
  feeRecord: RecentPaymentFeeRecord;
  student: RecentPaymentStudent;
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

export type DashboardMetricsRequestParams = {
  page?: number;
  limit?: number;
};

async function getDashboardMetrics({
  page = 1,
  limit = 5,
}: DashboardMetricsRequestParams = {}): Promise<DashboardMetricsResponse> {
  const response = await apiClient.get({
    url: `/dashboard?page=${page}&limit=${limit}`,
  });

  return response.data as DashboardMetricsResponse;
}

export { getDashboardMetrics };
