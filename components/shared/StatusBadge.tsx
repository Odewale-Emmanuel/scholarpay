import { cn } from "@/lib/utils";
import { FeeStatus } from "@/app/(admin)/dashboard/_resources/constants/fee-status";
import { FeeRecordStatus } from "@/app/(admin)/fees/_resources/api/get-fee-records";
import { PaymentStatus } from "@/app/(admin)/payments/_resources/api/get-payment-history";

type Status = FeeStatus | FeeRecordStatus | PaymentStatus | string;

const statusVariants = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
} as const;

const statusConfig: Record<
  string,
  {
    label: string;
    variant: keyof typeof statusVariants;
  }
> = {
  // Fee status
  paid: {
    label: "Paid",
    variant: "success",
  },
  partiallyPaid: {
    label: "Partially Paid",
    variant: "info",
  },
  pending: {
    label: "Pending",
    variant: "warning",
  },
  overdue: {
    label: "Overdue",
    variant: "danger",
  },

  // Fee record status
  PAID: {
    label: "Paid",
    variant: "success",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    variant: "info",
  },
  PENDING: {
    label: "Pending",
    variant: "warning",
  },
  OVERDUE: {
    label: "Overdue",
    variant: "danger",
  },

  // Payment status
  SUCCESS: {
    label: "Success",
    variant: "success",
  },
  FAILED: {
    label: "Failed",
    variant: "danger",
  },

  // Student status
  active: {
    label: "Active",
    variant: "success",
  },
  inactive: {
    label: "Inactive",
    variant: "neutral",
  },

  // Notifications
  sent: {
    label: "Sent",
    variant: "success",
  },
  processing: {
    label: "Processing",
    variant: "info",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, " "),
    variant: "neutral" as const,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        statusVariants[config.variant],
        className,
      )}
    >
      {config.label}
    </span>
  );
}
