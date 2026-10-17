import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WrenchIcon,
  HistoryIcon,
  ListChecksIcon,
  UsersIcon,
} from "lucide-react";
import { auctions, getAuction } from "@/lib/data";
import { formatKms } from "@/lib/format";
import { Gallery } from "@/components/auction/gallery";
import { BidBar } from "@/components/auction/bid-bar";
import { CommentsSection } from "@/components/auction/comments";
import { AuctionCard } from "@/components/auction-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function generateStaticParams() {
  return auctions.map((a) => ({ id: a.id }));
}

export async function generateMetadata(props: PageProps<"/auctions/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const a = getAuction(id);
  if (!a) return { title: "Auction not found" };
  return { title: a.title, description: `${a.subtitle}. Bid live on AutoBid.` };
}

export default async function AuctionPage(props: PageProps<"/auctions/[id]">) {
  const { id } = await props.params;
  const a = getAuction(id);
  if (!a) notFound();

  const facts: [string, string][] = [
    ["Make", a.make],
    ["Model", a.model],
    ["Year", String(a.year)],
    ["Kms driven", formatKms(a.kms)],
    ["Ownership", `${ordinal(a.owners)} owner`],
    ["Registration", `${a.rto} · ${a.state}`],
    ["Fuel", a.fuel],
    ["Engine", a.engine],
    ["Transmission", a.transmission],
    ["Drivetrain", a.drivetrain],
    ["Body style", a.bodyStyle],
    ["Exterior", a.exteriorColor],
    ["Interior", a.interiorColor],
    ["Insurance", a.insurance],
    ["Seller type", a.sellerType],
    ["Location", `${a.city}, ${a.state}`],
  ];

  const similar = auctions.filter((x) => x.id !== a.id && (x.bodyStyle === a.bodyStyle || x.transmission === a.transmission)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Auctions</Link>
        <ChevronRightIcon className="size-3" />
        <span>{a.make}</span>
        <ChevronRightIcon className="size-3" />
        <span className="text-foreground">{a.model}</span>
      </nav>

      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {a.noReserve && <Badge variant="secondary" className="font-semibold">No Reserve</Badge>}
            {a.inspected && <Badge className="bg-success text-success-foreground"><ShieldCheckIcon /> AutoBid Inspected</Badge>}
            <Badge variant="outline"><MapPinIcon /> {a.city}, {a.rto}</Badge>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{a.title}</h1>
          <p className="text-muted-foreground sm:text-lg">{a.subtitle}</p>
        </div>
      </header>

      <Gallery images={a.images} title={a.title} />

      <div className="mt-4">
        <BidBar auction={a} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="sr-only">Quick facts</h2>
            <dl className="grid overflow-hidden rounded-xl border sm:grid-cols-2">
              {facts.map(([k, v], i) => (
                <div key={k} className={`flex gap-4 border-b px-4 py-3 text-sm ${i % 4 < 2 ? "bg-muted/40" : ""} sm:[&:nth-last-child(-n+2)]:border-b-0`}>
                  <dt className="w-28 shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/70 to-transparent p-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 ring-2 ring-primary/30">
                <AvatarFallback className="bg-primary font-bold text-primary-foreground">AB</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-heading text-xl font-bold">Our Take</h2>
                <p className="text-xs text-muted-foreground">From the AutoBid editorial team</p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed">{a.ourTake}</p>
          </section>

          <ListSection icon={SparklesIcon} title="Highlights" items={a.highlights} />
          <ListSection icon={ListChecksIcon} title="Equipment" items={a.equipment} columns />
          {a.modifications.length > 0 && <ListSection icon={WrenchIcon} title="Modifications" items={a.modifications} />}
          <ListSection icon={AlertTriangleIcon} title="Known flaws" items={a.knownFlaws} tone="warn" />

          <section>
            <h2 className="mb-3 text-2xl font-bold">History &amp; documents</h2>
            <Accordion type="multiple" defaultValue={["service"]} className="rounded-xl border px-4">
              <AccordionItem value="service">
                <AccordionTrigger><span className="flex items-center gap-2"><HistoryIcon className="size-4" /> Recent service history</span></AccordionTrigger>
                <AccordionContent>
                  <ol className="relative ml-2 space-y-4 border-l pl-5">
                    {a.service.map((s) => (
                      <li key={s} className="relative text-sm">
                        <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-background bg-primary" />
                        {s}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ownership">
                <AccordionTrigger><span className="flex items-center gap-2"><UsersIcon className="size-4" /> Ownership &amp; RTO history</span></AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">{a.ownership}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="docs">
                <AccordionTrigger><span className="flex items-center gap-2"><FileTextIcon className="size-4" /> Documents verified</span></AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    {["Registration Certificate (RC)", "Valid PUC certificate", "Insurance policy", "Road tax receipts", "No hypothecation / Form 35", "Service records"].map((d) => (
                      <li key={d} className="flex items-center gap-2"><BadgeCheckIcon className="size-4 text-success" /> {d}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator />
          <CommentsSection auction={a} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-40 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-base tracking-normal">Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-primary/15 font-semibold text-primary">{a.seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{a.seller.name}</p>
                  <p className="text-xs text-muted-foreground">@{a.seller.username} · {a.sellerType} · since {a.seller.memberSince}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="#comments">Ask the seller a question</Link>
              </Button>
            </CardContent>
          </Card>

          {a.inspected && (
            <Card className="border-success/40 bg-success/5">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 font-semibold"><ClipboardCheckIcon className="size-5 text-success" /> Inspection report</div>
                <p className="text-sm text-muted-foreground">200-point inspection by an independent AutoBid inspector, including OBD scan, paint-depth readings and a road test.</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[["Engine", "9.1"], ["Body", "8.4"], ["Interior", "8.8"]].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-background p-2">
                      <div className="text-lg font-bold text-success">{v}</div>
                      <div className="text-muted-foreground">{k}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">View full report (PDF)</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="space-y-3 text-sm">
              <p className="font-semibold">How buying works</p>
              <ol className="space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">1.</span> Bid — a refundable ₹25,000 hold is placed.</li>
                <li><span className="font-medium text-foreground">2.</span> Win — pay the seller via escrow within 3 days.</li>
                <li><span className="font-medium text-foreground">3.</span> Pick up — we handle RC transfer and NOC.</li>
              </ol>
              <p className="text-xs text-muted-foreground">Bids in the last 2 minutes extend the auction by 2 minutes — no sniping.</p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 space-y-5">
          <h2 className="text-2xl font-bold">You might also like</h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {similar.map((s) => <AuctionCard key={s.id} auction={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ordinal(n: number) {
  return ["", "1st", "2nd", "3rd"][n] ?? `${n}th`;
}

function ListSection({
  icon: Icon,
  title,
  items,
  columns,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  columns?: boolean;
  tone?: "warn";
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
        <Icon className={tone === "warn" ? "size-5 text-amber-500" : "size-5 text-primary"} />
        {title}
      </h2>
      <ul className={columns ? "grid gap-x-6 gap-y-2 sm:grid-cols-2" : "space-y-2"}>
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 leading-relaxed">
            <span className={`mt-2.5 size-1.5 shrink-0 rounded-full ${tone === "warn" ? "bg-amber-500" : "bg-primary"}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
