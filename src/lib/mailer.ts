export type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: MailOptions): Promise<boolean> {
  try {
    // Dynamically import nodemailer if available; otherwise no-op
    const nodemailer = await import("nodemailer").catch(() => null as any);
    if (!nodemailer) {
      console.warn("Mailer: nodemailer not installed. Logging email to console.");
      console.info(`[MAIL] To: ${options.to} | Subject: ${options.subject}`);
      return false;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || "no-reply@example.com";

    if (!host || !user || !pass) {
      console.warn("Mailer: SMTP env vars missing. Logging email to console.");
      console.info(`[MAIL] To: ${options.to} | Subject: ${options.subject}`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (err) {
    console.error("Mailer error:", err);
    return false;
  }
}

