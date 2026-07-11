import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  //   CheckCircle2,
  Clock,
  DollarSign,
  CalendarClock,
  Receipt,
  TrendingUp,
} from "lucide-react";

export type DashboardTotalsKey =
  | "totalCollected"
  | "totalOutstandingBalance"
  | "totalPartialPayments"
  | "collectionRate"
  | "overdueAmount"
  | "dueSoonInstallmentsCount"
  | "pendingPaymentsCount";

export type MetricValueType = "amount" | "count" | "percentage";

export type OverviewCard = {
  key: DashboardTotalsKey;
  title: string;
  description: string;
  value: number;
  valueType: MetricValueType;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
  visible: boolean;
};

export const metricOverview: OverviewCard[] = [
  {
    key: "totalCollected",
    title: "Total Collected",
    description: "Amount received",
    value: 0,
    valueType: "amount",
    icon: DollarSign,
    iconClassName: "text-green-600",
    iconBgClassName: "bg-green-100",
    visible: true,
  },
  {
    key: "totalOutstandingBalance",
    title: "Outstanding Balance",
    description: "Amount unpaid",
    value: 0,
    valueType: "amount",
    icon: AlertCircle,
    iconClassName: "text-orange-600",
    iconBgClassName: "bg-orange-100",
    visible: true,
  },
  {
    key: "totalPartialPayments",
    title: "Partial Payments",
    description: "In progress",
    value: 0,
    valueType: "amount",
    icon: Clock,
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-100",
    visible: true,
  },
  {
    key: "collectionRate",
    title: "Collection Rate",
    description: "Paid percentage",
    value: 0,
    valueType: "percentage",
    icon: TrendingUp,
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-100",
    visible: true,
  },
  {
    key: "overdueAmount",
    title: "Overdue Amount",
    description: "Past due",
    value: 0,
    valueType: "amount",
    icon: AlertCircle,
    iconClassName: "text-red-600",
    iconBgClassName: "bg-red-100",
    visible: true,
  },
  {
    key: "dueSoonInstallmentsCount",
    title: "Due Soon",
    description: "Upcoming dues",
    value: 0,
    valueType: "count",
    icon: CalendarClock,
    iconClassName: "text-amber-600",
    iconBgClassName: "bg-amber-100",
    visible: true,
  },
  {
    key: "pendingPaymentsCount",
    title: "Pending Payments",
    description: "Awaiting payment",
    value: 0,
    valueType: "count",
    icon: Receipt,
    iconClassName: "text-violet-600",
    iconBgClassName: "bg-violet-100",
    visible: true,
  },
];
