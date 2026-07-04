import { Payment } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2 } from "lucide-react";

interface ReceiptCardProps {
  payment: Payment;
}

export function ReceiptCard({ payment }: ReceiptCardProps) {
  return (
    <div className="bg-card border rounded-xl p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center border-b pb-6 mb-6">
        <div className="flex justify-center mb-3">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold">Payment Receipt</h2>
        <p className="text-sm text-muted-foreground mt-1">ScholarPay</p>
      </div>

      {/* Amount */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold">{formatCurrency(payment.amount)}</p>
        <div className="flex justify-center mt-2">
          <StatusBadge status={payment.status} />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {[
          { label: "Reference", value: payment.reference },
          { label: "Payment Method", value: payment.paymentMethod },
          { label: "Channel", value: payment.channel },
          {
            label: "Date",
            value: payment.paidAt ? formatDateTime(payment.paidAt) : "—",
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium font-mono text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
        <p>Thank you for your payment.</p>
        <p>Powered by ScholarPay × ALATPay</p>
      </div>
    </div>
  );
}
