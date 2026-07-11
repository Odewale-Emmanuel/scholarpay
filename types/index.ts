// ─── Core Entities ────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  grade: string;
  studentId: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type FeeStatus = "unpaid" | "partial" | "paid" | "overdue";
export type InstallmentStatus = "pending" | "paid" | "overdue" | "partial";
export type PaymentStatus = "pending" | "success" | "failed" | "processing";
export type NotificationType = "whatsapp" | "email" | "sms";

export interface FeeRecord {
  id: string;
  schoolId: string;
  studentId: string;
  student?: Student;
  title: string;
  description?: string;
  totalAmount: number;
  amountPaid: number;
  amountOutstanding: number;
  status: FeeStatus;
  installmentCount: 2 | 3;
  dueDate: string;
  academicSession: string;
  term: string;
  paymentToken: string;
  createdAt: string;
}

export interface InstallmentPlan {
  id: string;
  feeRecordId: string;
  feeRecord?: FeeRecord;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidAt?: string;
  paidAmount: number;
  status: InstallmentStatus;
  reference?: string;
}

export interface Payment {
  id: string;
  schoolId: string;
  studentId: string;
  feeRecordId: string;
  installmentPlanId?: string;
  student?: Student;
  feeRecord?: FeeRecord;
  amount: number;
  reference: string;
  status: PaymentStatus;
  paymentMethod: string;
  channel: string;
  paidAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  id: string;
  schoolId: string;
  studentId: string;
  student?: Student;
  type: NotificationType;
  title: string;
  message: string;
  status: "sent" | "pending" | "failed";
  sentAt?: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalCollected: number;
  outstandingBalance: number;
  partialPayments: number;
  paidFees: number;
  totalStudents: number;
  totalFees: number;
}

export interface RecentPayment {
  id: string;
  studentName: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Form Data ────────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreateStudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  grade: string;
  studentId: string;
}

export interface CreateFeeFormData {
  studentId: string;
  title: string;
  description?: string;
  totalAmount: number;
  installmentCount: 2 | 3;
  dueDate: string;
  academicSession: string;
  term: string;
}

export interface InitiatePaymentFormData {
  feeRecordId: string;
  installmentPlanId: string;
  amount: number;
  callbackUrl: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  schoolId: string;
  role: "admin" | "staff";
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
