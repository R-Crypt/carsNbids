const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-IN");

/** ₹12,50,000 */
export function formatINR(value: number) {
  return inr.format(value);
}

/** ₹12.5 L / ₹1.25 Cr / ₹85K */
export function formatINRShort(value: number) {
  if (value >= 1_00_00_000) {
    return `₹${trim(value / 1_00_00_000)} Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${trim(value / 1_00_000)} L`;
  }
  if (value >= 1_000) {
    return `₹${trim(value / 1_000)}K`;
  }
  return `₹${value}`;
}

function trim(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

export function formatNumber(value: number) {
  return num.format(value);
}

export function formatKms(value: number) {
  return `${num.format(value)} km`;
}

/** Remaining-time label in the Cars & Bids style: "4 Days", "6:12:09", "0:42" */
export function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Ended";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  if (days >= 1) return `${days} ${days === 1 ? "Day" : "Days"}`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (v: number) => v.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function formatAgo(minutes: number) {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/** Bid increments tuned for INR price bands */
export function bidIncrement(current: number) {
  if (current < 5_00_000) return 5_000;
  if (current < 25_00_000) return 10_000;
  if (current < 1_00_00_000) return 25_000;
  return 50_000;
}

export const BUYER_FEE_RATE = 0.045;
export const BUYER_FEE_MIN = 10_000;
export const BUYER_FEE_MAX = 1_50_000;
export const GST_RATE = 0.18;

export function buyerFee(bid: number) {
  const fee = Math.min(BUYER_FEE_MAX, Math.max(BUYER_FEE_MIN, Math.round(bid * BUYER_FEE_RATE)));
  const gst = Math.round(fee * GST_RATE);
  return { fee, gst, total: fee + gst };
}
