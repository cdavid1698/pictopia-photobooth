import "server-only";
import { business } from "@/content/business";
import { buildICS, priceLines, type BookingRequest } from "@/lib/booking";
import { describeBooking } from "@/lib/describe";
import { formatPeso } from "@/lib/format";
import type { EnquiryInput } from "@/lib/schemas";
import type { Mail } from "@/lib/server/mail";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#fff1bf;font-family:Arial,Helvetica,sans-serif;color:#2e1b0e">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="background:#ffffff;border:2px solid #2e1b0e;border-radius:16px;padding:24px">
<h1 style="font-size:22px;margin:0 0 16px">${esc(title)}</h1>
${body}
</div>
<p style="font-size:12px;color:#5a4232;margin:16px 4px">Pictopia Photobooth · Pura, Tarlac &amp; Magalang, Pampanga · ${esc(business.phoneDisplay.value)}</p>
</div></body></html>`;
}

function rows(pairs: [string, string][]) {
  return `<table style="width:100%;border-collapse:collapse;font-size:15px">${pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
}

const textRows = (pairs: [string, string][]) => pairs.map(([k, v]) => `${k}: ${v}`).join("\n");

function bookingPairs(b: BookingRequest): [string, string][] {
  const info = describeBooking(b);
  const lines = priceLines(b).map((l) => `${l.label}: ${formatPeso(l.amount)}`);
  return [
    ["Reference", b.reference],
    ["Event", info.event],
    ["Date", info.date],
    ["Venue", info.where],
    ["Booth hours", info.sessions.join("\n")],
    ["Print", info.print],
    ["Display", info.display],
    ["Backdrop", info.backdrop],
    ["Price", `${lines.join("\n")}\nTotal: ${formatPeso(b.total)} + travel fee`],
  ];
}

export function ownerBookingEmail(b: BookingRequest): Mail {
  const tel = b.mobile.startsWith("0") ? `+63${b.mobile.slice(1)}` : b.mobile;
  const contact: [string, string][] = [
    ["Name", b.name],
    ["Mobile", b.mobile],
    ...(b.email ? ([["Email", b.email]] as [string, string][]) : []),
    ...(b.facebook ? ([["Facebook", b.facebook]] as [string, string][]) : []),
    ...(b.notes ? ([["Notes", b.notes]] as [string, string][]) : []),
  ];
  const info = describeBooking(b);
  const subject = `New booking request: ${info.event}, ${info.date} (${b.reference})`;
  const html = layout(
    "New booking request",
    `<p style="margin:0 0 16px">Call to confirm. First customer to confirm gets the slot.</p>
<p style="margin:0 0 20px"><a href="tel:${esc(tel)}" style="display:inline-block;background:#ffc72c;color:#2e1b0e;border:2px solid #2e1b0e;border-radius:10px;padding:10px 18px;font-weight:bold;text-decoration:none">Call ${esc(b.name)} · ${esc(b.mobile)}</a></p>
${rows(contact)}<hr style="border:0;border-top:1px solid #e9dcc2;margin:16px 0">${rows(bookingPairs(b))}
<p style="font-size:13px;color:#5a4232;margin-top:20px">After calling, set the status to <b>confirmed</b> or <b>declined</b> in Supabase → bookings.</p>`,
  );
  const text = `New booking request — call to confirm.\n\n${textRows(contact)}\n\n${textRows(bookingPairs(b))}`;
  return { to: "", subject, html, text, replyTo: b.email ?? undefined };
}

export function customerReceiptEmail(b: BookingRequest): Mail {
  const info = describeBooking(b);
  const first = b.name.split(" ")[0];
  const html = layout(
    `Thanks, ${first}! We got your booking request`,
    `<p style="margin:0 0 16px">We've received your request for <b>${esc(info.date)}</b>. We'll text or call <b>${esc(b.mobile)}</b> ${esc(business.replyTime.value)} to confirm your date and travel fee.</p>
<p style="margin:0 0 20px;padding:12px;background:#fff1bf;border-radius:10px">Your date isn't reserved until we confirm it with you by phone. No deposit is needed.</p>
${rows(bookingPairs(b))}
<p style="margin-top:20px">Questions? Call or text <a href="tel:${esc(business.phoneE164.value)}" style="color:#b4500a">${esc(business.phoneDisplay.value)}</a> or message us on <a href="${esc(business.facebookUrl.value)}" style="color:#b4500a">Facebook</a>.</p>`,
  );
  const text = `Thanks, ${first}! We got your booking request for ${info.date}. We'll text or call ${b.mobile} ${business.replyTime.value} to confirm your date and travel fee. Your date isn't reserved until we confirm it with you.\n\n${textRows(bookingPairs(b))}\n\nQuestions? Call or text ${business.phoneDisplay.value}.`;
  return {
    to: b.email!,
    subject: `We got your booking request (${b.reference})`,
    html,
    text,
    replyTo: process.env.NOTIFY_EMAIL || undefined,
    attachments: [{ filename: `pictopia-${b.reference}.ics`, content: buildICS(b), contentType: "text/calendar" }],
  };
}

export function ownerEnquiryEmail(e: EnquiryInput): Mail {
  const pairs: [string, string][] = [
    ["Business", e.business],
    ["Type", e.kind],
    ["Contact", e.contact],
    ["Mobile", e.mobile],
    ...(e.message ? ([["Message", e.message]] as [string, string][]) : []),
  ];
  return {
    to: "",
    subject: `New partner enquiry: ${e.business} (${e.kind})`,
    html: layout("New partner enquiry", rows(pairs)),
    text: `New partner enquiry\n\n${textRows(pairs)}`,
  };
}
