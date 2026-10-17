"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { auctions, states, type Auction } from "@/lib/data";
import { AuctionCard } from "@/components/auction-card";
import { useAuctions } from "@/components/auction-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Sort = "ending" | "new" | "noreserve" | "lowkms";

const decades = [
  { value: "all", label: "All years" },
  { value: "1990", label: "1990s" },
  { value: "2000", label: "2000s" },
  { value: "2010", label: "2010s" },
  { value: "2020", label: "2020s" },
];

export function AuctionBrowser() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const { endsAt } = useAuctions();

  const [sort, setSort] = useState<Sort>("ending");
  const [decade, setDecade] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [body, setBody] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [state, setState] = useState("all");

  const filtersActive = [decade, transmission, body, fuel, state].some((v) => v !== "all");

  const list = useMemo(() => {
    let out: Auction[] = auctions.filter((a) => {
      if (q && !`${a.title} ${a.subtitle} ${a.city} ${a.state}`.toLowerCase().includes(q)) return false;
      if (decade !== "all" && Math.floor(a.year / 10) * 10 !== Number(decade)) return false;
      if (transmission !== "all" && a.transmission !== transmission) return false;
      if (body !== "all" && a.bodyStyle !== body) return false;
      if (fuel !== "all" && a.fuel !== fuel) return false;
      if (state !== "all" && a.state !== state) return false;
      return true;
    });
    if (sort === "noreserve") out = out.filter((a) => a.noReserve);
    out = [...out].sort((x, y) => {
      switch (sort) {
        case "new":
          return x.listedDaysAgo - y.listedDaysAgo;
        case "lowkms":
          return x.kms - y.kms;
        default:
          return endsAt(x) - endsAt(y);
      }
    });
    return out;
  }, [q, decade, transmission, body, fuel, state, sort, endsAt]);

  const reset = () => {
    setDecade("all");
    setTransmission("all");
    setBody("all");
    setFuel("all");
    setState("all");
  };

  return (
    <section id="auctions" className="scroll-mt-20">
      <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Live Auctions</h2>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-live animate-live-pulse" />
            {list.length} live
          </span>
        </div>

        <Tabs value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <TabsList className="h-9">
            <TabsTrigger value="ending" id="sort-ending">Ending soon</TabsTrigger>
            <TabsTrigger value="new" id="sort-new">Newly listed</TabsTrigger>
            <TabsTrigger value="noreserve" id="sort-noreserve">No reserve</TabsTrigger>
            <TabsTrigger value="lowkms" id="sort-lowkms">Lowest km</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-4">
        <SlidersHorizontalIcon className="mr-1 size-4 text-muted-foreground" />
        <FilterSelect id="filter-year" value={decade} onChange={setDecade} options={decades} />
        <FilterSelect
          id="filter-transmission"
          value={transmission}
          onChange={setTransmission}
          options={[{ value: "all", label: "Transmission" }, { value: "Manual", label: "Manual" }, { value: "Automatic", label: "Automatic" }]}
        />
        <FilterSelect
          id="filter-body"
          value={body}
          onChange={setBody}
          options={[
            { value: "all", label: "Body style" },
            ...["Sedan", "Hatchback", "SUV", "Coupe"].map((v) => ({ value: v, label: v })),
          ]}
        />
        <FilterSelect
          id="filter-fuel"
          value={fuel}
          onChange={setFuel}
          options={[{ value: "all", label: "Fuel" }, ...["Petrol", "Diesel", "CNG"].map((v) => ({ value: v, label: v }))]}
        />
        <FilterSelect
          id="filter-state"
          value={state}
          onChange={setState}
          options={[{ value: "all", label: "Any state" }, ...states.map((v) => ({ value: v, label: v }))]}
        />
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground" id="filter-reset">
            <XIcon /> Clear
          </Button>
        )}
        {q && (
          <span className="ml-auto text-sm text-muted-foreground">
            Results for <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
          </span>
        )}
      </div>

      {list.length ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a, i) => (
            <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <AuctionCard auction={a} priority={i < 3} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">No auctions match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try widening your search — new cars go live every day.</p>
          <Button variant="outline" className="mt-4" onClick={reset}>Reset filters</Button>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} size="sm" className={value !== "all" ? "border-primary/60 bg-accent text-accent-foreground" : ""}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
