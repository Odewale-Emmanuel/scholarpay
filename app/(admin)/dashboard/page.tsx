"use client";

// refactor page
import {
  // DollarSign,
  // AlertCircle,
  // Clock,
  // CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  // AreaChart,
  // Area,
  // XAxis,
  // YAxis,
  // CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardTotals,
  FeeRecordStatusBreakdown,
  getDashboardMetrics,
} from "./_resources/api/get-dashboard-metrics";
import { quickActions } from "./_resources/constants/quick-actions";
import { useAppSelector } from "@/hooks/useAppDispatch";
import {
  metricOverview,
  MetricValueType,
} from "./_resources/constants/metrics";
import { feeStatusData } from "./_resources/constants/fee-status";

export const formatMetricValue = (
  value: number,
  valueType: MetricValueType,
) => {
  switch (valueType) {
    case "amount":
      return formatNumber(value, {
        style: "currency",
        compact: true,
      });

    case "percentage":
      return formatNumber(value, {
        suffix: "%",
        compact: true,
      });

    case "count":
    default:
      return formatNumber(value, {
        compact: true,
      });
  }
};

export default function DashboardPage() {
  // const recentPayments = mockPaymentsWithDetails.slice(0, 5);
  const school = useAppSelector((s) => s.school.currentSchool);
  const RECENT_PAYMENTS_LIMIT = 5;
  const RefreshInterval = 15_000; // Refetch every 15 seconds

  const {
    data,
    isLoading,
    // isError,
    // refetch,
    //  error
  } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () =>
      getDashboardMetrics({
        recentLimit: RECENT_PAYMENTS_LIMIT,
      }),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
    refetchInterval: RefreshInterval,
  });

  const dashboard = data?.data;

  const overviewData = metricOverview
    .map((item) => ({
      ...item,
      value: dashboard?.totals[item.key as keyof DashboardTotals],
    }))
    .filter((item) => item.visible);

  const feeStatusChartData = feeStatusData.map((item) => ({
    ...item,
    value:
      dashboard?.feeRecordStatusBreakdown[
        item.key as keyof FeeRecordStatusBreakdown
      ],
  }));

  const hasData = feeStatusChartData.some((item) => Number(item?.value) > 0);
  const pieData = hasData
    ? feeStatusChartData
    : [
        {
          key: "empty",
          title: "No Data",
          value: 100,
          color: "#E5E7EB",
        },
      ];

  const recentPayments = dashboard?.recentPayments || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">{school?.name}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewData.map((item) => (
          <StatCard
            key={item.key}
            title={item.title}
            value={formatMetricValue(Number(item.value), item.valueType)}
            icon={item.icon}
            iconBg={item.iconBgClassName}
            iconColor={item.iconClassName}
            description={item.description}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fee Status Distribution */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fee Status</CardTitle>
              <CardDescription>Distribution of fee records</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {pieData.map((d) => (
                  <div key={d.key} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground text-xs">
                      {d.title} ({d.key !== "empty" ? d.value : 0}
                      {d.key !== "empty" && "%"})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors"
                >
                  <div className={`rounded-md p-2 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowRight className="text-muted-foreground ml-auto h-3.5 w-3.5" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Payments</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/payments">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPayments.length >= 1 ? (
                  recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                          {payment.reference.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{payment.id}</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            {payment.transactionReference}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatNumber(payment.amount, {
                            style: "currency",
                            compact: true,
                          })}
                        </p>
                        <StatusBadge status={payment.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10">
                    <p className="text-muted-foreground text-sm">
                      No recent payment found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
