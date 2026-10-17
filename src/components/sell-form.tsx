"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, CameraIcon, CheckIcon, PartyPopperIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const steps = ["Car", "Registration", "Listing", "Contact"] as const;
const indianStates = [
  "Andhra Pradesh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export function SellForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reserve, setReserve] = useState(true);

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  };

  if (done) {
    return (
      <Card className="items-center p-10 text-center animate-fade-up">
        <div className="grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <PartyPopperIcon className="size-8" />
        </div>
        <h2 className="text-3xl font-bold">Submission received!</h2>
        <p className="max-w-sm text-muted-foreground">
          Our team will review your car and WhatsApp you within 24 hours to schedule an inspection.
        </p>
        <Button asChild className="mt-2 rounded-full"><Link href="/">Browse live auctions</Link></Button>
      </Card>
    );
  }

  return (
    <Card className="gap-0 p-0">
      <div className="space-y-4 border-b p-6">
        <ol className="flex justify-between text-xs font-medium">
          {steps.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-2", i <= step ? "text-foreground" : "text-muted-foreground")}>
              <span className={cn("grid size-6 place-items-center rounded-full border text-[11px]", i < step && "border-primary bg-primary text-primary-foreground", i === step && "border-primary text-primary")}>
                {i < step ? <CheckIcon className="size-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </li>
          ))}
        </ol>
        <Progress value={((step + 1) / steps.length) * 100} className="h-1.5" />
      </div>

      <form onSubmit={next} key={step}>
        <CardContent className="grid gap-5 p-6 animate-fade-up">
          {step === 0 && (
            <>
              <h2 className="text-2xl font-bold">Tell us about the car</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Year" id="year"><Input id="year" inputMode="numeric" placeholder="2008" required /></Field>
                <Field label="Make" id="make" className="sm:col-span-2"><Input id="make" placeholder="Mitsubishi" required /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Model & variant" id="model"><Input id="model" placeholder="Lancer Evolution X GSR" required /></Field>
                <Field label="Kms driven" id="kms"><Input id="kms" inputMode="numeric" placeholder="48,200" required /></Field>
              </div>
              <Field label="Fuel" id="fuel">
                <ToggleGroup type="single" defaultValue="Petrol" variant="outline" className="w-full">
                  {["Petrol", "Diesel", "CNG", "Electric"].map((f) => <ToggleGroupItem key={f} value={f} className="flex-1">{f}</ToggleGroupItem>)}
                </ToggleGroup>
              </Field>
              <Field label="Transmission" id="trans">
                <ToggleGroup type="single" defaultValue="Manual" variant="outline" className="w-full">
                  {["Manual", "Automatic"].map((f) => <ToggleGroupItem key={f} value={f} className="flex-1">{f}</ToggleGroupItem>)}
                </ToggleGroup>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold">Registration &amp; paperwork</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Registered state" id="state">
                  <Select defaultValue="Karnataka">
                    <SelectTrigger id="state" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>{indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Registration number" id="reg"><Input id="reg" placeholder="KA 03 MK 7777" className="uppercase" required /></Field>
              </div>
              <Field label="Number of owners (including you)" id="owners">
                <ToggleGroup type="single" defaultValue="1" variant="outline" className="w-full">
                  {["1", "2", "3", "4+"].map((f) => <ToggleGroupItem key={f} value={f} className="flex-1">{f}</ToggleGroupItem>)}
                </ToggleGroup>
              </Field>
              <Field label="Is there an active car loan (hypothecation)?" id="hyp">
                <RadioGroup defaultValue="no" className="grid grid-cols-2 gap-3">
                  {[["no", "No, RC is clear"], ["yes", "Yes, loan pending"]].map(([v, l]) => (
                    <Label key={v} htmlFor={`hyp-${v}`} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent">
                      <RadioGroupItem value={v} id={`hyp-${v}`} /> {l}
                    </Label>
                  ))}
                </RadioGroup>
              </Field>
              <Field label="Insurance" id="ins">
                <Select defaultValue="comp">
                  <SelectTrigger id="ins" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zero">Zero-depreciation</SelectItem>
                    <SelectItem value="comp">Comprehensive</SelectItem>
                    <SelectItem value="tp">Third-party only</SelectItem>
                    <SelectItem value="none">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold">Listing preferences</h2>
              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div>
                  <Label htmlFor="reserve-switch" className="text-base">Set a reserve price</Label>
                  <p className="text-sm text-muted-foreground">No-reserve auctions get ~40% more bids on average.</p>
                </div>
                <Switch id="reserve-switch" checked={reserve} onCheckedChange={setReserve} />
              </div>
              {reserve && (
                <Field label="Reserve price" id="reserve">
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input id="reserve" inputMode="numeric" placeholder="25,00,000" className="pl-7" />
                  </div>
                </Field>
              )}
              <Field label="Anything special about the car?" id="desc">
                <Textarea id="desc" rows={4} placeholder="Service history, modifications, known issues, why you're selling…" />
              </Field>
              <div className="grid place-items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-accent/40">
                <CameraIcon className="size-7" />
                <p><span className="font-medium text-foreground">Add a few photos</span> — phone pics are fine.</p>
                <p className="text-xs">We&apos;ll do a professional shoot if accepted.</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold">How do we reach you?</h2>
              <Field label="Full name" id="name"><Input id="name" autoComplete="name" required /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mobile (WhatsApp)" id="phone">
                  <div className="flex">
                    <span className="grid place-items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">+91</span>
                    <Input id="phone" type="tel" autoComplete="tel-national" inputMode="numeric" placeholder="98765 43210" className="rounded-l-none" required />
                  </div>
                </Field>
                <Field label="City" id="city"><Input id="city" autoComplete="address-level2" placeholder="Bengaluru" required /></Field>
              </div>
              <Field label="Email" id="email"><Input id="email" type="email" autoComplete="email" required /></Field>
            </>
          )}
        </CardContent>

        <div className="flex justify-between border-t p-6">
          <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeftIcon /> Back
          </Button>
          <Button type="submit" id="sell-next" className="rounded-full px-6">
            {step === steps.length - 1 ? "Submit car" : "Continue"} <ArrowRightIcon />
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({ label, id, children, className }: { label: string; id: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
