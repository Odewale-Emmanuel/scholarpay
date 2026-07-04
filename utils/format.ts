import { format, formatDistanceToNow, parseISO } from "date-fns";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true });
}

export function generatePaymentToken(): string {
  return "tok_" + Math.random().toString(36).substring(2, 10);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
