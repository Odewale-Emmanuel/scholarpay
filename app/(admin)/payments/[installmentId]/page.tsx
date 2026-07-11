"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { ReceiptCard } from "@/components/shared/ReceiptCard";
import { getPaymentById } from "../_resources/api/get-payment-by-id";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Props {
  params: Promise<{ installmentId: string }>;
}

export default function PaymentReceiptPage({ params }: Props) {
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;

  const { installmentId } = use(params);

  const { data, isError, isLoading, refetch, error } = useQuery({
    queryKey: ["payment", installmentId, page],
    queryFn: () => getPaymentById({ installmentId, page, limit: PAGE_LIMIT }),
  });

  if (!data) notFound();

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Link>
        </Button>
      </div>
      <div></div>
      {/* <ReceiptCard payment={payment} /> */}
    </div>
  );
}
