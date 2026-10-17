import type { Metadata } from "next";
import Link from "next/link";
import { BadgeIndianRupeeIcon, CameraIcon, ClipboardCheckIcon, FileCheck2Icon, GavelIcon, KeyRoundIcon, LandmarkIcon, TimerIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR, buyerFee } from "@/lib/format";

export const metadata: Metadata = {
  title: "How it works",
  description: "How buying and selling on GaadiBids works — inspections, escrow, buyer's fee and RTO transfer.",
};

const buy = [
  { icon: KeyRoundIcon, title: "Verify once", text: "Quick KYC with Aadhaar/PAN and a card or UPI mandate. Takes 2 minutes." },
  { icon: GavelIcon, title: "Bid live", text: "A refundable ₹25,000 hold is placed when you bid. Late bids extend the clock." },
  { icon: LandmarkIcon, title: "Pay via escrow", text: "Win, then pay the seller through escrow via UPI, NEFT or RTGS within 3 days." },
  { icon: FileCheck2Icon, title: "Drive home", text: "We coordinate RC transfer, NOC for inter-state moves and Form 35 if needed." },
];
const sell = [
  { icon: ClipboardCheckIcon, title: "Submit", text: "Share details and a few photos. We reply within 24 hours." },
  { icon: CameraIcon, title: "Inspect & shoot", text: "An inspector and photographer visit you — free in 12 cities." },
  { icon: TimerIcon, title: "7-day auction", text: "Answer questions in the comments while bids roll in." },
  { icon: BadgeIndianRupeeIcon, title: "Get paid", text: "Funds released from escrow the moment the buyer takes delivery." },
];

const examples = [3_00_000, 10_00_000, 25_00_000, 50_00_000, 1_00_00_000];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 pt-10 sm:px-6">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">How GaadiBids works</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Transparent, week-long auctions for cars enthusiasts actually care about — built around how cars change hands in India.</p>
      </div>

      {[["Buying", buy], ["Selling", sell]].map(([label, items]) => (
        <section key={label as string} className="space-y-6">
          <h2 className="text-2xl font-bold">{label as string}</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(items as typeof buy).map((s, i) => (
              <li key={s.title} className="relative rounded-xl border bg-card p-5">
                <span className="absolute top-4 right-4 font-heading text-3xl font-bold text-muted-foreground/25">{i + 1}</span>
                <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><s.icon className="size-5" /></div>
                <p className="mt-4 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section id="fees" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold">Buyer&apos;s fee</h2>
        <p className="text-muted-foreground">4.5% of the winning bid — minimum ₹10,000, maximum ₹1,50,000 — plus 18% GST on the fee. Sellers list free.</p>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Winning bid</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.map((b) => {
                const f = buyerFee(b);
                return (
                  <TableRow key={b}>
                    <TableCell className="font-medium tabular-nums">{formatINR(b)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatINR(f.fee)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatINR(f.gst)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatINR(f.total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="rto" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <Accordion type="single" collapsible className="rounded-xl border px-4">
          {[
            ["Can I buy a car registered in another state?", "Yes. We help the seller obtain an NOC from their RTO and guide you through re-registration and any road-tax difference in your state."],
            ["What about Delhi-NCR's 10/15-year rule?", "Listings affected by NCR age limits are clearly flagged. Buyers outside NCR can re-register them; we provide the NOC paperwork."],
            ["What if the car has an active loan?", "The seller's loan is cleared from escrow funds first, and we collect Form 35 and the bank NOC before transferring the balance."],
            ["Is my ₹25,000 hold refunded?", "Instantly, if you don't win. If you win, it's adjusted against the buyer's fee."],
            ["What is anti-sniping?", "Any bid in the final 2 minutes resets the clock to 2 minutes, so everyone gets a fair shot."],
          ].map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div id="inspection" className="flex flex-col items-center gap-4 rounded-2xl bg-foreground p-10 text-center text-background">
        <h2 className="text-3xl font-bold">Ready to find your next car?</h2>
        <div className="flex gap-3">
          <Button asChild size="lg" className="rounded-full"><Link href="/">Browse auctions</Link></Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full"><Link href="/sell">Sell a car</Link></Button>
        </div>
      </div>
    </div>
  );
}
