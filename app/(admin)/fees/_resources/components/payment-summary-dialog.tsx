import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/utils/format";

export interface PaymentSummary {
  totalAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  installmentsPaid: number;
  installmentsPending: number;
}

interface PaymentSummaryDialogProps {
  summary: PaymentSummary;
  trigger: React.ReactNode;
}

export function PaymentSummaryDialog({
  summary,
  trigger,
}: PaymentSummaryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Summary</DialogTitle>
          <DialogDescription>Overview of payment progress.</DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <SummaryRow
              label="Total Amount"
              value={formatNumber(summary.totalAmount, {
                style: "currency",
                compact: true,
              })}
            />

            <SummaryRow
              label="Amount Paid"
              value={formatNumber(summary.amountPaid, {
                style: "currency",
                compact: true,
              })}
            />

            <SummaryRow
              label="Outstanding Balance"
              value={formatNumber(summary.outstandingBalance, {
                style: "currency",
                compact: true,
              })}
            />

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Installments Paid
              </span>

              <Badge variant="default">{summary.installmentsPaid}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Installments Pending
              </span>

              <Badge
                variant={
                  summary.installmentsPending > 0 ? "secondary" : "default"
                }
              >
                {summary.installmentsPending}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
