import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, BadgeIndianRupeeIcon, FileCheck2Icon, ShieldCheckIcon, LandmarkIcon } from "lucide-react";
import { FeaturedHero } from "@/components/featured-hero";
import { AuctionBrowser } from "@/components/auction-browser";
import { pastResults } from "@/lib/data";
import { formatINRShort } from "@/lib/format";
import { Button } from "@/components/ui/button";

const props = [
  { icon: ShieldCheckIcon, title: "200-point inspection", text: "Independent inspectors in 12 cities check every car before it goes live." },
  { icon: LandmarkIcon, title: "Escrow-protected", text: "Pay via UPI, NEFT or RTGS into escrow. Sellers get paid only after handover." },
  { icon: FileCheck2Icon, title: "RTO transfer handled", text: "RC transfer, NOC for inter-state moves and hypothecation removal — done for you." },
  { icon: BadgeIndianRupeeIcon, title: "Simple 4.5% buyer fee", text: "Min ₹10,000, capped at ₹1.5 lakh. Sellers list for free." },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 pt-6 sm:px-6 sm:pt-8">
      <FeaturedHero />

      <section aria-label="Why GaadiBids" className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {props.map((p) => (
          <div key={p.title} className="flex gap-3 bg-card p-5">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
              <p.icon className="size-5" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold tracking-normal">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      <Suspense>
        <AuctionBrowser />
      </Suspense>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Recently sold</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real prices, publicly recorded — the best way to value your car.</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/results">All results <ArrowRightIcon /></Link>
          </Button>
        </div>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {pastResults.slice(0, 6).map((r) => (
            <Link key={r.id} href="/results" className="group w-60 shrink-0 snap-start">
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted">
                <Image src={r.image} alt={r.title} fill sizes="240px" className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                <span className={`absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-semibold text-white ${r.soldFor ? "bg-success" : "bg-black/75"}`}>
                  {r.soldFor ? `Sold ${formatINRShort(r.soldFor)}` : `Bid to ${formatINRShort(r.bidTo!)}`}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.soldOn} · {r.city}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
