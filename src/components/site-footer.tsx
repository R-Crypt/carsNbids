import Link from "next/link";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const cols = [
  { title: "Buy", links: [["Live auctions", "/"], ["Past results", "/results"], ["How bidding works", "/how-it-works"], ["Buyer's fee", "/how-it-works#fees"]] },
  { title: "Sell", links: [["Sell your car", "/sell"], ["Inspection", "/how-it-works#inspection"], ["RTO transfer help", "/how-it-works#rto"], ["Seller FAQs", "/how-it-works"]] },
  { title: "Company", links: [["About", "/how-it-works"], ["Careers", "/"], ["Press", "/"], ["Contact", "/"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            India&apos;s home for enthusiast car auctions. Inspected cars, transparent bidding, and RTO paperwork handled end-to-end.
          </p>
          <p className="text-xs text-muted-foreground">Payments held in RBI-regulated escrow · UPI · NEFT · RTGS</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 text-sm font-semibold">{c.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-foreground">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>© 2026 GaadiBids Technologies Pvt. Ltd. · Demo build</p>
        <p>Made for petrolheads in 🇮🇳</p>
      </div>
    </footer>
  );
}
