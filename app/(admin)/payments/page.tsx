"use client";

import { useState } from "react";
import Link from "next/link";

import { DataTable, Column } from "@/components/shared/DataTable";
// import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, formatDateTime } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import {
  getPaymentHistory,
  PaymentStatus,
  Payment,
} from "./_resources/api/get-payment-history";
import { toast } from "sonner";
import { AppPagination } from "@/components/shared/AppPagination";
import { InstallmentInfotDialog } from "./_resources/components/installment-info";

const columns: Column<Payment>[] = [
  {
    key: "reference",
    header: "Reference",
    cell: (row) => (
      <Link
        href={`/payments/${row.reference}`}
        className="font-mono text-xs text-primary hover:underline"
      >
        {row.reference}
      </Link>
    ),
  },
  {
    key: "sequence",
    header: "Sequence",
    cell: (row) => (
      <span className="font-semibold">{row.installmentSequence}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => (
      <span className="font-semibold">
        {formatNumber(row.amount, {
          style: "currency",
          compact: true,
        })}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    header: "Created At",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {row.createdAt ? formatDateTime(row.createdAt) : "—"}
      </span>
    ),
  },
  {
    key: "paidAt",
    header: "Paid At",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {row.paidAt ? formatDateTime(row.paidAt) : "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (row) => (
      <InstallmentInfotDialog
        installmentId={row.installmentId}
        trigger={
          <Button variant="ghost" size="sm">
            View Installments
          </Button>
        }
      />
    ),
  },
];

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;
  const RefreshInterval = 15_000; // Refetch every 15 seconds

  const {
    data: paymentHistory,
    isLoading,
    error,
    isError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["payments", statusFilter, page],
    queryFn: () =>
      getPaymentHistory({ status: statusFilter, page, limit: PAGE_LIMIT }),
    refetchInterval: RefreshInterval,
  });

  const payments = paymentHistory?.data ?? [];
  const totalPayments = paymentHistory?.pagination.total ?? 0;

  if (isError) {
    toast.error("Failed to fetch payment history. Please click to retry.", {
      action: {
        label: "Retry",
        onClick: () => refetchPayments(),
      },
      duration: 4500,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            {totalPayments} payment{totalPayments > 1 && "s"} found
          </p>
        </div>
        <div className="">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as PaymentStatus | "ALL")
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        loading={isLoading}
        emptyMessage={`No ${
          statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""
        } payments found.`}
      />

      {paymentHistory && (
        <AppPagination
          pagination={paymentHistory.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
