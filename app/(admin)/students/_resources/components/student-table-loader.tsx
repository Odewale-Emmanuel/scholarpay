// components/shared/StudentsTableLoader.tsx

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentsTableLoader() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <div className="text-center">
            <h3 className="font-semibold">Loading students</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the latest records...
            </p>
          </div>

          <div className="w-full mt-8 space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Fake rows */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
