# Pictopia Photobooth — production website

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (database) · Gmail SMTP (notifications) · Vercel (hosting)

## How bookings work
1. A customer sends a booking request on `/book`. The server re-validates everything, recalculates the price, and saves the request to `bookings` with status `pending`.
2. Gmail sends:
   - **Pictopia**: a "New booking request" email with a tap-to-call button and all the details.
   - **The customer** (if they gave an email): a receipt with their summary and an `.ics` calendar file.
3. Several people can request the same date. The owners call them, and **whoever confirms first gets the date**. In Supabase → Table Editor → `bookings`, set `status` to `confirmed` (or `declined` / `cancelled`). Use `owner_notes` for travel fee and call notes.
4. When a date's `confirmed` bookings reach `settings.max_events_per_day` (default **2**), the calendar shows that date as fully booked. Pending requests never block a date.

Handy: the `upcoming_bookings` view lists future requests soonest-first.

## Database
Schema: `supabase/migrations/`. Every table has row-level security enabled with **no** public policies, and the website talks to Supabase only from the server with the secret key. Tables:

| Table | What |
|---|---|
| `bookings` | Booking requests and their status |
| `partner_enquiries` | Caterer/stylist/coordinator enquiries |
| `subscribers` | Promo alert sign-ups |
| `settings` | One row: `max_events_per_day` |

Apply migrations to a linked project:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Environment variables
Copy `.env.example` to `.env.local` and fill it in. Add the same values in Vercel → Project → Settings → Environment Variables.

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for metadata, the sitemap and JSON-LD |
| `NEXT_PUBLIC_AGENCY_NAME` | Footer credit, default "CK David" |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | **Server-only** secret key (`sb_secret_…`) or legacy `service_role` key |
| `GMAIL_USER` | Gmail address that sends the emails |
| `GMAIL_APP_PASSWORD` | 16-character Google App Password (needs 2-Step Verification on that account) |
| `NOTIFY_EMAIL` | Optional. Where notifications go (defaults to `GMAIL_USER`) |

## Run locally

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Spam and abuse protection
- Hidden honeypot field on every form. Bots that fill it get a fake success and nothing is stored.
- At most 5 booking requests per mobile number per 24 hours.
- Server-side validation (zod) of every field. Prices and references are generated on the server.
- The availability API only returns *which dates are full*, never booking details.

## API
| Route | Method | Purpose |
|---|---|---|
| `/api/bookings` | POST | Create a booking request, then email the owner and customer |
| `/api/availability?from=&to=` | GET | Full dates in a range (max 62 days) |
| `/api/enquiries` | POST | Partner enquiry, then email the owner |
| `/api/subscribe` | POST | Promo alert sign-up |
