import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CalendarClock,
  Clock,
  DollarSign,
  Receipt,
  TrendingUp,
} from "lucide-react";

export type DashboardTotalsKey =
  | "totalBilled"
  | "totalCollected"
  | "totalOutstandingBalance"
  | "fullyUnpaidOutstandingBalance"
  | "partiallyPaidOutstandingBalance"
  | "partiallyPaidFeeRecordsCount"
  | "partiallyPaidFeeRecordsPercentage"
  | "collectionRate"
  | "overdueAmount"
  | "dueSoonInstallmentsCount"
  | "dueSoonInstallmentsPercentage"
  | "pendingPaymentsCount"
  | "pendingPaymentsPercentage";

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
    key: "totalBilled",
    title: "Total Billed",
    description: "Fees billed",
    value: 0,
    valueType: "amount",
    icon: Receipt,
    iconClassName: "text-slate-600",
    iconBgClassName: "bg-slate-100",
    visible: true,
  },
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
    key: "fullyUnpaidOutstandingBalance",
    title: "Fully Unpaid",
    description: "Outstanding balance",
    value: 0,
    valueType: "amount",
    icon: AlertCircle,
    iconClassName: "text-red-600",
    iconBgClassName: "bg-red-100",
    visible: false, // Enable if you want to show this card
  },
  {
    key: "partiallyPaidOutstandingBalance",
    title: "Partially Paid",
    description: "Total partially paid balance",
    value: 0,
    valueType: "amount",
    icon: Clock,
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-100",
    visible: true,
  },
  {
    key: "partiallyPaidFeeRecordsCount",
    title: "Partial Fee Records",
    description: "In progress",
    value: 0,
    valueType: "count",
    icon: Clock,
    iconClassName: "text-sky-600",
    iconBgClassName: "bg-sky-100",
    visible: false,
  },
  {
    key: "partiallyPaidFeeRecordsPercentage",
    title: "Partial Records %",
    description: "Share of records",
    value: 0,
    valueType: "percentage",
    icon: TrendingUp,
    iconClassName: "text-cyan-600",
    iconBgClassName: "bg-cyan-100",
    visible: false,
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
