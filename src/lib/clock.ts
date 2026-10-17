"use client";

import { useSyncExternalStore } from "react";

/**
 * A single shared 1s ticker. Returns `null` during SSR / hydration so
 * time-dependent UI (countdowns) never causes hydration mismatches.
 */
let now = 0;
let anchor = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = Date.now();
    if (!anchor) anchor = now;
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
    queueMicrotask(() => listeners.forEach((l) => l()));
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => (now === 0 ? null : now),
    () => null,
  );
}

/** Time at which the demo "session" started; mock auction end times are relative to it. */
export function getAnchor() {
  if (!anchor) anchor = Date.now();
  return anchor;
}
