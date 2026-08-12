import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const objectType = (formData.get("objectType") as string) || "Не указан";
    const unitsCount = (formData.get("unitsCount") as string) || "Не указано";
    const description = (formData.get("description") as string) || "Отсутствует";

    // Extract attachments
    const files = formData.getAll("files") as File[];
    const attachments = [];

    for (const file of files) {
      if (file.size > 0) {
        const buffer = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(buffer),
        });
      }
    }

    const emailText = `Новая заявка с сайта acengine.ru

Имя: ${name}
Контакты (телефон или почта): ${contact}
Тип объекта: ${objectType}
Количество установок: ${unitsCount}

Коротко о задаче:
${description}

---
Письмо отправлено автоматически с формы обратной связи.
`;

    // 1. Send via NodeMailer SMTP using settings from .env.local
    const smtpHost = process.env.SMTP_HOST || "smtp.yandex.ru";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpTo = process.env.SMTP_TO || "PetroffSCADA@yandex.ru";

    if (smtpUser && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      await transporter.sendMail({
        from: `"acengine.ru Web Form" <${smtpUser}>`,
        to: smtpTo,
        subject: `[acengine.ru Lead] Заявка от ${name}`,
        text: emailText,
        attachments: attachments,
      });
    } else {
      console.warn("SMTP credentials not configured in .env.local. Skipping email notification.");
    }

    // 2. Send via Telegram Bot API (if configured)
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      const htmlMessage = `<b>Новая заявка с сайта acengine.ru</b>

<b>Имя:</b> ${name}
<b>Контакты:</b> ${contact}
<b>Тип объекта:</b> ${objectType}
<b>Количество установок:</b> ${unitsCount}

<b>Описание задачи:</b>
${description}`;

      try {
        await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: htmlMessage,
            parse_mode: "HTML",
          }),
        });
      } catch (err) {
        console.error("Failed to send Telegram message:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to process lead:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process lead" },
      { status: 500 }
    );
  }
}
