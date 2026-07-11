import { apiClient } from "@/lib/api/api-client";
import { NetworkRequestReturnType } from "@/lib/api/api-client";

export interface PaymentSummary {
  totalAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  installmentsPaid: number;
  installmentsPending: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface Installment {
  id: string;
  sequence: number;
  amount: number;
  dueDate: string; // ISO 8601 date
  status: string;
  virtualAccount: string;
}

export interface PaymentPlanDetails {
  id: string;
  title: string;
  totalAmount: number;
  installmentCount: number;
  startDate: string; // ISO 8601 date
  dueDate: string; // ISO 8601 date
  status: string;
  paymentSummary: PaymentSummary;
  virtualAccounts: string;
  student: Student;
  installments: Installment[];
}

export interface PaymentPlanDetailsResponse {
  success: boolean;
  data: PaymentPlanDetails;
}

export type FeeCreationInfo = {
  studentId: string;
  title: string;
  totalAmount: number;
  installmentCount: number;
  collectionStartDate: string;
  collectionDueDate: string;
};

async function CreateFeeRecord(
  payload: FeeCreationInfo,
): Promise<NetworkRequestReturnType<PaymentPlanDetailsResponse>> {
  const response = await apiClient.post({
    url: "/fee-records",
    payload,
  });
  return response as NetworkRequestReturnType<PaymentPlanDetailsResponse>;
}

export { CreateFeeRecord };
