"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagesIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);
  const show = (i: number) => {
    setStart(i);
    setOpen(true);
  };
  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className={cn("grid gap-2", thumbs.length ? "md:grid-cols-[2fr_1fr]" : "")}>
        <button
          type="button"
          onClick={() => show(0)}
          className="group relative aspect-[3/2] overflow-hidden rounded-xl bg-muted md:rounded-r-none"
          id="gallery-main"
        >
          <Image src={images[0]} alt={title} fill priority fetchPriority="high" sizes="(min-width: 768px) 66vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        </button>
        {thumbs.length > 0 && (
          <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
            {Array.from({ length: 4 }).map((_, idx) => {
              const src = thumbs[idx] ?? images[idx % images.length];
              const i = thumbs[idx] ? idx + 1 : idx % images.length;
              const last = idx === 3;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => show(i)}
                  className={cn(
                    "group relative overflow-hidden bg-muted",
                    idx === 1 && "rounded-tr-xl",
                    idx === 3 && "rounded-br-xl",
                  )}
                >
                  <Image src={src} alt="" fill sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  {last && (
                    <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-semibold text-white transition-colors group-hover:bg-black/60">
                      <span className="flex items-center gap-2"><ImagesIcon className="size-4" /> All photos ({images.length})</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(1100px,95vw)] border-0 bg-black p-0 sm:max-w-[min(1100px,95vw)]" showCloseButton>
          <DialogTitle className="sr-only">{title} photos</DialogTitle>
          <Carousel opts={{ startIndex: start, loop: true }} className="w-full">
            <CarouselContent className="ml-0">
              {images.map((src, i) => (
                <CarouselItem key={src + i} className="pl-0">
                  <div className="relative aspect-[3/2] w-full">
                    <Image src={src} alt={`${title} photo ${i + 1}`} fill sizes="95vw" className="object-contain" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
