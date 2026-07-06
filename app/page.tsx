"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

import {
  RegisterSchool,
  SchoolRegistrationResponse,
} from "./_resources/api/register-school";
import {
  RegisterSchoolFormValues,
  registerSchoolSchema,
} from "./_resources/schema/register-school";
import { NetworkRequestReturnType } from "@/lib/api/api-client";
import { useNavigate } from "@/hooks/useNavigate";

export default function SchoolPage() {
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
  const { navigateTo } = useNavigate();

  const createSchoolMutation = useMutation({
    mutationFn: RegisterSchool,

    onSuccess: (response) => {
      if (!response.success) {
        const apiErrors = response.errors ?? [];

        if (apiErrors.length > 0) {
          apiErrors.forEach((error) => toast.error(error.message));
        } else {
          toast.error("Unable to create school.");
        }

        return;
      }

      toast.success("School created successfully. Proceeding to Login...");
      setTimeout(() => {
        navigateTo("/login");
      }, 2000);

      reset();

      // TODO:
      // - Invalidate schools query
    },

    onError: (error: NetworkRequestReturnType<SchoolRegistrationResponse>) => {
      const response = error.data;

      if (response?.errors?.length) {
        response.errors.forEach((e) => toast.error(e.message));
        return;
      }

      if (response?.message) {
        toast.error(response.message);
        return;
      }

      toast.error("Something went wrong.");
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
    <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto flex min-h-screen items-center px-4 py-8 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          {/* Hero */}
          <section className="space-y-8">
            <div className="inline-flex w-fit items-center rounded-full border bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              🎓 Welcome to ScholarPay
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Simplify
                <span className="text-primary"> school fee </span>
                management.
              </h1>

              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Register your school and start collecting fees in installments,
                manage students, monitor payment history, and generate accurate
                financial records from one secure platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h3 className="font-semibold">
                  💳 Flexible Installment Payments
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Allow parents to pay school fees in multiple installments
                  while keeping balances up to date.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h3 className="font-semibold">👨‍🎓 Student Management</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Register students, organize classes and keep every
                  student&rsquo; payment records in one place.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h3 className="font-semibold">📊 Payment Tracking</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Monitor paid, pending and overdue fees with a complete payment
                  history.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h3 className="font-semibold">🔒 Secure & Reliable</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Your school&rsquo;cial records are securely stored and always
                  accessible.
                </p>
              </div>
            </div>
          </section>

          {/* Registration Card */}
          <section className="mx-auto w-full max-w-lg">
            <div className="rounded-3xl border bg-background p-6 shadow-2xl sm:p-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold">
                  Create Your School Account
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Get started in minutes. Register your school to begin managing
                  students and collecting installment fee payments.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>

                  <Input
                    id="name"
                    placeholder="ABC International School"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Official Email</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="school@example.com"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>

                  <Input
                    id="phone"
                    placeholder="+234 801 234 5678"
                    {...register("phone")}
                  />

                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
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
                  className="mt-2 h-12 w-full text-base"
                  disabled={createSchoolMutation.isPending}
                >
                  {createSchoolMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Creating Account...
                    </>
                  ) : (
                    "Create School Account"
                  )}
                </Button>

                <div className="space-y-4 pt-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Registration takes less than a minute.
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Already registered?
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    <Link
                      href="/login"
                      className="font-medium underline text-muted-foreground transition-colors hover:text-primary/80 hover:underline"
                    >
                      Sign in to your account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
