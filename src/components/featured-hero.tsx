"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, FlameIcon, GavelIcon, MapPinIcon } from "lucide-react";
import { auctions, getAuction, featuredAuctionId } from "@/lib/data";
import { formatINR, formatINRShort } from "@/lib/format";
import { useAuctions, useLiveAuction } from "@/components/auction-store";
import { useTimeLeft } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeaturedHero() {
  const a = getAuction(featuredAuctionId)!;
  const live = useLiveAuction(a);
  const t = useTimeLeft(live.endsAt);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Link
        href={`/auctions/${a.id}`}
        id="featured-auction"
        className="group relative isolate block min-h-[420px] overflow-hidden rounded-2xl bg-muted sm:min-h-[500px]"
      >
        <Image
          src={a.images[0]}
          alt={a.title}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="-z-10 object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="flex h-full min-h-[inherit] flex-col justify-end gap-5 p-6 text-white sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-0 bg-primary text-primary-foreground">
              <FlameIcon /> Featured Auction
            </Badge>
            <Badge variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur">
              <MapPinIcon /> {a.city}, {a.rto}
            </Badge>
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl leading-[1.05] font-bold sm:text-5xl">{a.title}</h1>
            <p className="text-base text-white/80 sm:text-lg">{a.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <Stat label="Time left">
              <span suppressHydrationWarning className={cn("tabular-nums", t.urgent && "text-red-400")}>{t.label}</span>
            </Stat>
            <Stat label="High bid">
              <span key={live.pulse} className="rounded px-1 -mx-1 tabular-nums animate-bid-flash">{formatINR(live.currentBid)}</span>
            </Stat>
            <Stat label="Bids">{live.bids.length}</Stat>
            <Stat label="Watching">{a.watchers.toLocaleString("en-IN")}</Stat>
            <span className="ml-auto hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform group-hover:translate-x-1 sm:inline-flex">
              View auction <ArrowRightIcon className="size-4" />
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-6">
        <EndingSoon />
        <Card className="relative gap-3 overflow-hidden border-0 bg-gradient-to-br from-primary to-[oklch(0.55_0.2_30)] p-6 text-primary-foreground">
          <GavelIcon className="absolute -right-4 -bottom-4 size-32 rotate-12 opacity-15" />
          <h2 className="text-2xl font-bold">Selling an enthusiast car?</h2>
          <p className="text-sm text-primary-foreground/85">
            Reach 2 lakh+ verified petrolheads across India. Free to list, inspection included, and we handle the RTO paperwork.
          </p>
          <Button asChild variant="secondary" className="mt-2 w-fit rounded-full" id="hero-sell-cta">
            <Link href="/sell">Get started <ArrowRightIcon /></Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium tracking-wider text-white/60 uppercase">{label}</div>
      <div className="text-xl font-bold sm:text-2xl">{children}</div>
    </div>
  );
}

function EndingSoon() {
  const { endsAt } = useAuctions();
  const list = [...auctions]
    .filter((a) => a.id !== featuredAuctionId)
    .sort((x, y) => endsAt(x) - endsAt(y))
    .slice(0, 3);

  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="flex items-center gap-2 font-sans text-sm font-semibold tracking-normal">
          <ClockIcon className="size-4 text-live" /> Ending soon
        </h2>
        <Link href="/#auctions" className="text-xs font-medium text-muted-foreground hover:text-foreground">See all</Link>
      </div>
      <ul>
        {list.map((a) => (
          <EndingSoonRow key={a.id} id={a.id} />
        ))}
      </ul>
    </Card>
  );
}

function EndingSoonRow({ id }: { id: string }) {
  const a = getAuction(id)!;
  const live = useLiveAuction(a);
  const t = useTimeLeft(live.endsAt);
  return (
    <li className="border-t first:border-t-0">
      <Link href={`/auctions/${a.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/60">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image src={a.images[0]} alt="" fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{a.year} {a.make} {a.model}</p>
          <p className="text-xs text-muted-foreground">
            <span suppressHydrationWarning className={cn("font-semibold tabular-nums", t.urgent ? "text-live" : "text-foreground")}>{t.label}</span>
            <span className="mx-1.5">·</span>
            <span key={live.pulse} className="rounded px-0.5 animate-bid-flash">{formatINRShort(live.currentBid)}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
