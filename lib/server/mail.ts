import "server-only";
import { lookup } from "node:dns/promises";
import { createTransport, type Transporter } from "nodemailer";
import { requireEnv } from "@/lib/server/env";

const SMTP_HOST = "smtp.gmail.com";

let transporter: Promise<Transporter> | null = null;

async function createGmailTransport(): Promise<Transporter> {
  // Resolve with the operating system's resolver (fast and reliable everywhere) instead of
  // nodemailer's own DNS queries, which can stall for minutes on some networks.
  const { address } = await lookup(SMTP_HOST, { family: 4 });
  return createTransport({
    host: address,
    port: 465,
    secure: true,
    tls: { servername: SMTP_HOST },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
    // App Passwords are shown with spaces ("abcd efgh ..."); Gmail wants them without.
    auth: { user: requireEnv("GMAIL_USER"), pass: requireEnv("GMAIL_APP_PASSWORD").replace(/\s/g, "") },
  });
}

function transport(): Promise<Transporter> {
  transporter ??= createGmailTransport().catch((error: unknown) => {
    transporter = null;
    throw error;
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
  await (await transport()).sendMail({
    from: { name: "Pictopia Photobooth", address: requireEnv("GMAIL_USER") },
    ...mail,
  });
}
