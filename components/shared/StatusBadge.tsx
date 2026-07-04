import { FeeStatus, InstallmentStatus, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

type Status = FeeStatus | InstallmentStatus | PaymentStatus | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  // Fee status
  paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  partial: { label: "Partial", className: "bg-blue-100 text-blue-800 border-blue-200" },
  unpaid: { label: "Unpaid", className: "bg-gray-100 text-gray-700 border-gray-200" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
  // Payment status
  success: { label: "Success", className: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
  // Student status
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-700 border-gray-200" },
  // Notification status
  sent: { label: "Sent", className: "bg-green-100 text-green-800 border-green-200" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
