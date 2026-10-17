import type { Metadata } from "next";
import Image from "next/image";
import { pastResults } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Past results",
  description: "Every AutoBid sale, publicly recorded. Use real auction prices to value enthusiast cars in India.",
};

export default function ResultsPage() {
  const sold = pastResults.filter((r) => r.soldFor);
  const total = sold.reduce((s, r) => s + (r.soldFor ?? 0), 0);
  const sellThrough = Math.round((sold.length / pastResults.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Past Results</h1>
        <p className="max-w-2xl text-muted-foreground">Every sale, publicly recorded. The most honest price guide for enthusiast cars in India.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Sold (last 30 days)", formatINR(total)],
          ["Sell-through rate", `${sellThrough}%`],
          ["Avg. bids per auction", String(Math.round(pastResults.reduce((s, r) => s + r.bids, 0) / pastResults.length))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[45%]">Car</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Ended</TableHead>
              <TableHead className="text-right">Bids</TableHead>
              <TableHead className="text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastResults.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-18 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={r.image} alt="" fill sizes="72px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.city}</TableCell>
                <TableCell className="text-muted-foreground">{r.soldOn}</TableCell>
                <TableCell className="text-right tabular-nums">{r.bids}</TableCell>
                <TableCell className="text-right">
                  {r.soldFor ? (
                    <Badge className="bg-success/15 font-semibold text-success tabular-nums">Sold {formatINR(r.soldFor)}</Badge>
                  ) : (
                    <Badge variant="secondary" className="tabular-nums">Bid to {formatINR(r.bidTo!)}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
