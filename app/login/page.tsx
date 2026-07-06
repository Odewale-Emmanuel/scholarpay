"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { loginSchema, LoginFormValues } from "@/schema/login";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreditCard, GraduationCap, Landmark, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  login,
  SchoolLoginResponse,
  LoginDetails,
} from "./_resources/api/login";
import { NetworkRequestReturnType } from "@/lib/api/api-client";
import { useNavigate } from "@/hooks/useNavigate";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { navigateTo } = useNavigate();

  const createSchoolLoginMutation = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      if (!response.success) {
        const apiErrors = response.errors ?? [];

        if (apiErrors.length > 0) {
          apiErrors.forEach((error) => toast.error(error.message));
        } else {
          toast.error("Unable to login, please try again.");
        }

        return;
      }

      toast.success("Login successful. Proceeding to Dashboard...");
      setTimeout(() => {
        navigateTo("/dashboard");
      }, 1500);

      reset();
    },

    onError: (error: NetworkRequestReturnType<SchoolLoginResponse>) => {
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

  const onSubmit = (values: LoginDetails) => {
    createSchoolLoginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary/5">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <section className="hidden flex-col justify-between gap-10 bg-primary p-12 text-primary-foreground lg:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <GraduationCap className="size-7" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">ScholarPay</h2>
              <p className="text-primary-foreground/80">
                Fee Management Platform
              </p>
            </div>
          </div>

          <div className=" max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Modern fee collection for modern schools.
            </h1>

            <p className="mt-6 text-lg text-primary-foreground/80">
              Track installment payments, manage students, monitor outstanding
              balances and simplify your school&rsquo;s finances.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
              <CreditCard className="mt-1 size-5" />
              <div>
                <h3 className="font-semibold">Installment Fee Payments</h3>

                <p className="text-sm text-primary-foreground/75">
                  Accept and monitor payments over multiple installments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Landmark className="mt-1 size-5" />
              <div>
                <h3 className="font-semibold">Financial Reports</h3>

                <p className="text-sm text-primary-foreground/75">
                  View revenue, balances and payment history instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
              <ShieldCheck className="mt-1 size-5" />
              <div>
                <h3 className="font-semibold">Secure Cloud Platform</h3>

                <p className="text-sm text-primary-foreground/75">
                  Your school&rsquo;s financial records are protected and
                  available anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 text-center lg:hidden">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <GraduationCap className="size-7" />
              </div>

              <h1 className="text-3xl font-bold">ScholarPay</h1>
            </div>

            <div className="rounded-3xl border bg-background p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Welcome Back</h2>

                <p className="mt-2 text-muted-foreground">
                  Sign in to continue managing your school&rsquo;s fee payments.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

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

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={createSchoolLoginMutation.isPending}
                >
                  {createSchoolLoginMutation.isPending
                    ? "Signing in..."
                    : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Don&rsquo;t have a school account?{" "}
                <Link
                  href="/"
                  className="font-medium text-primary hover:underline"
                >
                  Register your school
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
