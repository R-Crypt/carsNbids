"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GavelIcon, InfoIcon } from "lucide-react";
import type { Auction } from "@/lib/data";
import { bidIncrement, buyerFee, formatINR } from "@/lib/format";
import { useLiveAuction } from "@/components/auction-store";
import { useTimeLeft } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function BidDialog({ auction, trigger }: { auction: Auction; trigger: React.ReactNode }) {
  const live = useLiveAuction(auction);
  const t = useTimeLeft(live.endsAt);
  const minBid = live.currentBid + bidIncrement(live.currentBid);
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [agree, setAgree] = useState(false);

  const amount = Number(raw.replace(/[^\d]/g, "")) || 0;
  const valid = amount >= minBid;
  const fee = buyerFee(Math.max(amount, minBid));

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) {
      setRaw(String(minBid));
      setAgree(false);
    }
  };

  const submit = () => {
    const res = live.placeBid(amount);
    if (!res.ok) {
      toast.error(res.error);
      setRaw(String(live.currentBid + bidIncrement(live.currentBid)));
      return;
    }
    toast.success(`You're the high bidder at ${formatINR(amount)}`, {
      description: `${auction.year} ${auction.make} ${auction.model} · We'll notify you if you're outbid.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild disabled={t.ended}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place a bid</DialogTitle>
          <DialogDescription>{auction.title}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Current bid</div>
            <div key={live.pulse} className="rounded font-semibold tabular-nums animate-bid-flash">{formatINR(live.currentBid)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Time left</div>
            <div suppressHydrationWarning className="font-semibold tabular-nums">{t.label}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bid-amount">Your bid</Label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg font-semibold text-muted-foreground">₹</span>
            <Input
              id="bid-amount"
              inputMode="numeric"
              autoComplete="off"
              value={amount ? amount.toLocaleString("en-IN") : ""}
              onChange={(e) => setRaw(e.target.value)}
              className="h-12 pl-8 text-lg font-semibold tabular-nums"
              aria-invalid={!valid}
            />
          </div>
          <p className={valid ? "text-xs text-muted-foreground" : "text-xs text-destructive"}>
            Minimum bid {formatINR(minBid)} · increments of {formatINR(bidIncrement(live.currentBid))}
          </p>
          <div className="flex gap-2">
            {[1, 2, 5].map((n) => {
              const v = live.currentBid + bidIncrement(live.currentBid) * n;
              return (
                <Button key={n} type="button" size="sm" variant="outline" className="flex-1 tabular-nums" onClick={() => setRaw(String(v))}>
                  {formatINR(v)}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5 rounded-lg border p-3 text-sm">
          <Row label="Winning bid" value={formatINR(Math.max(amount, minBid))} />
          <Row label="Buyer's fee (4.5%)" value={formatINR(fee.fee)} />
          <Row label="GST on fee (18%)" value={formatINR(fee.gst)} />
          <Separator className="my-1" />
          <Row label="Total if you win" value={formatINR(Math.max(amount, minBid) + fee.total)} strong />
          <p className="flex items-start gap-1.5 pt-1 text-xs text-muted-foreground">
            <InfoIcon className="mt-0.5 size-3 shrink-0" />
            Excludes RTO transfer charges and any inter-state road tax. A refundable ₹25,000 hold is placed on your card/UPI.
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <Checkbox id="bid-agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
          <span className="text-muted-foreground">
            I understand bids are binding. If I win, I&apos;ll complete payment within 3 working days.
          </span>
        </label>

        <DialogFooter>
          <Button id="confirm-bid" className="w-full" size="lg" disabled={!valid || !agree} onClick={submit}>
            <GavelIcon /> Confirm bid of {formatINR(amount || minBid)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
