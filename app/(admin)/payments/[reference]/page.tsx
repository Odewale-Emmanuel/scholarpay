"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptCard } from "@/components/shared/ReceiptCard";
import { mockPaymentsWithDetails } from "@/mock/data";

interface Props {
  params: Promise<{ reference: string }>;
}

export default function PaymentReceiptPage({ params }: Props) {
  const { reference } = use(params);
  const payment = mockPaymentsWithDetails.find((p) => p.reference === reference);

  if (!payment) notFound();

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>
      <ReceiptCard payment={payment} />
    </div>
  );
}
