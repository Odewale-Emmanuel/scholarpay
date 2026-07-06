"use client";

import { useState } from "react";
import { Bell, MessageSquare, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { DataTable, Column } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Notification } from "@/types";
import { mockNotificationsWithStudents } from "@/mock/data";
import { formatDateTime } from "@/utils/format";

const typeIcon = {
  whatsapp: <MessageSquare className="h-4 w-4 text-green-600" />,
  email: <Mail className="h-4 w-4 text-blue-600" />,
  sms: <Bell className="h-4 w-4 text-purple-600" />,
};

const columns: Column<Notification>[] = [
  {
    key: "type",
    header: "Channel",
    cell: (row) => (
      <div className="flex items-center gap-2">
        {typeIcon[row.type] ?? <Bell className="h-4 w-4" />}
        <span className="text-xs capitalize font-medium">{row.type}</span>
      </div>
    ),
  },
  {
    key: "student",
    header: "Student",
    cell: (row) => (
      <p className="text-sm font-medium">
        {row.student?.firstName} {row.student?.lastName}
      </p>
    ),
  },
  {
    key: "title",
    header: "Title",
    cell: (row) => <span className="text-sm font-medium">{row.title}</span>,
  },
  {
    key: "message",
    header: "Message",
    cell: (row) => (
      <p className="text-xs text-muted-foreground max-w-xs truncate">{row.message}</p>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "sentAt",
    header: "Sent At",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {row.sentAt ? formatDateTime(row.sentAt) : "—"}
      </span>
    ),
  },
];

export default function NotificationsPage() {
  const [notifications] = useState(mockNotificationsWithStudents);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      `${n.student?.firstName} ${n.student?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSendReminder = () => {
    toast.success("Reminders sent to all students with pending payments!");
  };

  const sentCount = notifications.filter((n) => n.status === "sent").length;
  const failedCount = notifications.filter((n) => n.status === "failed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {sentCount} sent · {failedCount} failed
          </p>
        </div>
        <Button onClick={handleSendReminder}>
          <Send className="h-4 w-4" />
          Send Bulk Reminder
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Sent", value: sentCount, color: "text-green-600" },
          { label: "Failed", value: failedCount, color: "text-red-600" },
          { label: "WhatsApp", value: notifications.filter((n) => n.type === "whatsapp").length, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search notifications..."
          className="w-64"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} emptyMessage="No notifications found." />
    </div>
  );
}
