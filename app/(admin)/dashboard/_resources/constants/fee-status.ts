export type FeeStatus = "paid" | "partiallyPaid" | "pending" | "overdue";

export type FeeStatusData = {
  key: FeeStatus;
  title: string;
  value: number;
  color: string;
};

export const feeStatusData: FeeStatusData[] = [
  { key: "paid", title: "Paid", value: 1, color: "#22c55e" },
  { key: "partiallyPaid", title: "Partial", value: 2, color: "#3b82f6" },
  { key: "pending", title: "Pending", value: 1, color: "#94a3b8" },
  { key: "overdue", title: "Overdue", value: 1, color: "#ef4444" },
];
