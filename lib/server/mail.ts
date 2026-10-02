import "server-only";
import { createTransport, type Transporter } from "nodemailer";
import { requireEnv } from "@/lib/server/env";

let transporter: Transporter | null = null;

function transport(): Transporter {
  transporter ??= createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // App Passwords are shown with spaces ("abcd efgh ..."); Gmail wants them without.
    auth: { user: requireEnv("GMAIL_USER"), pass: requireEnv("GMAIL_APP_PASSWORD").replace(/\s/g, "") },
  });
  return transporter;
}

/** Where owner notifications go. Defaults to the sending Gmail account. */
export function ownerInbox(): string {
  return process.env.NOTIFY_EMAIL || requireEnv("GMAIL_USER");
}

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; contentType: string }[];
};

export async function sendMail(mail: Mail): Promise<void> {
  await transport().sendMail({
    from: { name: "Pictopia Photobooth", address: requireEnv("GMAIL_USER") },
    ...mail,
  });
}
