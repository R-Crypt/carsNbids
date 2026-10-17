"use client";

import { GavelIcon, HeartIcon, MessageSquareIcon, Share2Icon, TrophyIcon } from "lucide-react";
import { toast } from "sonner";
import type { Auction } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { useLiveAuction } from "@/components/auction-store";
import { useTimeLeft } from "@/components/countdown";
import { BidDialog } from "@/components/auction/bid-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Sticky bar under the gallery — mirrors the Cars & Bids live bid strip. */
export function BidBar({ auction }: { auction: Auction }) {
  const live = useLiveAuction(auction);
  const t = useTimeLeft(live.endsAt);

  return (
    <div className="sticky top-16 z-30 -mx-4 border-y bg-background/90 px-4 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-0">
      <div className="flex items-center gap-2 py-2 sm:px-2">
        <div className="flex flex-1 items-center overflow-x-auto rounded-lg bg-foreground px-1 text-background">
          <Cell label="Time left">
            <span suppressHydrationWarning className={cn("tabular-nums", t.urgent && "text-red-400")}>{t.label}</span>
          </Cell>
          <Cell label={t.ended ? "Sold for" : "High bid"}>
            <span key={live.pulse} className="rounded px-1 -mx-1 tabular-nums animate-bid-flash">{formatINR(live.currentBid)}</span>
          </Cell>
          <Cell label="Bids">{live.bids.length}</Cell>
          <Cell label="Comments" className="hidden sm:block">
            <span className="flex items-center gap-1"><MessageSquareIcon className="size-3.5" />{auction.comments.length}</span>
          </Cell>
          {live.youAreHigh && (
            <span className="mx-2 hidden shrink-0 items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground md:flex">
              <TrophyIcon className="size-3" /> You&apos;re winning
            </span>
          )}
        </div>
        <BidDialog
          auction={auction}
          trigger={
            <Button size="lg" className="h-12 rounded-lg px-5 text-base shadow-md shadow-primary/25" disabled={t.ended} id="place-bid">
              <GavelIcon /> {t.ended ? "Ended" : "Place bid"}
            </Button>
          }
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-12 rounded-lg sm:inline-flex"
              onClick={live.toggleWatch}
              aria-pressed={live.watching}
              aria-label="Watch auction"
              id="watch-auction"
            >
              <HeartIcon className={cn(live.watching && "fill-primary text-primary")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{live.watching ? "Watching" : "Watch this auction"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-12 rounded-lg sm:inline-flex"
              aria-label="Share"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied — share it on WhatsApp!");
              }}
            >
              <Share2Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy link</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function Cell({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("shrink-0 px-3 py-2 sm:px-4", className)}>
      <div className="text-[10px] font-medium tracking-wider text-background/55 uppercase">{label}</div>
      <div className="text-base font-bold sm:text-lg">{children}</div>
    </div>
  );
}
