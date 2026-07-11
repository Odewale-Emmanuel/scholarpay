import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/utils/format";
import { cn } from "@/lib/utils";

interface PaymentProgressProps {
  totalAmount: number;
  amountPaid: number;
  className?: string;
}

export function PaymentProgress({
  totalAmount,
  amountPaid,
  className,
}: PaymentProgressProps) {
  const percentage =
    totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {formatNumber(amountPaid)} paid
        </span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {formatNumber(totalAmount - amountPaid)} remaining
      </p>
    </div>
  );
}
