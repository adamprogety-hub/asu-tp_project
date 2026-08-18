'use client';

import { useRef, useCallback } from 'react';
import { getUserId, makeSessionId } from '@/utils/userId';

export type TrackPayload = Record<string, string | number | boolean | null | undefined>;

// Cooldown per event type (ms) — prevents duplicate rows from rapid clicks
const COOLDOWNS: Record<string, number> = {
  click_phone:    5_000,   // телефон — 5 сек
  click_email:    5_000,   // email   — 5 сек
  click_telegram: 5_000,   // telegram — 5 сек
  lead_form_submit: 30_000, // форма — 30 сек
  default:        3_000,   // всё остальное — 3 сек
};

// Module-level Map so dedup survives re-renders (per page session)
const lastFired = new Map<string, number>();

export function useTrack() {
  // Session ID is created once per component mount (= page load)
  const sessionId = useRef<string | null>(null);

  if (typeof window !== 'undefined' && !sessionId.current) {
    sessionId.current = makeSessionId();
  }

  const track = useCallback(async (event: string, payload?: TrackPayload) => {
    // ── Deduplication ──────────────────────────────────────────────────────
    const cooldown = COOLDOWNS[event] ?? COOLDOWNS.default;
    const now = Date.now();
    const last = lastFired.get(event) ?? 0;

    if (now - last < cooldown) return;   // слишком рано — пропускаем
    lastFired.set(event, now);
    // ───────────────────────────────────────────────────────────────────────

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:    getUserId(),
          session_id: sessionId.current ?? 'unknown',
          event,
          page:       typeof window !== 'undefined' ? window.location.pathname : '/',
          referrer:   typeof document !== 'undefined' ? document.referrer : '',
          payload:    payload ?? {},
        }),
      });
    } catch {
      // Never block the UX if tracking fails
    }
  }, []);

  return { track };
}
