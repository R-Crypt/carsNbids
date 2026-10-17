"use client";

import { useNow } from "@/lib/clock";
import { formatTimeLeft } from "@/lib/format";
import { cn } from "@/lib/utils";

export function useTimeLeft(endsAt: number) {
  const now = useNow();
  if (now === null) return { ms: null as number | null, label: "—", urgent: false, ended: false };
  const ms = endsAt - now;
  return { ms, label: formatTimeLeft(ms), urgent: ms > 0 && ms < 60 * 60 * 1000, ended: ms <= 0 };
}

export function Countdown({ endsAt, className }: { endsAt: number; className?: string }) {
  const { label, urgent } = useTimeLeft(endsAt);
  return (
    <span
      suppressHydrationWarning
      className={cn("tabular-nums font-semibold", urgent && "text-live", className)}
    >
      {label}
    </span>
  );
}
