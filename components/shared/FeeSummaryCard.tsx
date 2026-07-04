import { FeeRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PaymentProgress } from "./PaymentProgress";
import { formatCurrency, formatDate } from "@/utils/format";

interface FeeSummaryCardProps {
  fee: FeeRecord;
}

export function FeeSummaryCard({ fee }: FeeSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{fee.title}</CardTitle>
          <StatusBadge status={fee.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          {fee.term} · {fee.academicSession}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Total Amount</p>
            <p className="font-semibold">{formatCurrency(fee.totalAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Amount Paid</p>
            <p className="font-semibold text-green-600">{formatCurrency(fee.amountPaid)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Outstanding</p>
            <p className="font-semibold text-orange-600">{formatCurrency(fee.amountOutstanding)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Installments</p>
            <p className="font-semibold">{fee.installmentCount}x</p>
          </div>
        </div>
        <PaymentProgress totalAmount={fee.totalAmount} amountPaid={fee.amountPaid} />
        <p className="text-xs text-muted-foreground">Due: {formatDate(fee.dueDate)}</p>
      </CardContent>
    </Card>
  );
}
