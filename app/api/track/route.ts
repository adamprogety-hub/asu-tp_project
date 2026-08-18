import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GOOGLE_SHEETS_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.event || !body.user_id) {
      return NextResponse.json({ error: 'Missing event or user_id' }, { status: 400 });
    }

    // CWV events are not needed in the business sheet — silently drop them
    if (typeof body.event === 'string' && body.event.startsWith('cwv_')) {
      return NextResponse.json({ ok: true });
    }

    // Forward to Google Apps Script
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    body.user_id,
        session_id: body.session_id ?? '',
        event:      body.event,
        timestamp:  new Date().toISOString(),
        page:       body.page ?? '/',
        referrer:   body.referrer ?? '',
        payload:    body.payload ?? {},
      }),
    });

    if (!res.ok) {
      console.error('[track] GAS error:', res.status, await res.text());
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
