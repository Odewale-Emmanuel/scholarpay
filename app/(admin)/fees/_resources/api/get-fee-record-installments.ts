import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export interface Payment {
  id: string;
  reference: string;
  transactionReference: string;
  amount: number;
  status: string;
  paidAt: string;
  createdAt: string;
}

export interface FeeRecordInstallment {
  id: string;
  sequence: number;
  amount: number;
  dueDate: string;
  status: string;
  payments: Payment[];
}

export interface GetFeeRecordInstallmentsResponse {
  success: boolean;
  data: FeeRecordInstallment[];
  pagination: Pagination;
}

type GetFeeRecordInstallmentsRequestParams = {
  id: string;
  page?: number;
  limit?: number;
};

async function getFeeRecordInstallments({
  id,
  page = 1,
  limit = 10,
}: GetFeeRecordInstallmentsRequestParams): Promise<GetFeeRecordInstallmentsResponse> {
  const response = await apiClient.get({
    url: `/fee-records/${id}/installments?limit=${limit}&page=${page}`,
  });

  return response.data as GetFeeRecordInstallmentsResponse;
}

export { getFeeRecordInstallments };
