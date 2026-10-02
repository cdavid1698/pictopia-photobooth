import { enquirySchema } from "@/lib/schemas";
import { ownerEnquiryEmail } from "@/lib/server/emails";
import { fieldErrors, json, readJson } from "@/lib/server/http";
import { ownerInbox, sendMail } from "@/lib/server/mail";
import { db } from "@/lib/server/supabase";

export async function POST(request: Request) {
  const parsed = enquirySchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json({ error: "Some details need fixing.", fieldErrors: fieldErrors(parsed.error) }, 400);
  }
  const e = parsed.data;
  if (e.company) return json({ ok: true });

  try {
    const { data, error } = await db()
      .from("partner_enquiries")
      .insert({ business_name: e.business, business_type: e.kind, contact_name: e.contact, mobile: e.mobile, message: e.message })
      .select("id")
      .single();
    if (error) throw error;

    try {
      await sendMail({ ...ownerEnquiryEmail(e), to: ownerInbox() });
      await db().from("partner_enquiries").update({ owner_notified_at: new Date().toISOString() }).eq("id", data.id);
    } catch (mailError) {
      console.error("Enquiry email failed", data.id, mailError);
    }
    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Enquiry failed", error);
    return json({ error: "Something went wrong sending your enquiry. Please try again, or call us." }, 500);
  }
}
