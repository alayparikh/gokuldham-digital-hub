import { createFileRoute, Link } from "@tanstack/react-router";
import { Sunrise, Sparkles, UtensilsCrossed, Bell, Moon } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Darshan Guide — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "A guide to the five daily darshans of Shri Shrinathji — Mangla, Shringar, Rajbhog, Utthapan and Shayan — and the ragas and traditions of each.",
      },
      { property: "og:title", content: "Darshan Guide — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "The meaning, timing and tradition behind each of the five daily darshans.",
      },
    ],
  }),
  component: ResourcesPage,
});

const DARSHANS = [
  {
    name: "Mangla Darshan",
    icon: Sunrise,
    singer: "—",
    body: "The first darshan of the day, held before sunrise in winter and a little later in summer. The name Mangla underlines the auspiciousness of beginning the day with a divine glimpse. The sanctum doors stay closed at first so the divine child is not disturbed — an expression of bala bhava, the sentiment of parental care.",
  },
  {
    name: "Shringar Darshan",
    icon: Sparkles,
    singer: "Nandadas",
    body: "About an hour after Mangla, Shrinathji is dressed with great care and adorned with flowers, dry fruits and sweets. His flute is presented to him after this ritual meal. The ragas associated with this darshan are Ramakali, Gunakali and Bilaval.",
  },
  {
    name: "Rajbhog Darshan",
    icon: UtensilsCrossed,
    singer: "Kumbhandas",
    body: 'The most elaborate darshan of the day, when the main meal is offered. A priest calls "Mala Begi Laiyo!!" from the terrace and the doors open to Shrinathji in regal splendour, a lotus in one hand and an elaborate garland at his neck. He then rests for three hours — the period known as Anavasara.',
  },
  {
    name: "Utthapan Darshan",
    icon: Bell,
    singer: "Surdas",
    body: "Around 3.30 p.m., Shrinathji is woken from his rest with the sound of the conch and the vina, symbolising his return home with the cows.",
  },
  {
    name: "Shayan Darshan",
    icon: Moon,
    singer: "Krishnadas",
    body: "The final darshan, following the cook's call — the rasoiya boli. Eatables and betel leaves are offered as the lord prepares for bed, and the bed chamber is arranged with food, water and betel. This darshan is suspended for six months, from Chaitra Shukla 1 to Ashvin Shukla 9, during Shrinathji's presumed visit to Vraja.",
  },
];

function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Darshan Guide"
        subtitle="Shri Shrinathji is revealed five times a day. Each darshan has its own mood, dress, offering and music."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-6">
          {DARSHANS.map((d, i) => (
            <article key={d.name} className="temple-card p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <d.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Darshan {i + 1}
                  </p>
                  <h2 className="mt-1 text-2xl text-maroon">{d.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
                  {d.singer !== "—" ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Chief singer:{" "}
                      <span className="font-medium text-foreground/80">{d.singer}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeading
            title="More Resources"
            subtitle="Timings change with the season and with utsav days — always check the calendar before you visit."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link to="/calendar/annual-calendar" className="temple-card p-5 text-center">
              <h3 className="text-lg text-maroon">Annual Calendar</h3>
              <p className="mt-1 text-sm text-muted-foreground">Utsav dates through the year</p>
            </Link>
            <Link to="/gallery" className="temple-card p-5 text-center">
              <h3 className="text-lg text-maroon">Photo Gallery</h3>
              <p className="mt-1 text-sm text-muted-foreground">Darshan and utsav albums</p>
            </Link>
            <Link to="/bhajans" className="temple-card p-5 text-center">
              <h3 className="text-lg text-maroon">Bhajans</h3>
              <p className="mt-1 text-sm text-muted-foreground">Kirtan and bhajan recordings</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
