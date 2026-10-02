# Feature map

## Classification
**Appointment service (date-based event booking)** is the primary model, with **lead-gen** second for corporate clients and event stylists. There is no deposit (A1.9), so the main conversion is a **booking request** for a date, not a payment. Stripe isn't needed for the demo. Mode A is kept only as a stub in `lib/payments.ts` for a future deposit option.

## In the demo

| Feature | Why it matters for Pictopia |
|---|---|
| **Booking flow** (event → booth & layout → booth hours → details → review → confirmation) | Replaces the price-less Google Form and the back-and-forth on Messenger. Customers see the total before they commit |
| **Live price summary** built from real rates (A1.3, A1.4, A1.7) | Price is the first question every customer asks. Showing it beats competitors, who all say "PM for rates" |
| **Booth-hours planner** (signature) | Shows the 4-hour on-site window with 2 operating hours placed around the event program (A1.6). Makes the pause-time advantage visible and easy to use |
| Date picker with simulated availability | The second question is "are you free on my date?" Some sample dates are marked booked |
| Print-layout picker with drawn previews | Customers see the 1-, 2-, 3- and 4-shot prints. The previews are drawn as SVG, so we don't need guest photos |
| Confirmation with an "Add to calendar" (.ics) download and a Messenger/text prompt | Fits how Filipino customers actually confirm |
| Packages page | Inclusions (A1.2), price tiers and extras in one clear table |
| "Recent events" list (type + date + venue town, **no client names**) linking to their Facebook albums | Their only real proof (F21) |
| FAQ (pause time, travel fees, soft copies, no deposit, coverage) | Answers that currently cost them DMs |
| Contact: click-to-call 0916 565 7183, email, Messenger link, map of the two bases | Mobile-first contact |
| Sticky mobile "Check my date" bar | Primary action one tap away |
| Newsletter → "Get promo alerts" (demo, sends nothing) | Lead capture for future promos |
| Partner enquiry for caterers and event stylists | One of the brief's target customer groups |
| Demo banner, privacy and terms pages (templates) | Required |

## Proposed for the paid build
- Real availability calendar synced to the owners' Google Calendar, plus email/SMS notifications of new requests
- Messenger chat plugin; automatic Facebook album embed
- Google Business Profile setup and a review-request link, since they currently have 0 reviews
- Lightweight CMS so the owners can edit prices, events and FAQs
- Optional reservation fee via a PH payment gateway (GCash/Maya through PayMongo or Xendit), if they ever want one
- Analytics with conversion tracking on booking requests
