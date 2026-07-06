"use client";

import { useState } from "react";
import Link from "next/link";

import { DataTable, Column } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Payment } from "@/types";
import { mockPaymentsWithDetails } from "@/mock/data";
import { formatCurrency, formatDateTime } from "@/utils/format";

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
    key: "student",
    header: "Student",
    cell: (row) => (
      <div>
        <p className="text-sm font-medium">
          {row.student?.firstName} {row.student?.lastName}
        </p>
        <p className="text-xs text-muted-foreground">{row.feeRecord?.title}</p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
  },
  {
    key: "channel",
    header: "Channel",
    cell: (row) => (
      <span className="text-xs px-2 py-0.5 rounded bg-muted">{row.channel}</span>
    ),
  },
  {
    key: "paymentMethod",
    header: "Method",
    cell: (row) => <span className="text-xs capitalize">{row.paymentMethod}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "paidAt",
    header: "Date",
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
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/payments/${row.reference}`}>Receipt</Link>
      </Button>
    ),
  },
];

export default function PaymentsPage() {
  const [payments] = useState(mockPaymentsWithDetails);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = payments.filter((p) => {
    const matchesSearch =
      !search ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      `${p.student?.firstName} ${p.student?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            {payments.length} transactions · {formatCurrency(totalCollected)} collected
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by reference or student..."
          className="w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        emptyMessage="No payments found."
      />
    </div>
  );
}
