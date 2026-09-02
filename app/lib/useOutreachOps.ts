"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  applyMark,
  EMPTY_OPS_STATE,
  loadOpsState,
  saveOpsState,
  viewSlots,
  type OperatorMark,
  type OutreachAlert,
  type StoredOpsState,
} from "./outreachOps";
import { type OutreachSlot } from "./outreachSchedule";

const listeners = new Set<() => void>();
let memoryState: StoredOpsState = EMPTY_OPS_STATE;
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  memoryState = loadOpsState();
  hydrated = true;
}

function getSnapshot(): StoredOpsState {
  hydrate();
  return memoryState;
}

function getServerSnapshot(): StoredOpsState {
  return EMPTY_OPS_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: StoredOpsState) {
  memoryState = next;
  saveOpsState(next);
  emit();
}

function notifyBrowser(alert: OutreachAlert) {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification("Verdansc ops", {
      body: alert.message,
      tag: alert.slotId,
    });
  } catch {
    // Notification constructor can throw if the document is not active.
  }
}

export function useOutreachOps() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [now, setNow] = useState(() => new Date());
  const [toasts, setToasts] = useState<OutreachAlert[]>([]);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(tick);
  }, []);

  const slots = useMemo(() => viewSlots(stored.updates, now), [stored.updates, now]);

  const mark = useCallback((slot: OutreachSlot, status: OperatorMark) => {
    const result = applyMark(memoryState, slot, status, new Date());
    if (result.error) {
      return result;
    }
    commit(result.state);
    if (result.alert) {
      setToasts((current) => [result.alert!, ...current].slice(0, 5));
      if (result.alert.kind === "complete") {
        notifyBrowser(result.alert);
      }
    }
    return result;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const requestNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") return "unsupported" as const;
    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  return {
    now,
    slots,
    alerts: stored.alerts,
    toasts,
    mark,
    dismissToast,
    requestNotifications,
  };
}
