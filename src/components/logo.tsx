import Link from "next/link";
import { GavelIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)} aria-label="GaadiBids home">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-300 group-hover:-rotate-12">
        <GavelIcon className="size-[18px]" strokeWidth={2.4} aria-hidden />
      </span>
      <span className="font-heading text-xl font-bold tracking-tight">
        Gaadi<span className="text-primary">Bids</span>
      </span>
    </Link>
  );
}
