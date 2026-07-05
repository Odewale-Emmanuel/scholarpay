"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateSchoolForm } from "./create-school-form";

export function CreateSchoolDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create School</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create School</DialogTitle>

          <DialogDescription>
            Fill in the details below to register a new school.
          </DialogDescription>
        </DialogHeader>

        <CreateSchoolForm />
      </DialogContent>
    </Dialog>
  );
}
