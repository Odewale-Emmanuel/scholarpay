import { format, formatDistanceToNow, parseISO } from "date-fns";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export type FormatNumberOptions = {
  style?: "number" | "currency";
  compact?: boolean;
  currency?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  maximumFractionDigits?: number;
};

export function formatNumber(
  value: number,
  {
    style = "number",
    compact = false,
    currency = "NGN",
    locale = "en-NG",
    prefix = "",
    suffix = "",
    maximumFractionDigits = 1,
  }: FormatNumberOptions = {},
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: style === "number" ? "decimal" : "currency",
    ...(style === "currency" ? { currency } : {}),
    notation: compact ? "compact" : "standard",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });

  return `${prefix}${formatter.format(value)}${suffix}`;
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
