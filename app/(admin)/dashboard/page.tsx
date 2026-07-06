"use client";

// refactor page
import {
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { mockDashboardStats, mockPaymentsWithDetails } from "@/mock/data";

const monthlyData = [
  { month: "Sep", amount: 45000 },
  { month: "Oct", amount: 141667 },
  { month: "Nov", amount: 0 },
  { month: "Dec", amount: 66667 },
  { month: "Jan", amount: 91666 },
  { month: "Feb", amount: 60000 },
];

const feeStatusData = [
  { name: "Paid", value: 1, color: "#22c55e" },
  { name: "Partial", value: 2, color: "#3b82f6" },
  { name: "Unpaid", value: 1, color: "#94a3b8" },
  { name: "Overdue", value: 1, color: "#ef4444" },
];

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const recentPayments = mockPaymentsWithDetails.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Excellence Academy — 2024/2025 Academic Year
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats.totalCollected)}
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(stats.outstandingBalance)}
          icon={AlertCircle}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          description={`${stats.totalFees - stats.paidFees} fee records pending`}
        />
        <StatCard
          title="Partial Payments"
          value={stats.partialPayments}
          icon={Clock}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          description="Fee records in progress"
        />
        <StatCard
          title="Paid Fees"
          value={stats.paidFees}
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          description={`of ${stats.totalFees} total fee records`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly Collections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Collections</CardTitle>
            <CardDescription>Fee payments received per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0)), "Amount"]} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fill="url(#colorAmount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fee Status</CardTitle>
            <CardDescription>Distribution of fee records</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {feeStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments + Quick Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="lg:col-span-2">
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
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                      {payment.student?.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {payment.student?.firstName} {payment.student?.lastName}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">{payment.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                label: "Add Student",
                href: "/students",
                icon: Users,
                color: "bg-blue-100 text-blue-700",
              },
              {
                label: "Create Fee Record",
                href: "/fees/create",
                icon: TrendingUp,
                color: "bg-green-100 text-green-700",
              },
              {
                label: "View Installments",
                href: "/installments",
                icon: Clock,
                color: "bg-orange-100 text-orange-700",
              },
              {
                label: "Payment History",
                href: "/payments",
                icon: DollarSign,
                color: "bg-purple-100 text-purple-700",
              },
            ].map(({ label, href, icon: Icon, color }) => (
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
    </div>
  );
}
