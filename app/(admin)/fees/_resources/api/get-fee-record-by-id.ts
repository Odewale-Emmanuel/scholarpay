import { apiClient } from "@/lib/api/api-client";
import { Student } from "./get-fee-records";
import { PaymentSummary } from "./get-fee-records";

export interface Installment {
  id: string;
  sequence: number;
  amount: number;
  dueDate: string;
  status: string;
}

export interface FeeRecordDetails {
  id: string;
  title: string;
  totalAmount: number;
  installmentCount: number;
  startDate: string;
  dueDate: string;
  status: string;
  student: Student;
  paymentSummary: PaymentSummary;
  installments: Installment[];
}

export interface GetFeeRecordByIdResponse {
  success: boolean;
  data: FeeRecordDetails;
}

async function getFeeRecordById(id: string): Promise<GetFeeRecordByIdResponse> {
  const response = await apiClient.get({
    url: `/fee-records/${id}`,
  });

  return response.data as GetFeeRecordByIdResponse;
}

export { getFeeRecordById };
