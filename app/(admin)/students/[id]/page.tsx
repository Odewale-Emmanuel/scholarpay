"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  GraduationCap,
  Calendar,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FeeSummaryCard } from "@/components/shared/FeeSummaryCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents, mockFeesWithStudents } from "@/mock/data";
import { formatDate, getInitials } from "@/utils/format";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: Props) {
  const { id } = use(params);
  const student = mockStudents.find((s) => s.id === id);

  if (!student) notFound();

  const studentFees = mockFeesWithStudents.filter((f) => f.studentId === id);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/students">
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {getInitials(`${student.firstName} ${student.lastName}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">
              {student.firstName} {student.lastName}
            </h1>
            <StatusBadge status={student.status} />
          </div>
          <p className="text-muted-foreground font-mono text-sm">{student.studentId}</p>
          <p className="text-muted-foreground text-sm">{student.grade}</p>
        </div>
        <Button asChild>
          <Link href="/fees/create">Create Fee Record</Link>
        </Button>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" /> Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { icon: Mail, label: "Email", value: student.email },
              { icon: Phone, label: "Phone", value: student.phone },
              { icon: GraduationCap, label: "Grade", value: student.grade },
              { icon: Calendar, label: "Enrolled", value: formatDate(student.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-20">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" /> Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { icon: User, label: "Name", value: student.parentName },
              { icon: Phone, label: "Phone", value: student.parentPhone },
              { icon: Mail, label: "Email", value: student.parentEmail },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-20">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fee Records */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Fee Records ({studentFees.length})
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/fees/create">Add Fee Record</Link>
          </Button>
        </div>
        {studentFees.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            No fee records found for this student.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentFees.map((fee) => (
              <FeeSummaryCard key={fee.id} fee={fee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
