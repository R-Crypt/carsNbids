"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MenuIcon, MoonIcon, SearchIcon, SunIcon, BellIcon, HeartIcon, UserIcon, LogOutIcon, GavelIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Auctions" },
  { href: "/results", label: "Past Results" },
  { href: "/how-it-works", label: "How it Works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q ? `/?q=${encodeURIComponent(q)}#auctions` : "/#auctions");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-1 px-4">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                  {n.label}
                </Link>
              ))}
              <Link href="/sell" className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted">
                Sell a Car
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <form onSubmit={onSearch} className="relative hidden max-w-sm flex-1 md:block" role="search">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="header-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Thar, Gypsy, Evo, M3…"
            className="h-9 rounded-full bg-muted/60 pl-9"
            aria-label="Search auctions"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === n.href && "text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
          <Button asChild className="hidden rounded-full sm:inline-flex" id="header-sell-cta">
            <Link href="/sell">Sell a Car</Link>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu" id="account-menu">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">RK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-semibold">Rayaan K.</div>
          <div className="text-xs font-normal text-muted-foreground">KYC verified · Bengaluru</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><GavelIcon /> My bids</DropdownMenuItem>
        <DropdownMenuItem><HeartIcon /> Watchlist</DropdownMenuItem>
        <DropdownMenuItem><BellIcon /> Notifications</DropdownMenuItem>
        <DropdownMenuItem><UserIcon /> Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><LogOutIcon /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
