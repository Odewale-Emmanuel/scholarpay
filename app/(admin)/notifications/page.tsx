"use client";

import { useState } from "react";
// import { Bell, MessageSquare, Mail, Send } from "lucide-react";
import { MdWhatsapp } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlineTextsms } from "react-icons/md";

import { DataTable, Column } from "@/components/shared/DataTable";
// import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Notification } from "@/types";
// import { mockNotificationsWithStudents } from "@/mock/data";
import { formatDateTime } from "@/utils/format";
import {
  getNotifications,
  Notification,
} from "./_resources/api/get-notifications";
import { useQuery } from "@tanstack/react-query";
import { AppPagination } from "@/components/shared/AppPagination";
// import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const typeIcon = {
  whatsapp: <MdWhatsapp className="h-4 w-4 text-green-600" />,
  email: <MdOutlineAlternateEmail className="h-4 w-4 text-blue-600" />,
  sms: <MdOutlineTextsms className="h-4 w-4 text-purple-600" />,
};

const columns: Column<Notification>[] = [
  {
    key: "channel",
    header: "Channel",
    cell: (row) => (
      <div className="flex items-center gap-2">
        {typeIcon[row.channel.toLocaleLowerCase() as keyof typeof typeIcon]}
        <span className="capitalize font-medium">{row.channel}</span>
      </div>
    ),
  },
  {
    key: "recipient",
    header: "Recipient",
    cell: (row) => <p className="text-sm font-medium">{row.recipient}</p>,
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <span className="text-sm font-medium">{row.type}</span>,
  },
  {
    key: "message",
    header: "Message",
    cell: (row) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">
            View Message
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80">
          <p className="text-sm leading-relaxed">{row.message}</p>
        </PopoverContent>
      </Popover>
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
  // const [search, setSearch] = useState("");
  // const [typeFilter, setTypeFilter] = useState("all");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;
  const RefreshInterval = 15_000; // Refetch every 15 seconds

  const {
    data: notificationsResponse,
    isLoading,
    // isError,
    // error,
  } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications({ page, limit: PAGE_LIMIT }),
    refetchInterval: RefreshInterval,
  });

  const notifications = notificationsResponse?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {notificationsResponse?.pagination.total ?? 0} notifications
          </p>
        </div>
      </div>

      <DataTable
        data={notifications}
        columns={columns}
        loading={isLoading}
        emptyMessage="No notifications found."
      />
      {notificationsResponse && (
        <AppPagination
          pagination={notificationsResponse.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
