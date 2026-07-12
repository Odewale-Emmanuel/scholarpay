"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";

import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeeRecord } from "./_resources/api/get-fee-records";
import { formatNumber, formatDate } from "@/utils/format";
import { FeeRecordStatus } from "./_resources/api/get-fee-records";
import { useQuery } from "@tanstack/react-query";
import {
  getFeeRecords,
  FeeRecordSummary,
} from "./_resources/api/get-fee-records";
import { AppPagination } from "@/components/shared/AppPagination";
import { PaymentSummaryDialog } from "./_resources/components/payment-summary-dialog";
import { useNavigate } from "@/hooks/useNavigate";
import { SummaryCards } from "./_resources/components/summary-cards";
import { toast } from "sonner";

const columns: Column<FeeRecord>[] = [
  {
    key: "student",
    header: "Student",
    cell: (row) => (
      <div>
        <p className="font-medium text-sm">
          {row.student?.firstName} {row.student?.lastName}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          {row.student?.id}
        </p>
      </div>
    ),
  },
  {
    key: "title",
    header: "Fee Title",
    cell: (row) => <p className="text-sm font-medium">{row.title}</p>,
  },
  {
    key: "totalAmount",
    header: "Total",
    cell: (row) => (
      <span className="font-semibold">
        {formatNumber(row.totalAmount, {
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
    key: "dueDate",
    header: "Due Date",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.dueDate)}
      </span>
    ),
  },
  {
    key: "installmentCount",
    header: "Installments",
    cell: (row) => (
      <span className="text-xs font-medium">{row.installmentCount}x</span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (row) => (
      <div>
        <PaymentSummaryDialog
          summary={row.paymentSummary}
          trigger={<Button>View Summary</Button>}
        />
      </div>
    ),
  },
];

export default function FeesPage() {
  const [feePage, setFeePage] = useState(1);
  const FEE_PAGE_LIMIT = 10;
  const [statusFilter, setStatusFilter] = useState<FeeRecordStatus | "ALL">(
    "ALL",
  );
  const { navigateTo } = useNavigate();

  const RefreshInterval = 15_000; // Refetch every 15 seconds

  const {
    data: feeRecordsResponse,
    isLoading: isLoadingFeeRecords,
    isError: isFeeaRecordsError,
    // error: feeRecordsError,
    refetch: refetchFeeRecords,
  } = useQuery({
    queryKey: ["feeRecords", feePage, statusFilter],
    queryFn: () =>
      getFeeRecords({
        page: feePage,
        limit: FEE_PAGE_LIMIT,
        status: statusFilter,
      }),
    refetchInterval: RefreshInterval,
  });

  if (isFeeaRecordsError) {
    toast.error("An error occured while fetching fee records please try.", {
      action: {
        label: "Retry",
        onClick: () => refetchFeeRecords(),
      },
    });
  }

  const feeRecords = feeRecordsResponse?.data ?? [];
  const feeRecordSummary = feeRecordsResponse?.summary ?? [];
  const totalFees = feeRecordsResponse?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Records</h1>
          <p className="text-sm text-muted-foreground">
            {formatNumber(totalFees)} fee{totalFees > 1 && "s"} found
          </p>
        </div>
        <Button onClick={() => navigateTo("/fees/create")}>
          <Plus className="h-4 w-4" />
          Create Fee Record
        </Button>
      </div>

      <SummaryCards
        summary={feeRecordSummary as FeeRecordSummary}
        loading={isLoadingFeeRecords}
      />

      <div className="">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as FeeRecordStatus)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {feeRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No fee records found"
          description="Create a fee record to get started."
          action={{
            label: "Create Fee Record",
            onClick: () => {
              navigateTo("/fees/create");
            },
          }}
        />
      ) : (
        <>
          <DataTable
            data={feeRecords}
            columns={columns}
            loading={isLoadingFeeRecords}
          />
          {feeRecordsResponse && (
            <AppPagination
              pagination={feeRecordsResponse.pagination}
              onPageChange={setFeePage}
            />
          )}
        </>
      )}
    </div>
  );
}
