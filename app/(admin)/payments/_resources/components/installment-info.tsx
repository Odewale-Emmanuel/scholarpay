"use client";

import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, Receipt } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPaymentById } from "../api/get-payment-by-id";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatNumber } from "@/utils/format";

function CopyField({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-mono text-xs break-all">{value}</span>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => {
          navigator.clipboard.writeText(value);
          toast.success("Copied");
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>

      <div className="font-medium text-right break-all">{value}</div>
    </div>
  );
}

interface InstallmentInfotDialogProps {
  installmentId: string;
  trigger: ReactNode;
}

export function InstallmentInfotDialog({
  installmentId,
  trigger,
}: InstallmentInfotDialogProps) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payment-receipt", installmentId],
    queryFn: () =>
      getPaymentById({
        installmentId,
        page: 1,
        limit: 10,
      }),
    enabled: false,
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          refetch();
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>

        {isLoading && <InstallmentSkeleton />}

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load payment receipt."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && Number(data?.data?.length)! > 0 && (
          <div className="space-y-4">
            {data!.data.map((payment) => (
              <div key={payment.id} className="rounded-xl border p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Payment Details</h3>

                  <Badge
                    variant={
                      payment.status === "SUCCESS"
                        ? "default"
                        : payment.status === "FAILED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>

                <Separator />

                <div className="grid gap-4 text-sm">
                  <InfoRow
                    label="Amount"
                    value={formatNumber(payment.amount, {
                      style: "currency",
                    })}
                  />

                  <InfoRow
                    label="Reference"
                    value={<CopyField value={payment.reference} />}
                  />

                  <InfoRow
                    label="Transaction Ref."
                    value={<CopyField value={payment.transactionReference} />}
                  />

                  <InfoRow
                    label="Created"
                    value={formatDate(payment.createdAt)}
                  />

                  <InfoRow
                    label="Paid At"
                    value={
                      payment.paidAt
                        ? formatDate(payment.paidAt)
                        : "Not paid yet"
                    }
                  />

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Message</p>

                    <p>{payment.message}</p>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.data?.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No payment receipt found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InstallmentSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-40" />

      <div className="space-y-4 rounded-lg border p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
}
