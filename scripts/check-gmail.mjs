// Checks the Gmail SMTP login from .env.local without sending any email.
// Usage: node --env-file=.env.local scripts/check-gmail.mjs
import { lookup } from "node:dns/promises";
import { createTransport } from "nodemailer";

const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s/g, "");
const { address } = await lookup("smtp.gmail.com", { family: 4 });
const transport = createTransport({
  host: address,
  port: 465,
  secure: true,
  tls: { servername: "smtp.gmail.com" },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 30_000,
  auth: { user: process.env.GMAIL_USER, pass },
});

const started = Date.now();
try {
  await transport.verify();
  console.log(`Gmail login OK (${Date.now() - started} ms)`);
} catch (error) {
  console.log(`Gmail login failed: ${error.code ?? ""} ${error.message} (${Date.now() - started} ms)`);
  process.exitCode = 1;
}
transport.close();
