import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/about-us/newsletters")({
  head: () => ({
    meta: [
      { title: "Newsletters — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Stay updated with the latest newsletters and announcements from the Gokuldham community.",
      },
      { property: "og:title", content: "Gokuldham Newsletters" },
      {
        property: "og:description",
        content: "Latest newsletters and announcements from the Gokuldham community.",
      },
    ],
  }),
  component: NewslettersPage,
});

// Newsletters are published as PDFs/articles on the main gokuldham.org site. Once the
// admin gains a newsletters table these can move into the database like blog posts.
const NEWSLETTERS = [
  {
    title: "પુષ્ટિ પ્રજ્ઞા માર્ચ - એપ્રિલ ૨૦૨૬ આવૃત્તિ",
    titleEn: "Pushti Pragna — March–April 2026 edition",
    date: "May 4, 2026",
    href: "https://gokuldham.org/about-us/newsletters/pushtipragna-April-edition",
    summary:
      "Explores Krishna's divine form, and how faith and dedication carry us through life's obstacles.",
  },
  {
    title: "સફેદ ઘટા માં ફૂલ ના હિંડોળા",
    titleEn: "Flower swings in white",
    date: "August 3, 2025",
    href: "https://gokuldham.org/about-us/newsletters/ful-na-hindola",
    summary:
      "A record of the hindola celebration at Gokuldham Haveli, with decorated swings and offerings.",
  },
];

function NewslettersPage() {
  return (
    <>
      <PageHeader
        title="Gokuldham Newsletters"
        subtitle="Stay updated with the latest newsletters and announcements from the Gokuldham community."
      />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <ul className="space-y-5">
          {NEWSLETTERS.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                target="_blank"
                rel="noreferrer"
                className="temple-card block p-6 transition-colors hover:bg-accent/40"
              >
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {n.date}
                </p>
                <h2 className="gu mt-2 text-xl text-maroon">{n.title}</h2>
                <p className="mt-1 text-sm font-medium text-foreground/70">{n.titleEn}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read newsletter
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
