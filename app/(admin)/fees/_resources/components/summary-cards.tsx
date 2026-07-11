import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Summary = {
  total: number;
  pending: number;
  partiallyPaid: number;
  paid: number;
  overdue: number;
};

type SummaryCardsProps = {
  summary: Summary;
  loading?: boolean;
};

export function SummaryCards({ summary, loading = false }: SummaryCardsProps) {
  const items = [
    {
      label: "Total",
      value: summary.total,
    },
    {
      label: "Pending",
      value: summary.pending,
    },
    {
      label: "Partially Paid",
      value: summary.partiallyPaid,
    },
    {
      label: "Paid",
      value: summary.paid,
    },
    {
      label: "Overdue",
      value: summary.overdue,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex flex-col gap-2 p-6">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <h3 className="text-3xl font-bold tracking-tight">
                  {item.value.toLocaleString()}
                </h3>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
