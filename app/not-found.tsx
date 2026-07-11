"use client";
import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <SearchX className="h-4 w-4" />
            Error 404
          </div>

          <div className="mt-8 space-y-5">
            <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
              404
            </h1>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              We couldn&rsquo;t find that page.
            </h2>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
              The page you&rsquo;re looking for may have been moved, deleted, or
              the URL may be incorrect. Return to the homepage or sign in to
              continue managing your school.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <h3 className="font-semibold">🏫 School Management</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Manage students, classes and guardians from one dashboard.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <h3 className="font-semibold">💳 Fee Collection</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Track installment payments and outstanding balances with ease.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <h3 className="font-semibold">📊 Reports</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                View payment history and financial summaries whenever you need
                them.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            ScholarPay helps schools manage students, installment payments and
            fee records from one secure platform.
          </p>
        </div>
      </div>
    </main>
  );
}
