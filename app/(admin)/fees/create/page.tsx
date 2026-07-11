"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  User,
  FileText,
  Calendar,
  ClipboardList,
} from "lucide-react";

import { createFeeSchema, CreateFeeFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStudents } from "@/mock/data";
import { formatNumber, formatDate } from "@/utils/format";
import { TERMS, ACADEMIC_SESSIONS } from "@/constants";
import { FeeRecord, InstallmentPlan, Student } from "@/types";
import { cn } from "@/lib/utils";
import { addMonths, format } from "date-fns";

const STEPS = [
  { id: 1, label: "Select Student", icon: User },
  { id: 2, label: "Fee Information", icon: FileText },
  { id: 3, label: "Installment Plan", icon: Calendar },
  { id: 4, label: "Review", icon: ClipboardList },
  { id: 5, label: "Done", icon: CheckCircle2 },
];

function generateInstallments(
  totalAmount: number,
  count: 2 | 3,
  startDate: Date,
  feeRecordId: string,
): InstallmentPlan[] {
  const baseAmount = Math.floor(totalAmount / count);
  const remainder = totalAmount - baseAmount * count;

  return Array.from({ length: count }, (_, i) => ({
    id: `inst_new_${i + 1}`,
    feeRecordId,
    installmentNumber: i + 1,
    amount: i === count - 1 ? baseAmount + remainder : baseAmount,
    dueDate: format(addMonths(startDate, i), "yyyy-MM-dd"),
    paidAmount: 0,
    status: "pending" as const,
  }));
}

export default function CreateFeePage() {
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [, setInstallments] = useState<InstallmentPlan[]>([]);
  const [createdFee, setCreatedFee] = useState<FeeRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateFeeFormValues>({
    resolver: zodResolver(createFeeSchema),
    defaultValues: {
      installmentCount: 2,
      academicSession: "2024/2025",
      term: "First Term",
    },
  });

  const watchedCount = watch("installmentCount");
  const watchedAmount = watch("totalAmount");
  const watchedDueDate = watch("dueDate");

  const filteredStudents = mockStudents.filter(
    (s) =>
      !studentSearch ||
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()),
  );

  // Step 3: preview installments
  const previewInstallments = (
    count: 2 | 3,
    amount: number,
    dueDate: string,
  ) => {
    if (!amount || !dueDate) return [];
    const start = new Date(dueDate);
    start.setMonth(start.getMonth() - count + 1);
    return generateInstallments(amount, count, start, "preview");
  };

  const onSubmit = async (data: CreateFeeFormValues) => {
    if (step < 4) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const feeId = `fee_${Date.now()}`;
    const token = `tok_${Math.random().toString(36).substring(2, 10)}`;
    const fee: FeeRecord = {
      id: feeId,
      schoolId: "sch_001",
      studentId: data.studentId,
      student: selectedStudent ?? undefined,
      title: data.title,
      description: data.description,
      totalAmount: data.totalAmount,
      amountPaid: 0,
      amountOutstanding: data.totalAmount,
      status: "unpaid",
      installmentCount: data.installmentCount,
      dueDate: data.dueDate,
      academicSession: data.academicSession,
      term: data.term,
      paymentToken: token,
      createdAt: new Date().toISOString(),
    };

    const insts = generateInstallments(
      data.totalAmount,
      data.installmentCount,
      new Date(data.dueDate),
      feeId,
    );

    setCreatedFee(fee);
    setInstallments(insts);
    setSubmitting(false);
    setStep(5);
    toast.success("Fee record created successfully!");
  };

  const preview =
    watchedAmount && watchedDueDate
      ? previewInstallments(watchedCount || 2, watchedAmount, watchedDueDate)
      : [];

  const paymentLink = createdFee
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/public/pay/${createdFee.paymentToken}`
    : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/fees">
          <ArrowLeft className="h-4 w-4" />
          Back to Fee Records
        </Link>
      </Button>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0",
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs hidden sm:block truncate",
                  isActive ? "font-medium" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-border mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Student */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search student by name or ID..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setValue("studentId", student.id);
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:border-primary transition-colors",
                    selectedStudent?.id === student.id &&
                      "border-primary bg-primary/5",
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.grade} · {student.studentId}
                    </p>
                  </div>
                  {selectedStudent?.id === student.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!selectedStudent}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Fee Information */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              For: {selectedStudent?.firstName} {selectedStudent?.lastName}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Fee Title</Label>
              <Input
                {...register("title")}
                placeholder="First Term School Fees"
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea
                {...register("description")}
                placeholder="Tuition, textbooks, and activities"
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total Amount (₦)</Label>
              <Input
                {...register("totalAmount", { valueAsNumber: true })}
                type="number"
                placeholder="150000"
              />
              {errors.totalAmount && (
                <p className="text-xs text-destructive">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Academic Session</Label>
                <Select
                  defaultValue="2024/2025"
                  onValueChange={(v) => setValue("academicSession", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_SESSIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Term</Label>
                <Select
                  defaultValue="First Term"
                  onValueChange={(v) => setValue("term", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Final Due Date</Label>
              <Input {...register("dueDate")} type="date" />
              {errors.dueDate && (
                <p className="text-xs text-destructive">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  const valid = await new Promise<boolean>((resolve) => {
                    handleSubmit(
                      () => resolve(true),
                      () => resolve(false),
                    )();
                  });
                  // Just check required step-2 fields
                  const vals = getValues();
                  if (valid && vals.title && vals.totalAmount && vals.dueDate)
                    setStep(3);
                }}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Installment Plan */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Installment Plan</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {formatNumber(watchedAmount || 0)}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {([2, 3] as const).map((count) => (
                <div
                  key={count}
                  onClick={() => setValue("installmentCount", count)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all text-center",
                    watchedCount === count
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">installments</p>
                  {watchedAmount > 0 && (
                    <p className="text-xs font-medium mt-1 text-primary">
                      ≈ {formatNumber(Math.round(watchedAmount / count))} each
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Payment Schedule Preview</p>
                {preview.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-muted text-sm"
                  >
                    <span>Installment {inst.installmentNumber}</span>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatNumber(inst.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {formatDate(inst.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Confirm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium">
                  {selectedStudent?.firstName} {selectedStudent?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Title</span>
                <span className="font-medium">{watch("title")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">
                  {formatNumber(watchedAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session</span>
                <span>
                  {watch("academicSession")} · {watch("term")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installments</span>
                <span className="font-medium">
                  {watchedCount}x installments
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Due Date</span>
                <span>{watchedDueDate ? formatDate(watchedDueDate) : "—"}</span>
              </div>
            </div>
            {preview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Installment Schedule</p>
                {preview.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex justify-between items-center p-2 border rounded text-sm"
                  >
                    <span>Installment {inst.installmentNumber}</span>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatNumber(inst.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {formatDate(inst.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Fee Record"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {step === 5 && createdFee && (
        <Card>
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Fee Record Created!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {createdFee.title} for {selectedStudent?.firstName} has been
                created.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Payment Link
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono break-all">
                  {paymentLink}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentLink);
                    toast.success("Payment link copied!");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with the parent via WhatsApp.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/fees">View Fee Records</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
