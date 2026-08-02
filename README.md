# Gokuldham Digital Hub

A rebuild of [gokuldham.org](https://gokuldham.org/) with the content moved into a database
and an admin UI on top of it — darshan timings, daily sponsors, the utsav calendar, blog
posts, a bhajan library, YouTube live embeds, a photo gallery, and donation/seva pages.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, SSR, file-based routing, server functions)
- Vite 8 + Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres, Auth, RLS)
- Nitro, building to the Vercel Build Output API

## Development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env   # fill in your Supabase project values
npm run dev            # http://localhost:8080
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server on port 8080                                    |
| `npm run build`     | Production build into `.vercel/output`                     |
| `npm run preview`   | Serves the production build locally on port 3000           |
| `npm run typecheck` | `tsc --noEmit`                                             |
| `npm run lint`      | ESLint + Prettier check                                    |
| `npm run format`    | Prettier write                                             |

## Environment variables

`VITE_*` values are inlined into the browser bundle at build time; the unprefixed
copies are read by SSR and server functions at runtime. Both sets are required.

| Variable                        | Used by            |
| ------------------------------- | ------------------ |
| `VITE_SUPABASE_URL`             | browser            |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser            |
| `VITE_SUPABASE_PROJECT_ID`      | browser            |
| `SUPABASE_URL`                  | SSR / server fns   |
| `SUPABASE_PUBLISHABLE_KEY`      | SSR / server fns   |
| `SUPABASE_PROJECT_ID`           | SSR / server fns   |
| `SUPABASE_SERVICE_ROLE_KEY`     | optional, server only — bypasses RLS; nothing uses it today |

The publishable key is safe to expose to the browser. The service role key is not:
set it only as a Vercel environment variable, never in a `VITE_*` variable.

## Deploying to Vercel

1. Import the repository in Vercel. `vercel.json` pins the install and build commands,
   and the build emits `.vercel/output` (Build Output API v3), so no framework preset
   or output directory needs to be selected.
2. Add every variable from the table above under **Settings → Environment Variables**
   for Production, Preview, and Development.
3. Deploy. The catch-all route is served by a Node.js serverless function; everything
   under `/assets` is served as immutable static content.

To build for a different target, set `NITRO_PRESET` (for example `NITRO_PRESET=node-server npm run build`).

## Supabase setup

- `supabase/migrations/` holds the schema: content tables, the `user_roles` table, and
  the `has_role()` function used to gate the admin UI.
- Admin access requires a row in `user_roles` with `role = 'admin'` for your user id.
  Sign up at `/auth` first, then insert the row.
- "Continue with Google" on `/auth` requires the Google provider to be enabled under
  **Authentication → Providers** in the Supabase dashboard, with the deployed site URL
  added to the allowed redirect URLs.

## Admin

`/admin` is a client-only, auth-gated CRUD surface over the content tables (site
settings, hero slides, darshan times, sponsors, events, blog posts, media, gallery,
donation categories, and inbound contact messages). Writes go through server functions
that re-check the caller's admin role against Supabase, so RLS remains the source of truth.
