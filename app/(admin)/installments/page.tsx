"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { DataTable, Column } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { InstallmentPlan } from "@/types";
import { mockInstallmentsWithFees } from "@/mock/data";
import { formatCurrency, formatDate } from "@/utils/format";

const columns: Column<InstallmentPlan & { id: string }>[] = [
  {
    key: "student",
    header: "Student",
    cell: (row) => (
      <div>
        <p className="font-medium text-sm">
          {(row as InstallmentPlan).feeRecord?.student?.firstName}{" "}
          {(row as InstallmentPlan).feeRecord?.student?.lastName}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          {(row as InstallmentPlan).feeRecord?.student?.studentId}
        </p>
      </div>
    ),
  },
  {
    key: "feeTitle",
    header: "Fee",
    cell: (row) => (
      <div>
        <p className="text-sm">{(row as InstallmentPlan).feeRecord?.title}</p>
        <p className="text-xs text-muted-foreground">
          Installment {(row as InstallmentPlan).installmentNumber}
        </p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => (
      <span className="font-semibold">{formatCurrency((row as InstallmentPlan).amount)}</span>
    ),
  },
  {
    key: "paidAmount",
    header: "Paid",
    cell: (row) => (
      <span className="text-green-600">{formatCurrency((row as InstallmentPlan).paidAmount)}</span>
    ),
  },
  {
    key: "remaining",
    header: "Remaining",
    cell: (row) => {
      const remaining = (row as InstallmentPlan).amount - (row as InstallmentPlan).paidAmount;
      return (
        <span className={remaining > 0 ? "text-orange-600" : "text-muted-foreground"}>
          {formatCurrency(remaining)}
        </span>
      );
    },
  },
  {
    key: "dueDate",
    header: "Due Date",
    cell: (row) => (
      <span className="text-xs">{formatDate((row as InstallmentPlan).dueDate)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={(row as InstallmentPlan).status} />,
  },
];

function InstallmentsContent() {
  const searchParams = useSearchParams();
  const feeId = searchParams.get("feeId");

  const allInstallments = (mockInstallmentsWithFees as (InstallmentPlan & { id: string })[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = allInstallments.filter((inst) => {
    const matchesFee = !feeId || inst.feeRecordId === feeId;
    const matchesSearch =
      !search ||
      `${inst.feeRecord?.student?.firstName} ${inst.feeRecord?.student?.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inst.status === statusFilter;
    return matchesFee && matchesSearch && matchesStatus;
  });

  const totalOutstanding = filtered.reduce(
    (s, inst) => s + (inst.amount - inst.paidAmount),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Installments</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} installments · {formatCurrency(totalOutstanding)} outstanding
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["pending", "paid", "overdue", "partial"].map((status) => {
          const count = filtered.filter((i) => i.status === status).length;
          return (
            <Card key={status} className="cursor-pointer" onClick={() => setStatusFilter(status)}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <StatusBadge status={status} className="mt-1" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search student..."
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} emptyMessage="No installments found." />
    </div>
  );
}

export default function InstallmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstallmentsContent />
    </Suspense>
  );
}
