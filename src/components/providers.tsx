"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuctionProvider } from "@/components/auction-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={200}>
        <AuctionProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </AuctionProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
