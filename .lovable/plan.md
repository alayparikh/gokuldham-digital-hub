# Gokuldham Haveli — full site rebuild

A replica of gokuldham.org's structure and content, rebuilt so everything on it is editable by you and extended with donations, bhajan media and YouTube live.

## Pages

- **Home** — hero image slider with the Gujarati tagline, Daily Darshan Time weekly strip (Mangla, Mangla Aarti, Shringar, Rajbhog, MahaRaas, Sandhya/Shayan, Yamunaji Aarti), today's sponsors panel (tithi/Vikram Samvat/utsav + Mangal Bhog, Pan Ni Seva, Doodh Ni Seva, Rajbhog, Yamunaji Aarti manorathi), upcoming events, four donation/seva cards, blog teasers, About Gokuldham, testimonials, footer.
- **About Gokuldham** — history, philosophy, temple info.
- **Events** — list + individual event pages (e.g. the 2026 Utsav list), "Add to Calendar".
- **Donate** — tabbed Donation / Seva flow with categories (General Donation, Whole Day Seva + Sevaki, Haveli Building) matching the current URL structure.
- **Blog** — index and article pages (Gujarati + English content).
- **Live** — YouTube live embed, shows the current stream when on air, otherwise recent streams.
- **Bhajans** — video library (YouTube links or uploaded), audio bhajans with a player, filterable by category.
- **Gallery** — darshan/event photo albums.
- **Contact** — address, timings, map, contact form.

## Design

Match the existing look: warm cream/saffron palette, decorative flourishes, Gujarati + English typography, card-based sections. Photos and content are carried over from the current site.

## Admin panel (login-protected)

You get a dashboard to manage, with no code changes:

- Darshan timings per day and season
- Daily sponsors / manorath entries (with the Gujarati tithi fields)
- Events and utsav calendar
- Blog posts
- Bhajan videos and audio, gallery albums
- YouTube live stream link / channel
- Donation and seva categories and suggested amounts
- View donation records

Only invited admin accounts can log in; roles are stored in a separate table so access can't be self-granted.

## Donations

Built-in Stripe payments: one-time donations, recurring seva sponsorship, preset and custom amounts, donor name/email, optional dedication note, emailed receipt, and a record in your admin dashboard. A test mode is available first so you can try it without real money.

## What needs more than a static site (and why)

| Feature | Why it needs a backend |
|---|---|
| Donations | Secure payment processing, receipts, recurring billing |
| Admin panel | Login, roles, database |
| Sponsors / darshan timings / events | Stored data you edit, not hardcoded |
| Bhajan audio, photo uploads | File storage |
| Contact form | Sends and stores messages |
| Live embed | Only needs the channel/video ID stored, so it's editable |

## Technical notes

- TanStack Start routes per page; shared header/footer in the root layout; per-page SEO metadata.
- Lovable Cloud for database, auth, storage; RLS with public read on published content, admin-only writes, donations readable only by admins.
- Stripe via Lovable's built-in payments (no Stripe account setup needed to start); checkout in a server function, webhook under `/api/public/` records completed donations.
- Live stream renders a YouTube iframe from a stored video/channel ID.
- Content seeded from the current site so the replica is populated on first load.

## Build order

1. Design system + shared layout, static replica of all pages with real content.
2. Lovable Cloud: schema, admin auth, seeded content, admin dashboard.
3. Stripe donations + seva.
4. Media: live embed, bhajan library, gallery uploads.

## Needs from you later

- Admin email address for the first login
- Any content the current site doesn't expose (full event list, bhajan videos, contact details)
- Stripe onboarding/verification to accept real donations
