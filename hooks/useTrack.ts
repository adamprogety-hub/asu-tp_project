'use client';

import { useRef, useCallback } from 'react';
import { getUserId, makeSessionId } from '@/utils/userId';

export type TrackPayload = Record<string, string | number | boolean | null | undefined>;

export function useTrack() {
  // Session ID is created once per component mount (= page load)
  const sessionId = useRef<string | null>(null);

  if (typeof window !== 'undefined' && !sessionId.current) {
    sessionId.current = makeSessionId();
  }

  const track = useCallback(async (event: string, payload?: TrackPayload) => {
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
