"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { auctions, type Auction } from "@/lib/data";
import { bidIncrement, formatINR } from "@/lib/format";
import { getAnchor } from "@/lib/clock";

export type LiveBid = { user: string; amount: number; minutesAgo: number; at?: number };

export type LiveAuction = {
  currentBid: number;
  bids: LiveBid[];
  /** Absolute end time once extended by anti-sniping, otherwise undefined. */
  extendedTo?: number;
  /** Increments every time a new bid lands — used to trigger flash animations. */
  pulse: number;
  youAreHigh: boolean;
  watching: boolean;
};

type Ctx = {
  live: Record<string, LiveAuction>;
  placeBid: (id: string, amount: number) => { ok: true } | { ok: false; error: string };
  toggleWatch: (id: string) => void;
  endsAt: (a: Auction) => number;
};

const AuctionCtx = createContext<Ctx | null>(null);

export const YOU = "you";
const SNIPE_WINDOW = 2 * 60 * 1000;

const simBidders = [
  "ghatroads", "the_vtec_guy", "manual_or_bust", "punefastlane", "redline_rohan",
  "petrolhead_priya", "offroad_ojas", "chai_and_chassis", "hosur_highway", "deccan_drifter",
];

function initialState(): Record<string, LiveAuction> {
  return Object.fromEntries(
    auctions.map((a) => [
      a.id,
      { currentBid: a.currentBid, bids: a.bids, pulse: 0, youAreHigh: false, watching: false },
    ]),
  );
}

export function AuctionProvider({ children }: { children: React.ReactNode }) {
  const [live, setLive] = useState(initialState);
  const liveRef = useRef(live);
  useEffect(() => {
    liveRef.current = live;
  }, [live]);

  const endsAt = useCallback(
    (a: Auction) => live[a.id]?.extendedTo ?? getAnchor() + a.endsInMinutes * 60_000,
    [live],
  );

  const applyBid = useCallback((id: string, user: string, amount: number) => {
    const a = auctions.find((x) => x.id === id)!;
    const now = Date.now();
    setLive((prev) => {
      const cur = prev[id];
      const end = cur.extendedTo ?? getAnchor() + a.endsInMinutes * 60_000;
      const extendedTo = end - now < SNIPE_WINDOW ? now + SNIPE_WINDOW : cur.extendedTo;
      return {
        ...prev,
        [id]: {
          ...cur,
          currentBid: amount,
          bids: [{ user, amount, minutesAgo: 0, at: now }, ...cur.bids],
          extendedTo,
          pulse: cur.pulse + 1,
          youAreHigh: user === YOU,
        },
      };
    });
  }, []);

  const placeBid = useCallback<Ctx["placeBid"]>(
    (id, amount) => {
      const cur = liveRef.current[id];
      const a = auctions.find((x) => x.id === id);
      if (!a || !cur) return { ok: false, error: "Auction not found" };
      const min = cur.currentBid + bidIncrement(cur.currentBid);
      if (amount < min) return { ok: false, error: `Minimum bid is ${formatINR(min)}` };
      applyBid(id, YOU, amount);
      return { ok: true };
    },
    [applyBid],
  );

  const toggleWatch = useCallback((id: string) => {
    setLive((prev) => ({ ...prev, [id]: { ...prev[id], watching: !prev[id].watching } }));
  }, []);

  // Simulated market activity so the demo feels alive.
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const open = auctions.filter((a) => {
        const cur = liveRef.current[a.id];
        const end = cur.extendedTo ?? getAnchor() + a.endsInMinutes * 60_000;
        return end > now;
      });
      if (!open.length) return;
      // Bias toward auctions that end soonest.
      const sorted = [...open].sort((x, y) => x.endsInMinutes - y.endsInMinutes);
      const pick = sorted[Math.floor(Math.pow(Math.random(), 2) * sorted.length)];
      const cur = liveRef.current[pick.id];
      const steps = Math.random() < 0.75 ? 1 : 2;
      const amount = cur.currentBid + bidIncrement(cur.currentBid) * steps;
      const user = simBidders[Math.floor(Math.random() * simBidders.length)];
      if (cur.youAreHigh) {
        toast.warning(`You've been outbid on the ${pick.year} ${pick.model}`, {
          description: `New high bid: ${formatINR(amount)} by @${user}`,
        });
      }
      applyBid(pick.id, user, amount);
    };
    const id = setInterval(tick, 9000);
    return () => clearInterval(id);
  }, [applyBid]);

  const value = useMemo(() => ({ live, placeBid, toggleWatch, endsAt }), [live, placeBid, toggleWatch, endsAt]);

  return <AuctionCtx.Provider value={value}>{children}</AuctionCtx.Provider>;
}

export function useAuctions() {
  const ctx = useContext(AuctionCtx);
  if (!ctx) throw new Error("useAuctions must be used inside AuctionProvider");
  return ctx;
}

export function useLiveAuction(a: Auction) {
  const { live, endsAt, placeBid, toggleWatch } = useAuctions();
  return {
    ...live[a.id],
    endsAt: endsAt(a),
    placeBid: (amount: number) => placeBid(a.id, amount),
    toggleWatch: () => toggleWatch(a.id),
  };
}
