import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";
import { SITE_INFO } from "@/lib/site-info";

export const Route = createFileRoute("/build-our-future/summer-camp")({
  head: () => ({
    meta: [
      { title: "Gokuldham Summer Camp — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Gokuldham Summer Camp grew from 25 campers in 2012 to over 260 participants in 2024 — culture, connection and character-building for young Vaishnavs.",
      },
      { property: "og:title", content: "Gokuldham Summer Camp" },
      {
        property: "og:description",
        content: "A vibrant movement rooted in culture, connection, and character-building.",
      },
    ],
  }),
  component: SummerCampPage,
});

function SummerCampPage() {
  return (
    <>
      <PageHeader
        title="Gokuldham Summer Camp"
        subtitle="A vibrant movement rooted in culture, connection, and character-building."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "2012", l: "First camp, 25 campers" },
            { n: "260+", l: "Participants in 2024" },
            { n: "45+", l: "Adult volunteers" },
          ].map((s) => (
            <div key={s.l} className="temple-card p-6 text-center">
              <p className="font-display text-3xl text-maroon">{s.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-10">
          <div>
            <SectionHeading align="left" title="Mission & Overview" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              What began modestly in 2012 with twenty-five campers has grown into one of the largest
              gatherings on our calendar. In 2024 the camp hosted over 260 participants — campers,
              junior and senior counselors, college leads, and more than forty-five adult
              volunteers. Through activities, workshops and spiritual learning, young people explore
              their Hindu heritage, build confidence, and discover what they are capable of.
            </p>
          </div>

          <div>
            <SectionHeading align="left" title="Leadership Development" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              The camp's greatest strength is its continuity. Many of today's college leads and
              senior counselors arrived years ago as campers themselves, and have grown step by step
              into mentoring roles. Each summer the older group returns to guide the younger one,
              and the cycle renews itself.
            </p>
          </div>

          <div>
            <SectionHeading align="left" title="Community Values" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Everything at camp rests on four values — service, tradition, joy and unity. They
              shape how the days are structured, how the counselors are trained, and how the
              children treat one another long after camp ends.
            </p>
          </div>
        </div>

        <div className="temple-card mt-14 p-8 text-center">
          <h2 className="text-2xl text-maroon">Registration</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Registration for Gokuldham Summer Camp is handled on our online portal. Spots fill
            quickly, so register early.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={SITE_INFO.summerCampRegistrationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Register for Summer Camp
            </a>
            <a
              href={`mailto:${SITE_INFO.email}`}
              className="inline-flex items-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Email us a question
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
