import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export type Payment = {
  id: string;
  installmentId: string;
  installmentSequence: number;
  reference: string;
  transactionReference: string;
  amount: number;
  status: PaymentStatus | string;
  paidAt: string;
  createdAt: string;
};

export type GetPaymentHistoryResponse = {
  success: true;
  data: Payment[];
  pagination: Pagination;
};

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

type PaymentHistoryRequestParams = {
  status?: PaymentStatus | "ALL";
  page?: number;
  limit?: number;
};

async function getPaymentHistory({
  status,
  page = 1,
  limit = 10,
}: PaymentHistoryRequestParams): Promise<GetPaymentHistoryResponse> {
  const statusParam =
    status && status.toUpperCase() !== "ALL" ? `&status=${status}` : "";
  const response = await apiClient.get({
    url: `/payments?page=${page}&limit=${limit}${statusParam}`,
  });
  return response.data as GetPaymentHistoryResponse;
}

export { getPaymentHistory };
