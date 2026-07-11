"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppPagination } from "@/components/shared/AppPagination";
import { createStudentSchema, CreateStudentFormValues } from "@/schemas";
import { formatDate } from "@/utils/format";
import { getStudents } from "./_resources/api/get-students";
import { CreateStudent, StudentInfo } from "./_resources/api/create-student";
import { StudentsTableLoader } from "./_resources/components/student-table-loader";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

const columns: Column<StudentInfo>[] = [
  {
    key: "studentId",
    header: "Student ID",
    cell: (row) => <span className="font-mono text-xs">{row.id}</span>,
  },
  {
    key: "name",
    header: "Name",
    cell: (row) => (
      <p className="font-medium">
        {row.firstName} {row.lastName}
      </p>
    ),
  },
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
    key: "createdAt",
    header: "Enrolled",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
];

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  const {
    data: studentsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students", page, debouncedSearch],
    queryFn: () =>
      getStudents({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
      }),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });

  const students = studentsResponse?.data ?? [];

  const createStudentMutation = useMutation({
    mutationFn: CreateStudent,

    retry: 3,

    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),

    onSuccess: async () => {
      toast.success("Student created successfully!");
      refetchStudents();
      resetForm();
      setCreateStudentModalOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ["students", page],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create student.",
      );
    },
  });
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);

  useEffect(() => {
    if (!isError) return;

    toast.error(
      error instanceof Error ? error.message : "Failed to fetch students.",
    );
  }, [isError, error]);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    // setValue,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
  });

  const onSubmit = async (data: CreateStudentFormValues) => {
    await createStudentMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>

            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {Number(studentsResponse?.pagination.total) || 0} student
            {Number(studentsResponse?.pagination.total) > 1 && "s"} enrolled
          </p>
        </div>

        <Button onClick={() => setCreateStudentModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <StudentsTableLoader />
      ) : (
        <>
          <DataTable data={students} columns={columns} loading={isFetching} />
          {studentsResponse && (
            <AppPagination
              pagination={studentsResponse.pagination}
              onPageChange={setPage}
            />
          )}
        </>
      )}
      {/* Add Student Modal */}
      <Dialog
        open={createStudentModalOpen}
        onOpenChange={setCreateStudentModalOpen}
      >
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
                <Input
                  disabled={createStudentMutation.isPending}
                  {...register("firstName")}
                  placeholder="Chukwuemeka"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input
                  disabled={createStudentMutation.isPending}
                  {...register("lastName")}
                  placeholder="Okonkwo"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-3">Parent / Guardian</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Parent Name</Label>
                  <Input
                    disabled={createStudentMutation.isPending}
                    {...register("parentName")}
                    placeholder="Mr. Okonkwo"
                  />
                  {errors.parentName && (
                    <p className="text-xs text-destructive">
                      {errors.parentName.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Parent Phone</Label>
                    <Input
                      disabled={createStudentMutation.isPending}
                      {...register("parentPhone")}
                      placeholder="08023456789"
                    />
                    {errors.parentPhone && (
                      <p className="text-xs text-destructive">
                        {errors.parentPhone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Parent Email</Label>
                    <Input
                      disabled={createStudentMutation.isPending}
                      {...register("parentEmail")}
                      type="email"
                      placeholder="parent@email.com"
                    />
                    {errors.parentEmail && (
                      <p className="text-xs text-destructive">
                        {errors.parentEmail.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateStudentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createStudentMutation.isPending}>
                {createStudentMutation.isPending ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
