import { InstallmentPlan } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, Circle } from "lucide-react";

interface InstallmentTimelineProps {
  installments: InstallmentPlan[];
  className?: string;
}

const statusIcon = {
  paid: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  pending: <Circle className="h-5 w-5 text-gray-400" />,
  overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
  partial: <Clock className="h-5 w-5 text-blue-500" />,
};

export function InstallmentTimeline({ installments, className }: InstallmentTimelineProps) {
  const sorted = [...installments].sort((a, b) => a.installmentNumber - b.installmentNumber);

  return (
    <div className={cn("space-y-0", className)}>
      {sorted.map((inst, idx) => (
        <div key={inst.id} className="flex gap-4">
          {/* Timeline connector */}
          <div className="flex flex-col items-center">
            <div className="mt-1">{statusIcon[inst.status] ?? statusIcon.pending}</div>
            {idx < sorted.length - 1 && (
              <div className="w-px flex-1 bg-border my-1 min-h-[2rem]" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">
                  Installment {inst.installmentNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Due: {formatDate(inst.dueDate)}
                </p>
                {inst.paidAt && (
                  <p className="text-xs text-green-600 mt-0.5">
                    Paid: {formatDate(inst.paidAt)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatCurrency(inst.amount)}</p>
                {inst.paidAmount > 0 && inst.paidAmount < inst.amount && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(inst.paidAmount)} paid
                  </p>
                )}
                <div className="mt-1">
                  <StatusBadge status={inst.status} />
                </div>
              </div>
            </div>
            {inst.reference && (
              <p className="text-xs font-mono text-muted-foreground mt-1">
                Ref: {inst.reference}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
