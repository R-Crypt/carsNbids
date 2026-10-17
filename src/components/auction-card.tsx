"use client";

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, HeartIcon, MapPinIcon, ShieldCheckIcon } from "lucide-react";
import type { Auction } from "@/lib/data";
import { formatINR, formatKms } from "@/lib/format";
import { useLiveAuction } from "@/components/auction-store";
import { useTimeLeft } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AuctionCard({ auction, priority = false }: { auction: Auction; priority?: boolean }) {
  const live = useLiveAuction(auction);
  const t = useTimeLeft(live.endsAt);

  return (
    <article className="group relative">
      <Link
        href={`/auctions/${auction.id}`}
        className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        id={`auction-card-${auction.id}`}
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted">
          <Image
            src={auction.images[0]}
            alt={auction.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-1.5">
            {auction.noReserve && (
              <Badge className="border-0 bg-background/95 font-semibold text-foreground shadow-sm">No Reserve</Badge>
            )}
            {auction.inspected && (
              <Badge className="border-0 bg-success/95 font-semibold text-success-foreground shadow-sm">
                <ShieldCheckIcon /> Inspected
              </Badge>
            )}
          </div>

          <div
            className={cn(
              "absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-black/80 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur",
              t.ended && "bg-black/60",
            )}
          >
            <span className={cn("flex items-center gap-1.5", t.urgent && "text-red-400")}>
              <ClockIcon className="size-3.5" />
              <span className="font-semibold tabular-nums" suppressHydrationWarning>{t.label}</span>
            </span>
            <span className="h-3.5 w-px bg-white/30" />
            <span key={live.pulse} className="rounded px-1 animate-bid-flash">
              <span className="text-white/60">{t.ended ? "Sold" : "Bid"}</span>{" "}
              <span className="font-semibold tabular-nums">{formatINR(live.currentBid)}</span>
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-1 pr-8">
          <h3 className="line-clamp-1 font-sans text-base font-semibold tracking-normal">{auction.title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{auction.subtitle}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="size-3" />
            {auction.city}, {auction.rto}
            <span className="mx-1">·</span>
            {formatKms(auction.kms)}
            <span className="mx-1">·</span>
            {auction.fuel}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={live.toggleWatch}
        aria-pressed={live.watching}
        aria-label={live.watching ? "Remove from watchlist" : "Add to watchlist"}
        className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-all hover:scale-110 hover:text-primary"
      >
        <HeartIcon className={cn("size-4", live.watching && "fill-primary text-primary")} />
      </button>
    </article>
  );
}
