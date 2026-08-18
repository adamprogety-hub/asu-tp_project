/**
 * Generates and persists a unique user ID in localStorage.
 * Format: usr_<12 hex chars>  e.g. usr_a3f9c2b1e804
 * The ID survives page reloads and is stable across sessions on the same browser.
 */
export function getUserId(): string {
  if (typeof window === 'undefined') return 'ssr';

  const KEY = 'asutp_user_id';
  let id = localStorage.getItem(KEY);

  if (!id) {
    const raw = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    id = `usr_${raw}`;
    localStorage.setItem(KEY, id);
  }

  return id;
}

/**
 * Returns a new session ID each time the page is loaded.
 * Format: ses_<10 hex chars>  e.g. ses_4a8f2c1d09
 */
export function makeSessionId(): string {
  const raw = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  return `ses_${raw}`;
}
