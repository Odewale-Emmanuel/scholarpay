"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { GraduationCap, CheckCircle2, ExternalLink, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstallmentTimeline } from "@/components/shared/InstallmentTimeline";
import { PaymentProgress } from "@/components/shared/PaymentProgress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getPublicFeeByToken } from "@/mock/data";
import { formatCurrency, formatDate } from "@/utils/format";
import { InstallmentPlan } from "@/types";

interface Props {
  params: Promise<{ token: string }>;
}

export default function PublicPayPage({ params }: Props) {
  const { token } = use(params);
  const data = getPublicFeeByToken(token);

  if (!data) notFound();

  const { fee, installments } = data;
  const [paying, setPaying] = useState<string | null>(null);

  const pendingInstallments = installments.filter(
    (i) => i.status === "pending" || i.status === "overdue" || i.status === "partial"
  );

  const handlePay = async (installment: InstallmentPlan) => {
    setPaying(installment.id);
    await new Promise((r) => setTimeout(r, 1500));
    // Simulate ALATPay redirect
    toast.success(
      "Redirecting to ALATPay... (simulation — no real payment processed)",
      { duration: 4000 }
    );
    setTimeout(() => {
      const url = `https://alatpay.ng/checkout?ref=DEMO_${installment.id}&amount=${installment.amount}`;
      // In production, this would redirect to ALATPay
      toast.info(`Would redirect to: ${url}`);
      setPaying(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">ScholarPay</span>
          </div>
          <h1 className="text-xl font-bold">School Fee Payment</h1>
          <p className="text-sm text-muted-foreground">
            Secure payment powered by ALATPay
          </p>
        </div>

        {/* Student & Fee Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Student</p>
                <CardTitle className="text-base">
                  {fee.student?.firstName} {fee.student?.lastName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {fee.student?.grade} · {fee.student?.studentId}
                </p>
              </div>
              <StatusBadge status={fee.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{fee.title}</p>
              <p className="text-sm text-muted-foreground">
                {fee.term} · {fee.academicSession}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Total", value: formatCurrency(fee.totalAmount), color: "" },
                { label: "Paid", value: formatCurrency(fee.amountPaid), color: "text-green-600" },
                { label: "Remaining", value: formatCurrency(fee.amountOutstanding), color: "text-orange-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-muted rounded-lg p-2">
                  <p className={`font-semibold text-sm ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <PaymentProgress totalAmount={fee.totalAmount} amountPaid={fee.amountPaid} />
          </CardContent>
        </Card>

        {/* Installment Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Installment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <InstallmentTimeline installments={installments} />
          </CardContent>
        </Card>

        {/* Pay Now */}
        {pendingInstallments.length > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Make Payment</CardTitle>
              <p className="text-xs text-muted-foreground">
                Select an installment to pay
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInstallments.map((inst) => (
                <div
                  key={inst.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">
                      Installment {inst.installmentNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDate(inst.dueDate)}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold">{formatCurrency(inst.amount)}</p>
                      <StatusBadge status={inst.status} />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePay(inst)}
                      disabled={paying === inst.id}
                    >
                      {paying === inst.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay Now
                          <ExternalLink className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="font-semibold">All Payments Complete</p>
              <p className="text-sm text-muted-foreground">
                All installments for this fee have been paid.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secured by ALATPay · ScholarPay</span>
        </div>
      </div>
    </div>
  );
}
