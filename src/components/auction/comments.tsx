"use client";

import { useMemo, useState } from "react";
import { BadgeCheckIcon, GavelIcon, MessageCircleQuestionIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import type { Auction, Comment } from "@/lib/data";
import { formatAgo, formatINR } from "@/lib/format";
import { useNow } from "@/lib/clock";
import { YOU, useLiveAuction, type LiveBid } from "@/components/auction-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FeedItem =
  | { kind: "comment"; c: Comment; sortKey: number }
  | { kind: "bid"; b: LiveBid; sortKey: number };

export function CommentsSection({ auction }: { auction: Auction }) {
  const live = useLiveAuction(auction);
  const now = useNow();
  const [mine, setMine] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const minutesAgo = (b: LiveBid) => (b.at && now ? (now - b.at) / 60000 : b.minutesAgo);

  const comments = useMemo(() => [...mine, ...auction.comments], [mine, auction.comments]);

  const feed: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [
      ...comments.map((c) => ({ kind: "comment" as const, c, sortKey: c.minutesAgo })),
      ...live.bids.slice(0, 8).map((b) => ({ kind: "bid" as const, b, sortKey: b.minutesAgo })),
    ];
    return items.sort((x, y) => x.sortKey - y.sortKey);
  }, [comments, live.bids]);

  const post = () => {
    if (!text.trim()) return;
    setMine((m) => [{ id: `me-${Date.now()}`, user: "rayaan_k", text: text.trim(), minutesAgo: 0, likes: 0 }, ...m]);
    setText("");
    toast.success("Comment posted");
  };

  return (
    <section id="comments" className="scroll-mt-36 space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">Comments &amp; Bids</h2>
        <span className="text-sm text-muted-foreground">{comments.length} comments · {live.bids.length} bids</span>
      </div>

      <div className="rounded-xl border bg-card p-3">
        <Textarea
          id="comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask the seller a question or share your thoughts…"
          className="min-h-20 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Be respectful. Sellers answer questions publicly.</span>
          <Button size="sm" onClick={post} disabled={!text.trim()} id="post-comment">Post</Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Newest</TabsTrigger>
          <TabsTrigger value="qa">Seller Q&amp;A</TabsTrigger>
          <TabsTrigger value="bids">Bid history</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-1">
          {feed.map((item) =>
            item.kind === "comment" ? (
              <CommentRow key={item.c.id} c={item.c} seller={auction.seller.username} liked={!!liked[item.c.id]} onLike={() => setLiked((l) => ({ ...l, [item.c.id]: !l[item.c.id] }))} />
            ) : (
              <BidRow key={`${item.b.user}-${item.b.amount}`} b={item.b} ago={minutesAgo(item.b)} />
            ),
          )}
        </TabsContent>

        <TabsContent value="qa" className="mt-4 space-y-1">
          {comments.filter((c) => c.isQuestion || c.isSeller).map((c) => (
            <CommentRow key={c.id} c={c} seller={auction.seller.username} liked={!!liked[c.id]} onLike={() => setLiked((l) => ({ ...l, [c.id]: !l[c.id] }))} />
          ))}
          {!comments.some((c) => c.isQuestion || c.isSeller) && <Empty text="No seller Q&A yet — be the first to ask." />}
        </TabsContent>

        <TabsContent value="bids" className="mt-4 space-y-1">
          {live.bids.map((b, i) => (
            <BidRow key={`${b.user}-${b.amount}`} b={b} ago={minutesAgo(b)} top={i === 0} />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}

function initials(u: string) {
  return u.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase();
}

function CommentRow({ c, seller, liked, onLike }: { c: Comment; seller: string; liked: boolean; onLike: () => void }) {
  const isSeller = c.isSeller || c.user === seller;
  return (
    <div className="flex gap-3 rounded-lg p-3 animate-fade-up">
      <Avatar className="size-9">
        <AvatarFallback className={cn("text-xs font-semibold", isSeller && "bg-primary text-primary-foreground")}>{initials(c.user)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">@{c.user}</span>
          {isSeller && <Badge className="h-5 bg-primary/15 text-primary"><BadgeCheckIcon /> Seller</Badge>}
          {c.isQuestion && <Badge variant="outline" className="h-5"><MessageCircleQuestionIcon /> Question</Badge>}
          <span className="text-xs text-muted-foreground">{formatAgo(c.minutesAgo)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed">{c.text}</p>
        {c.reply && (
          <div className="mt-2 rounded-lg border-l-2 border-primary bg-accent/50 p-3 text-sm">
            <span className="flex items-center gap-1 font-semibold">@{c.reply.user} <Badge className="h-5 bg-primary/15 text-primary"><BadgeCheckIcon /> Seller</Badge></span>
            <p className="mt-1 leading-relaxed">{c.reply.text}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onLike}
          className={cn("mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground", liked && "text-primary")}
        >
          <ThumbsUpIcon className={cn("size-3.5", liked && "fill-primary")} /> {c.likes + (liked ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

function BidRow({ b, ago, top }: { b: LiveBid; ago: number; top?: boolean }) {
  const you = b.user === YOU;
  return (
    <div className={cn("flex items-center gap-3 rounded-lg p-3", b.at && "animate-bid-flash")}>
      <div className={cn("grid size-9 place-items-center rounded-full", you ? "bg-success text-success-foreground" : "bg-muted")}>
        <GavelIcon className="size-4" />
      </div>
      <div className="flex-1 text-sm">
        <span className="font-semibold">{you ? "You" : `@${b.user}`}</span>{" "}
        <span className="text-muted-foreground">bid</span>{" "}
        <span className="font-semibold tabular-nums">{formatINR(b.amount)}</span>
        {top && <Badge className="ml-2 h-5 bg-success/15 text-success">High bid</Badge>}
      </div>
      <span suppressHydrationWarning className="text-xs text-muted-foreground">{formatAgo(ago)}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</p>;
}
