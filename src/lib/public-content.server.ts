import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export async function fetchSettings() {
  const sb = publicClient();
  const { data } = await sb.from("site_settings").select("key, value");
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value ?? "";
  return map;
}

export async function fetchHomeData() {
  const sb = publicClient();
  const today = new Date().toISOString().slice(0, 10);
  const [settings, slides, times, day, events, posts, categories] = await Promise.all([
    fetchSettings(),
    sb.from("hero_slides").select("*").order("sort_order"),
    sb.from("darshan_times").select("*").order("sort_order"),
    sb.from("sponsor_days").select("*").eq("date", today).maybeSingle(),
    sb.from("events").select("*").order("starts_at", { ascending: true }).limit(3),
    sb.from("blog_posts").select("*").order("published_at", { ascending: false }).limit(3),
    sb.from("donation_categories").select("*").order("sort_order"),
  ]);

  let sponsors: { category: string; sponsor_name: string }[] = [];
  if (day.data) {
    const { data } = await sb
      .from("sponsor_entries")
      .select("category, sponsor_name")
      .eq("day_id", day.data.id)
      .order("sort_order");
    sponsors = data ?? [];
  }

  return {
    settings,
    slides: slides.data ?? [],
    times: times.data ?? [],
    sponsorDay: day.data,
    sponsors,
    events: events.data ?? [],
    posts: posts.data ?? [],
    categories: categories.data ?? [],
  };
}

export async function fetchEvents() {
  const sb = publicClient();
  const { data } = await sb.from("events").select("*").order("starts_at", { ascending: true });
  return data ?? [];
}

export async function fetchEvent(slug: string) {
  const sb = publicClient();
  const { data } = await sb.from("events").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function fetchPosts() {
  const sb = publicClient();
  const { data } = await sb
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function fetchPost(slug: string) {
  const sb = publicClient();
  const { data } = await sb.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function fetchDonateData() {
  const sb = publicClient();
  const [categories, settings] = await Promise.all([
    sb.from("donation_categories").select("*").order("sort_order"),
    fetchSettings(),
  ]);
  return { categories: categories.data ?? [], settings };
}

export async function fetchMedia() {
  const sb = publicClient();
  const [media, settings] = await Promise.all([
    sb.from("media_items").select("*").order("sort_order"),
    fetchSettings(),
  ]);
  return { media: media.data ?? [], settings };
}

export async function fetchGallery() {
  const sb = publicClient();
  const { data: albums } = await sb
    .from("gallery_albums")
    .select("*")
    .order("event_date", { ascending: false });
  const { data: photos } = await sb.from("gallery_photos").select("*").order("sort_order");
  return { albums: albums ?? [], photos: photos ?? [] };
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const sb = publicClient();
  const { error } = await sb.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject ?? null,
    message: input.message,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}
