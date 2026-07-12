import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";
import { PaymentStatus } from "./get-payment-history";

export type PaymentHistory = {
  id: string;
  message: string;
  reference: string;
  transactionReference: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type GetPaymentByIdResponse = {
  success: true;
  data: PaymentHistory[];
  pagination: Pagination;
};

type PaymentByIdRequestParams = {
  installmentId: string;
  page?: number;
  limit?: number;
};

async function getPaymentById({
  installmentId,
  page = 1,
  limit = 10,
}: PaymentByIdRequestParams): Promise<GetPaymentByIdResponse> {
  const response = await apiClient.get({
    url: `/payments/installments/${installmentId}/history?page=${page}&limit=${limit}`,
  });
  return response.data as GetPaymentByIdResponse;
}

export { getPaymentById };
