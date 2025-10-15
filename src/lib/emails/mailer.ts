import nodemailer from "nodemailer";

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: MailOptions): Promise<boolean> {
  try {
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
      secure: port === 465, // true for port 465, false for others
      auth: {
        user,
        pass,
      },
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
