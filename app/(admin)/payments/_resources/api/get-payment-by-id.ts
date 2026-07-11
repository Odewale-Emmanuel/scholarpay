import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export type GetPaymentByIdResponse = {
  success: true;
  data: unknown[];
  pagination: Pagination;
};

type PaymentByIdRequestParams = {
  installmentId?: string;
  page: number;
  limit: number;
};

async function getPaymentById({
  installmentId,
  page = 1,
  limit = 10,
}: PaymentByIdRequestParams): Promise<GetPaymentByIdResponse> {
  const response = await apiClient.get({
    url: `/payments?installmentId=${installmentId}&page=${page}&limit=${limit}`,
  });
  return response.data as GetPaymentByIdResponse;
}

export { getPaymentById };
