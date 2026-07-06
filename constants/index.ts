export const APP_NAME = "ScholarPay";
export const APP_DESCRIPTION = "School Fee Installment Portal";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  STUDENTS: "/students",
  STUDENT_DETAIL: (id: string) => `/students/${id}`,
  FEES: "/fees",
  FEES_CREATE: "/fees/create",
  INSTALLMENTS: "/installments",
  PAYMENTS: "/payments",
  PAYMENT_DETAIL: (ref: string) => `/payments/${ref}`,
  NOTIFICATIONS: "/notifications",
  PUBLIC_PAY: (token: string) => `/public/pay/${token}`,
} as const;

export const GRADES = [
  "Nursery 1",
  "Nursery 2",
  "KG 1",
  "KG 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

export const TERMS = ["First Term", "Second Term", "Third Term"];

export const ACADEMIC_SESSIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
];

export const INSTALLMENT_OPTIONS = [
  { value: 2, label: "2 Installments" },
  { value: 3, label: "3 Installments" },
];

export const FEE_STATUS_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  partial: "Partial",
  paid: "Paid",
  overdue: "Overdue",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  success: "Success",
  failed: "Failed",
  processing: "Processing",
};

export const QUERY_KEYS = {
  STUDENTS: "students",
  STUDENT: "student",
  FEES: "fees",
  FEE: "fee",
  FEE_INSTALLMENTS: "fee-installments",
  INSTALLMENTS: "installments",
  PAYMENTS: "payments",
  PAYMENT: "payment",
  DASHBOARD: "dashboard",
  NOTIFICATIONS: "notifications",
  PUBLIC_FEE: "public-fee",
} as const;
