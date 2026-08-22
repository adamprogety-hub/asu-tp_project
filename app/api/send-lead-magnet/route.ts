import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email, checklist, checklist_label } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 });
    }

    const smtpHost     = process.env.SMTP_HOST     || 'smtp.yandex.ru';
    const smtpPort     = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser     = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpTo       = process.env.SMTP_TO || 'info@acengine.ru';

    const checklistName = checklist_label || checklist || '—';
    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    const emailText = `Новый лид с сайта acengine.ru — скачал чеклист

Email пользователя: ${email}
Чеклист:            ${checklistName}
Время:              ${now} (МСК)

Пользователь изучает материалы по диспетчеризации вентиляции.
Свяжитесь с ним, пока интерес свежий.

---
Письмо отправлено автоматически с формы скачивания acengine.ru.
`;

    // ── SMTP ─────────────────────────────────────────────────────────────
    if (smtpUser && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host:   smtpHost,
        port:   smtpPort,
        secure: smtpPort === 465,
        auth:   { user: smtpUser, pass: smtpPassword },
      });

      await transporter.sendMail({
        from:    `"acengine.ru" <${smtpUser}>`,
        to:      smtpTo,
        subject: `🔔 [acengine.ru] Лид скачал чеклист — ${email}`,
        text:    emailText,
      });
    } else {
      console.warn('[send-lead-magnet] SMTP not configured, skipping email.');
    }

    // ── Telegram ─────────────────────────────────────────────────────────
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId   = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      const msg =
        `🔔 <b>Лид с acengine.ru — скачал чеклист</b>\n\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Чеклист:</b> ${checklistName}\n` +
        `<b>Время:</b> ${now} (МСК)\n\n` +
        `Свяжитесь, пока интерес свежий.`;

      await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: tgChatId, text: msg, parse_mode: 'HTML' }),
      }).catch(err => console.error('[send-lead-magnet] Telegram error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[send-lead-magnet] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
