"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

import { DataTable, Column } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentProgress } from "@/components/shared/PaymentProgress";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeeRecord } from "@/types";
import { mockFeesWithStudents } from "@/mock/data";
import { formatCurrency, formatDate } from "@/utils/format";

const columns: Column<FeeRecord>[] = [
  {
    key: "student",
    header: "Student",
    cell: (row) => (
      <div>
        <p className="font-medium text-sm">
          {row.student?.firstName} {row.student?.lastName}
        </p>
        <p className="text-xs text-muted-foreground font-mono">{row.student?.studentId}</p>
      </div>
    ),
  },
  {
    key: "title",
    header: "Fee Title",
    cell: (row) => (
      <div>
        <p className="text-sm font-medium">{row.title}</p>
        <p className="text-xs text-muted-foreground">{row.term} · {row.academicSession}</p>
      </div>
    ),
  },
  {
    key: "totalAmount",
    header: "Total",
    cell: (row) => <span className="font-semibold">{formatCurrency(row.totalAmount)}</span>,
  },
  {
    key: "progress",
    header: "Progress",
    cell: (row) => (
      <PaymentProgress
        totalAmount={row.totalAmount}
        amountPaid={row.amountPaid}
        className="w-36"
      />
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
      <span className="text-xs text-muted-foreground">{formatDate(row.dueDate)}</span>
    ),
  },
  {
    key: "installmentCount",
    header: "Plan",
    cell: (row) => (
      <span className="text-xs font-medium">{row.installmentCount}x</span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (row) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/installments?feeId=${row.id}`}>Details</Link>
      </Button>
    ),
  },
];

export default function FeesPage() {
  const [fees] = useState(mockFeesWithStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = fees.filter((f) => {
    const matchesSearch =
      !search ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      `${f.student?.firstName} ${f.student?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = {
    collected: fees.reduce((s, f) => s + f.amountPaid, 0),
    outstanding: fees.reduce((s, f) => s + f.amountOutstanding, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Records</h1>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(totals.collected)} collected · {formatCurrency(totals.outstanding)} outstanding
          </p>
        </div>
        <Button asChild>
          <Link href="/fees/create">
            <Plus className="h-4 w-4" />
            Create Fee Record
          </Link>
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search fees..."
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No fee records found"
          description="Create a fee record to get started."
          action={{ label: "Create Fee Record", onClick: () => { window.location.href = "/fees/create"; } }}
        />
      ) : (
        <DataTable data={filtered} columns={columns} />
      )}
    </div>
  );
}
