import type { Metadata } from "next";
import { CheckCircle2Icon, ClockIcon, IndianRupeeIcon, UsersIcon } from "lucide-react";
import { SellForm } from "@/components/sell-form";

export const metadata: Metadata = {
  title: "Sell your car",
  description: "List your enthusiast car on GaadiBids for free. Inspection, photography and RTO transfer support included.",
};

const perks = [
  { icon: IndianRupeeIcon, title: "Free to list", text: "Sellers pay nothing. Our fee comes from the buyer." },
  { icon: UsersIcon, title: "2 lakh+ enthusiasts", text: "Verified, KYC'd bidders from every metro and beyond." },
  { icon: ClockIcon, title: "Sold in 7 days", text: "Week-long auctions with a hard finish and no endless haggling." },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3">
            <span className="text-sm font-semibold tracking-wider text-primary uppercase">Sell on GaadiBids</span>
            <h1 className="text-4xl leading-[1.05] font-bold sm:text-5xl">Your car deserves bidders who get it.</h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your car. If it&apos;s a fit, our team will schedule an inspection and professional shoot in your city within 72 hours.
            </p>
          </div>
          <ul className="space-y-5">
            {perks.map((p) => (
              <li key={p.title} className="flex gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <p.icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border bg-muted/40 p-5 text-sm">
            <p className="font-semibold">What we look for</p>
            <ul className="mt-2 space-y-1.5 text-muted-foreground">
              {["Enthusiast, collectible or cult-favourite cars", "Clean RC with no pending challans", "Honest condition — flaws are fine, surprises aren't"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <SellForm />
      </div>
    </div>
  );
}
