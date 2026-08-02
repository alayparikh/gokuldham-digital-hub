import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Crown,
  HandHeart,
  UtensilsCrossed,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { homeQuery } from "@/lib/queries";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gokuldham Haveli Atlanta — Daily Darshan, Utsav & Seva" },
      {
        name: "description",
        content:
          "Daily darshan timings, today's sponsors, upcoming utsavs, bhajans and seva opportunities at Gokuldham Haveli in Atlanta, Georgia.",
      },
      { property: "og:title", content: "Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content:
          "Daily darshan timings, utsav calendar, live darshan and seva at Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Index,
});

const ICONS: Record<string, typeof Sun> = {
  sun: Sun,
  moon: Moon,
  crown: Crown,
  pray: HandHeart,
  food: UtensilsCrossed,
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Index() {
  const { data } = useSuspenseQuery(homeQuery);
  const [slide, setSlide] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  useEffect(() => {
    if (data.slides.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % data.slides.length), 5000);
    return () => clearInterval(id);
  }, [data.slides.length]);

  const times = data.times.filter((t) => (t.days ?? []).includes(selectedDay));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  const sponsorGroups = data.sponsors.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s.sponsor_name);
    return acc;
  }, {});

  return (
    <>
      {/* Hero + darshan */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 lg:py-14">
        <div className="self-start">
          <div className="temple-card relative overflow-hidden">
            {data.slides.map((s, i) => (
              <img
                key={s.id}
                src={s.image_url}
                alt={s.caption ?? "Darshan at Gokuldham Haveli"}
                loading={i === 0 ? "eager" : "lazy"}
                className={`h-[420px] w-full object-cover transition-opacity duration-700 sm:h-[520px] ${
                  i === slide ? "opacity-100" : "absolute inset-0 opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/85 to-transparent p-6 pt-20 text-center">
              <h1 className="gu text-xl text-maroon-foreground sm:text-2xl">
                {data.settings["tagline_gu"]}
              </h1>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {data.slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? "w-7 bg-primary" : "w-2 bg-gold"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-center">
            <h2 className="text-3xl text-maroon sm:text-4xl">Daily Darshan Time</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {data.settings["location_label"]}
            </p>
          </div>

          <div className="temple-card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-accent/60 px-4 py-3">
              <span className="font-display text-lg text-maroon">
                {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 border-b border-border px-2 py-3">
              {week.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className="flex flex-col items-center gap-1 rounded-lg py-1 text-xs"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                      i === selectedDay
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <span className="text-muted-foreground">{DAY_LABELS[i]}</span>
                </button>
              ))}
            </div>
            <ul className="divide-y divide-border">
              {times.map((t) => {
                const Icon = ICONS[t.icon] ?? Sun;
                return (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">{t.time_text} —</span>
                    <span className="text-sm font-semibold text-foreground">{t.label}</span>
                  </li>
                );
              })}
              {times.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No darshan timings listed for this day.
                </li>
              ) : null}
            </ul>
          </div>

          {data.sponsorDay ? (
            <div className="temple-card mt-6 p-6">
              <h3 className="text-center text-2xl italic text-maroon underline decoration-gold underline-offset-8">
                {new Date(data.sponsorDay.date + "T00:00:00").toLocaleDateString("en-US")} Sponsors
              </h3>
              <div className="mt-4 space-y-1 text-center text-sm text-muted-foreground">
                <p>Vikram Samvat: {data.sponsorDay.vikram_samvat}</p>
                <p className="gu">
                  Gujarati Month: {data.sponsorDay.gujarati_month} · Paksh:{" "}
                  {data.sponsorDay.gujarati_paksh} · Tithi: {data.sponsorDay.gujarati_tithi}
                </p>
                {data.sponsorDay.utsav ? (
                  <p className="font-semibold text-foreground">Utsav: {data.sponsorDay.utsav}</p>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {Object.entries(sponsorGroups).map(([category, names]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold italic text-maroon">{category}</h4>
                    <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                      {names.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="Calendar"
          title="Upcoming Events"
          subtitle="Celebrate traditions and join us in upcoming festivals, satsangs, and cultural gatherings — moments of joy, devotion, and togetherness."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {data.events.map((e) => (
            <Link
              key={e.id}
              to="/events/$slug"
              params={{ slug: e.slug }}
              className="temple-card group overflow-hidden transition-transform hover:-translate-y-1"
            >
              {e.image_url ? (
                <img
                  src={e.image_url}
                  alt={e.title}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                {e.starts_at ? (
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(e.starts_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                ) : null}
                <h3 className="mt-2 text-lg text-maroon">{e.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{e.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read More <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            All Events <CalendarDays className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Donate */}
      <section className="border-y border-border bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Seva"
            title="Build Our Future"
            subtitle={data.settings["donation_intro"]}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.categories.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/donate"
                search={{ tab: c.tab, category: c.slug }}
                className="temple-card group overflow-hidden transition-transform hover:-translate-y-1"
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-accent" />
                )}
                <div className="p-5">
                  <h3 className="text-lg text-maroon">{c.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-sm hover:scale-[1.02]"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Blog"
          title="Stories of Gokuldham"
          subtitle="Stay updated with inspiring discourses, cultural highlights, and moments of devotion from our community."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {data.posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="temple-card overflow-hidden transition-transform hover:-translate-y-1"
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                <h3 className="gu text-base font-semibold text-maroon">{p.title}</h3>
                <p className="gu mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-border bg-parchment">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <img
            src={data.slides[0]?.image_url ?? ""}
            alt="Gokuldham Haveli"
            loading="lazy"
            className="temple-card h-[380px] w-full object-cover"
          />
          <div>
            <SectionHeading eyebrow="Our Story" title="About Gokuldham" align="left" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {data.settings["about_intro"]}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
