"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { RegisterSchool } from "../api/register-school";
import {
  RegisterSchoolFormValues,
  registerSchoolSchema,
} from "../schema/register-school";

export function CreateSchoolForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchoolFormValues>({
    resolver: zodResolver(registerSchoolSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createSchoolMutation = useMutation({
    mutationFn: RegisterSchool,

    onSuccess: (response) => {
      if (!response.success) {
        const apiErrors = response.errors?.errors ?? [];

        if (apiErrors.length > 0) {
          apiErrors.forEach((error) => toast.error(error.message));
        } else {
          toast.error("Unable to create school.");
        }

        return;
      }

      toast.success("School created successfully.");

      reset();

      // TODO:
      // - Close dialog
      // - Invalidate schools query
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);
    },
  });

  const onSubmit = (values: RegisterSchoolFormValues) => {
    createSchoolMutation.mutate({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">School Name</Label>

        <Input
          id="name"
          placeholder="ABC International School"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="school@example.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input id="phone" placeholder="+234..." {...register("phone")} />

        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input id="password" type="password" {...register("password")} />

        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>

        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createSchoolMutation.isPending}
      >
        {createSchoolMutation.isPending ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Creating...
          </>
        ) : (
          "Create School"
        )}
      </Button>
    </form>
  );
}
