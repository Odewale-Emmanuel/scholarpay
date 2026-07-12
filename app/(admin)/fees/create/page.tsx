"use client";

import { useState, useEffect } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { mockStudents } from "@/mock/data";
import { formatNumber, formatDate } from "@/utils/format";
// import { TERMS, ACADEMIC_SESSIONS } from "@/constants";
// import { FeeRecord, InstallmentPlan, Student } from "@/types";
import { cn } from "@/lib/utils";
// import { addMonths, format } from "date-fns";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useDebounce } from "@/hooks/useDebounce";
// import { useNavigate } from "@/hooks/useNavigate";
// import { SummaryCards } from "../_resources/components/summary-cards";
import { StudentSelector } from "../_resources/components/student-selector";
import { getStudents } from "../../students/_resources/api/get-students";
import { useQuery } from "@tanstack/react-query";
// import { setSelectedStudent } from "@/lib/store/slices/user/studentSlice";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { type DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { CreateFeeRecord } from "../_resources/api/create-fee-record";
import { useMutation } from "@tanstack/react-query";

const STEPS = [
  { id: 1, label: "Select Student", icon: User },
  { id: 2, label: "Fee Information", icon: FileText },
  { id: 3, label: "Installment Plan", icon: Calendar },
  { id: 4, label: "Review", icon: ClipboardList },
  { id: 5, label: "Done", icon: CheckCircle2 },
];

export default function CreateFeePage() {
  const [step, setStep] = useState(1);
  const [installmentLimit, setInstallmentLimit] = useState(3);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const STUDENT_PAGE_LIMIT = 5;
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 60),
  });

  const debouncedSearch = useDebounce(studentSearch, 500);
  const selectedStudent = useAppSelector((s) => s.student.selectedStudent);

  useEffect(() => {
    setStudentPage(1);
  }, [debouncedSearch]);

  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    // isFetching: isFetchingStudents,
    // isError: isStudentsError,
    // error: studentError,
    // refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students", studentPage, debouncedSearch],
    queryFn: () =>
      getStudents({
        page: studentPage,
        limit: STUDENT_PAGE_LIMIT,
        search: debouncedSearch || undefined,
      }),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });

  const {
    register,
    // handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateFeeFormValues>({
    resolver: zodResolver(createFeeSchema),
    defaultValues: {
      installmentCount: 2,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedCount = watch("installmentCount");
  const watchedAmount = watch("totalAmount");

  const {
    mutate: createFeeRecord,
    data: createdFee,
    isPending: isCreatingFeeRecord,
  } = useMutation({
    mutationFn: CreateFeeRecord,

    onSuccess: () => {
      toast.success("Fee record created successfully!");
      setStep(5);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create fee record.",
      );
    },
  });

  function handleCreateFeeRecord() {
    if (!selectedStudent) {
      toast.warning("Please select a student.");
      return;
    }

    const values = getValues();

    createFeeRecord({
      studentId: selectedStudent.id,
      title: values.title,
      totalAmount: values.totalAmount,
      installmentCount: values.installmentCount,
      collectionStartDate: dateRange!.from!.toISOString(),
      collectionDueDate: dateRange!.to!.toISOString(),
    });
  }

  const fee = createdFee?.data?.data;

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
              placeholder="Search student by name"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />

            <div className="">
              {!selectedStudent && studentsResponse?.pagination.total !== 0 && (
                <p className="text-sm text-gray-900 font-semibold ms-1 animate-pulse animation-duration-[3s]!">
                  select a student to create a fee
                </p>
              )}
              <StudentSelector
                students={studentsResponse?.data || []}
                loading={isLoadingStudents}
              />
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

            <div>
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  // Just check required step-2 fields
                  const vals = getValues();
                  if (
                    vals.title &&
                    vals.totalAmount &&
                    dateRange?.from &&
                    dateRange?.to
                  )
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
              Total:{" "}
              {formatNumber(watchedAmount || 0, {
                style: "currency",
                compact: true,
              })}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label>Installment Limit</Label>
              <Input
                type="number"
                min={2}
                value={installmentLimit}
                onChange={(e) =>
                  setInstallmentLimit(
                    Number(e.target.value) < 2 ? 2 : Number(e.target.value),
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from(
                { length: installmentLimit - 1 },
                (_, i) => i + 2,
              ).map((count) => (
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
                      ≈{" "}
                      {count === getValues().installmentCount
                        ? formatNumber(
                            watchedAmount / getValues().installmentCount,
                            {
                              style: "currency",
                              compact: true,
                            },
                          )
                        : formatNumber(watchedAmount / count, {
                            style: "currency",
                            compact: true,
                          })}{" "}
                      each
                    </p>
                  )}{" "}
                </div>
              ))}
            </div>

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
                  {formatNumber(watchedAmount || 0, {
                    style: "currency",
                    compact: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installments</span>
                <span className="font-medium">
                  {watchedCount}x installments
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Collection Start Date
                </span>
                <span>
                  <span>
                    {dateRange?.from ? formatDate(dateRange.from) : "—"}
                  </span>{" "}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Collection End Date
                </span>
                <span>
                  <span>
                    {dateRange?.to ? formatDate(dateRange.to) : "—"}
                  </span>{" "}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateFeeRecord}
                disabled={isCreatingFeeRecord}
              >
                {isCreatingFeeRecord ? "Creating..." : "Create Fee Record"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {step === 5 && createdFee?.data && (
        <Card>
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2>Fee Record Created!</h2>

              <p>
                {fee?.title} for {fee?.student.firstName}{" "}
                {fee?.student.lastName}
                has been created.
              </p>
            </div>

            {fee?.virtualAccounts && (
              <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                <p className="text-xs font-semibold uppercase">
                  Virtual Account
                </p>

                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all">
                    {fee?.virtualAccounts}
                  </code>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(fee?.virtualAccounts || "");
                      toast.success("Copied!");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

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
