"use client";

import { CheckCircle2, ChevronDown } from "lucide-react";
import { Circle, CircleDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "@/hooks/useNavigate";
import { StudentInfo } from "@/app/(admin)/students/_resources/api/create-student";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedStudent } from "@/lib/store/slices/user/studentSlice";
import { Spinner } from "@/components/ui/spinner";

type StudentSelectorProps = {
  students: StudentInfo[];
  loading?: boolean;
};

export function StudentSelector({
  students,
  loading = false,
}: StudentSelectorProps) {
  const { navigateTo } = useNavigate();
  const dispatch = useAppDispatch();
  const selectedStudent = useAppSelector((s) => s.student.selectedStudent);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 flex gap-1.5 items-center justify-center w-full rounded-lg">
          <Spinner className="size-3 text-gray-500" />
          <span className="text-sm text-gray-500 ">Loading students...</span>
        </Skeleton>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <h3 className="text-lg font-semibold">No students found</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a student to continue.
        </p>

        <Button className="mt-5" onClick={() => navigateTo("/students")}>
          Create Student
        </Button>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="students" className="rounded-lg border px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex flex-col items-start">
            <span className="font-medium">
              {selectedStudent
                ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                : "Select Student"}
            </span>

            <span className="text-sm text-muted-foreground">
              {selectedStudent
                ? `${selectedStudent.parentName} • ${selectedStudent.parentPhone}`
                : `${students.length} student${
                    students.length > 1 ? "s" : ""
                  } available`}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pt-3">
          <div className="space-y-2">
            {students.map((student) => {
              const selected = student.id === selectedStudent?.id;

              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() =>
                    dispatch(setSelectedStudent(selected ? null : student))
                  }
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors hover:bg-muted ${
                    selected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-5">
                      {student.firstName} {student.lastName}
                    </p>

                    <p className="truncate text-xs leading-4 text-muted-foreground">
                      {student.parentName} • {student.parentPhone}
                    </p>
                  </div>

                  <div className="ml-3 shrink-0">
                    {selected ? (
                      <CircleDot className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
