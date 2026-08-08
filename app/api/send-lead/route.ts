import { NextResponse } from "next/server";
import { WorkerMailer } from "worker-mailer";

export const runtime = "edge";

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
          content: new Uint8Array(buffer),
          type: file.type || "application/octet-stream",
          disposition: "attachment",
        });
      }
    }

    // SMTP Config from environment variables
    const host = process.env.SMTP_HOST || "smtp.yandex.ru";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.SMTP_USER || "PetroffSCADA@yandex.ru";
    const pass = process.env.SMTP_PASSWORD || "hdrqvfqhapkomjmh";
    const to = process.env.SMTP_TO || "PetroffSCADA@yandex.ru";

    // Connect to SMTP Server
    const mailer = await WorkerMailer.connect({
      credentials: {
        username: user,
        password: pass,
      },
      host,
      port,
      secure: port === 465,
    });

    // Format email body
    const emailText = `Новая заявка с сайта AERON

Имя: ${name}
Контакты (телефон или почта): ${contact}
Тип объекта: ${objectType}
Количество установок: ${unitsCount}

Коротко о задаче:
${description}

---
Письмо отправлено автоматически с формы обратной связи.
`;

    // Send email
    await mailer.send({
      from: { name: "AERON Web Form", email: user },
      to: { name: "Petroff SCADA", email: to },
      subject: `[AERON Lead] Заявка от ${name}`,
      text: emailText,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
