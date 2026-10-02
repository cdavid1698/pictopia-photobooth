// Request schemas shared by the API routes. The server never trusts the browser:
// prices, references and dates are re-checked here.

import { z } from "zod";
import { eventTypes } from "@/content/events";
import { backdrops, boothHours, displays, tiers } from "@/content/packages";
import { PH_MOBILE } from "@/lib/booking";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const mobile = z
  .string()
  .transform((s) => s.replace(/[\s-]/g, ""))
  .refine((s) => PH_MOBILE.test(s), "Use a PH mobile number, like 0917 123 4567.");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((s) => (s ? s : null));

const segment = z.object({
  kind: z.enum(["on", "pause"]),
  hours: z.number().multipleOf(0.5).min(0).max(5),
  label: z.string().trim().max(40),
});

const ids = <T extends { id: string }>(list: readonly T[]) => list.map((x) => x.id) as [T["id"], ...T["id"][]];

export const bookingSchema = z
  .object({
    eventType: z.enum(ids(eventTypes)),
    date: z.string().regex(ISO_DATE),
    startTime: z.number().int().min(7 * 60).max(20 * 60).multipleOf(30),
    venue: optionalText(120),
    town: z.string().trim().min(1, "Enter the town or city of your venue.").max(80),
    province: z.enum(["Tarlac", "Pampanga", "Other"]),
    tier: z.enum(ids(tiers)),
    format: z.enum(["4x6-portrait", "4x6-landscape", "polaroid", "strip"]),
    display: z.enum(ids(displays)),
    backdropColor: z.enum(ids(backdrops.colors)),
    backdropFinish: z.enum(ids(backdrops.finishes)),
    plan: z.tuple([segment, segment, segment]),
    extraHours: z.number().int().min(0).max(boothHours.maxExtraHours),
    name: z.string().trim().min(1, "Enter your name.").max(80),
    mobile,
    email: z.union([z.literal(""), z.email().max(120)]).optional().transform((s) => (s ? s : null)),
    facebook: optionalText(80),
    notes: optionalText(1000),
    // Honeypot: real visitors never see or fill this field.
    company: z.string().max(200).optional(),
  })
  .superRefine((b, ctx) => {
    const tier = tiers.find((t) => t.id === b.tier)!;
    if (!tier.formats.includes(b.format)) {
      ctx.addIssue({ code: "custom", path: ["format"], message: "That print style isn't available for this package." });
    }
    const [first, pause, second] = b.plan;
    const operating = boothHours.operatingHours + b.extraHours;
    const planOk =
      first.kind === "on" &&
      pause.kind === "pause" &&
      second.kind === "on" &&
      first.hours >= 0.5 &&
      second.hours >= 0.5 &&
      pause.hours >= boothHours.pauseMin &&
      pause.hours <= boothHours.pauseMax &&
      first.hours + second.hours === operating;
    if (!planOk) ctx.addIssue({ code: "custom", path: ["plan"], message: "Booth hours don't add up. Please re-check them." });
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const enquirySchema = z.object({
  business: z.string().trim().min(1, "Enter your business name.").max(120),
  kind: z.enum(["Catering", "Event styling", "Event coordination", "Venue", "Other"]),
  contact: z.string().trim().min(1, "Enter your name.").max(80),
  mobile,
  message: optionalText(1500),
  company: z.string().max(200).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const subscribeSchema = z.object({
  email: z.email("Enter an email like name@gmail.com.").max(120),
  company: z.string().max(200).optional(),
});

export const availabilityQuery = z.object({
  from: z.string().regex(ISO_DATE),
  to: z.string().regex(ISO_DATE),
});
