"use client";

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    posthog?: {
      capture?: (eventName: string, properties?: EventProps) => void;
    };
    gtag?: (command: "event", eventName: string, properties?: EventProps) => void;
  }
}

export function trackEvent(eventName: string, properties: EventProps = {}) {
  if (typeof window === "undefined") return;

  try {
    window.posthog?.capture?.(eventName, properties);
    window.gtag?.("event", eventName, properties);

    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", eventName, properties);
    }
  } catch {
    // no-op: analytics should never block UX
  }
}
