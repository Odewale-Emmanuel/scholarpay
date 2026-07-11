import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export type FeeRecordStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface PaymentSummary {
  totalAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  installmentsPaid: number;
  installmentsPending: number;
}

export interface FeeRecord {
  id: string;
  title: string;
  totalAmount: number;
  installmentCount: number;
  startDate: string;
  dueDate: string;
  status: FeeRecordStatus;
  student: Student;
  paymentSummary: PaymentSummary;
}

export interface FeeRecordSummary {
  total: number;
  pending: number;
  partiallyPaid: number;
  paid: number;
  overdue: number;
}

export interface GetFeeRecordsResponse {
  success: boolean;
  data: FeeRecord[];
  summary: FeeRecordSummary;
  pagination: Pagination;
}

type GetFeeRecordsRequestParams = {
  page?: number;
  limit?: number;
  status?: FeeRecordStatus | "ALL";
};

async function getFeeRecords({
  page = 1,
  limit = 10,
  status,
}: GetFeeRecordsRequestParams = {}): Promise<GetFeeRecordsResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status !== "ALL") {
    searchParams.append("status", status);
  }

  const response = await apiClient.get({
    url: `/fee-records?${searchParams.toString()}`,
  });

  return response.data as GetFeeRecordsResponse;
}

export { getFeeRecords };
