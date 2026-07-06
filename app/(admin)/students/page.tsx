"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { DataTable, Column } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStudentSchema, CreateStudentFormValues } from "@/schemas";
import { Student } from "@/types";
import { mockStudents } from "@/mock/data";
import { formatDate } from "@/utils/format";
import { GRADES } from "@/constants";

const columns: Column<Student>[] = [
  {
    key: "studentId",
    header: "Student ID",
    cell: (row) => <span className="font-mono text-xs">{row.studentId}</span>,
  },
  {
    key: "name",
    header: "Name",
    cell: (row) => (
      <Link href={`/students/${row.id}`} className="font-medium hover:underline">
        {row.firstName} {row.lastName}
      </Link>
    ),
  },
  { key: "grade", header: "Grade" },
  {
    key: "parentName",
    header: "Parent/Guardian",
    cell: (row) => (
      <div>
        <p className="text-sm">{row.parentName}</p>
        <p className="text-xs text-muted-foreground">{row.parentPhone}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    header: "Enrolled",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (row) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/students/${row.id}`}>View</Link>
      </Button>
    ),
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
  });

  const filtered = students.filter((s) => {
    const matchesSearch =
      !search ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const onSubmit = async (data: CreateStudentFormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const studentRecordId = data.studentId.trim() || crypto.randomUUID();
    const newStudent: Student = {
      ...data,
      id: studentRecordId,
      schoolId: "sch_001",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    toast.success("Student added successfully");
    setModalOpen(false);
    reset();
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">{students.length} students enrolled</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
          className="w-64"
        />
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {GRADES.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && search ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description={`No results for "${search}". Try a different search.`}
        />
      ) : (
        <DataTable data={filtered} columns={columns} />
      )}

      {/* Add Student Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the student and parent/guardian details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input {...register("firstName")} placeholder="Chukwuemeka" />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input {...register("lastName")} placeholder="Okonkwo" />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Student ID</Label>
              <Input {...register("studentId")} placeholder="SP-2025-007" />
              {errors.studentId && <p className="text-xs text-destructive">{errors.studentId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="student@email.com" />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="08012345678" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select onValueChange={(v) => setValue("grade", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.grade && <p className="text-xs text-destructive">{errors.grade.message}</p>}
            </div>
            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-3">Parent / Guardian</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Parent Name</Label>
                  <Input {...register("parentName")} placeholder="Mr. Okonkwo" />
                  {errors.parentName && <p className="text-xs text-destructive">{errors.parentName.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Parent Phone</Label>
                    <Input {...register("parentPhone")} placeholder="08023456789" />
                    {errors.parentPhone && <p className="text-xs text-destructive">{errors.parentPhone.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Parent Email</Label>
                    <Input {...register("parentEmail")} type="email" placeholder="parent@email.com" />
                    {errors.parentEmail && <p className="text-xs text-destructive">{errors.parentEmail.message}</p>}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
