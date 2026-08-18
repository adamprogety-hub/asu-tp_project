'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
import { getUserId } from '@/utils/userId';

/**
 * Measures Core Web Vitals (LCP, CLS, INP, FCP, TTFB) and sends them
 * to /api/track → Google Sheets for monitoring over time.
 *
 * Fires once per metric per page load (web-vitals lib guarantees this).
 * Buckets each value as 'good' | 'needs-improvement' | 'poor' for quick glance.
 */
function rating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP:  [2500, 4000],
    CLS:  [0.1,  0.25],
    INP:  [200,  500],
    FCP:  [1800, 3000],
    TTFB: [800,  1800],
  };
  const [good, poor] = thresholds[name] ?? [0, 0];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

async function sendVital(name: string, value: number, id: string) {
  const r = rating(name, value);
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    getUserId(),
        session_id: `cwv_${id}`,
        event:      `cwv_${name.toLowerCase()}`,
        page:       window.location.pathname,
        referrer:   document.referrer,
        payload: {
          value_ms: Math.round(value),    // значение в мс (или безразмерно для CLS)
          rating:   r,                    // good / needs-improvement / poor
          delta:    Math.round(value),    // delta = value для первого отчёта
        },
      }),
    });
  } catch {
    // silent — never block the page
  }
}

export function WebVitals() {
  useEffect(() => {
    onLCP (({ name, value, id }) => sendVital(name, value, id));
    onCLS (({ name, value, id }) => sendVital(name, value, id));
    onINP (({ name, value, id }) => sendVital(name, value, id));
    onFCP (({ name, value, id }) => sendVital(name, value, id));
    onTTFB(({ name, value, id }) => sendVital(name, value, id));
  }, []);

  return null;  // рендерит ничего — только измеряет
}
