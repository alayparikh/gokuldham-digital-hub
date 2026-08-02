import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";
import { settingsQuery } from "@/lib/queries";
import { SITE_INFO, settingOr } from "@/lib/site-info";

export const Route = createFileRoute("/calendar/vaishnav-muhrat")({
  head: () => ({
    meta: [
      { title: "Vaishnav Muhrat — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Vaishnav Muhrat at Gokuldham Haveli — auspicious timings for ceremonies, and the tithis and observances that shape the Pushtimarg year.",
      },
      { property: "og:title", content: "Vaishnav Muhrat — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Auspicious timings and observances in the Pushtimarg Vaishnav calendar.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: VaishnavMuhratPage,
});

const OBSERVANCES = [
  {
    name: "Ekadashi",
    when: "Eleventh tithi of each paksh — twice a month",
    body: "Observed with fasting and extra darshan. Vaishnavs keep phalahar and spend the day in katha and kirtan.",
  },
  {
    name: "Purnima",
    when: "Full moon of each month",
    body: "A day of shringar and special bhog, and the day on which many families begin new seva.",
  },
  {
    name: "Amavasya",
    when: "New moon of each month",
    body: "Traditionally set aside for remembrance of ancestors and for quiet, personal seva.",
  },
  {
    name: "Sankranti",
    when: "When the sun enters a new rashi",
    body: "Makar Sankranti in January is the most widely observed, marked with til, patang and daan.",
  },
];

function VaishnavMuhratPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <>
      <PageHeader
        title="Vaishnav Muhrat"
        subtitle="Auspicious timings for ceremonies, and the tithis that shape the Pushtimarg Vaishnav year."
      />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-base leading-relaxed text-muted-foreground">
          A muhrat is an auspicious window of time chosen for an important occasion — a griha
          pravesh, a wedding, a new business, an upanayan, or the start of a new seva. In the
          Pushtimarg tradition these are read from the Vaishnav panchang, which follows the Vikram
          Samvat year and the tithi rather than the Gregorian date.
        </p>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Our Shastriji at the Haveli helps families choose muhrat for personal ceremonies and
          performs the associated vidhi. Because the panchang depends on both the tithi and your
          location, please speak with us before fixing a date.
        </p>

        <div className="temple-card mt-10 p-6 text-center">
          <h2 className="text-xl text-maroon">Request a Muhrat</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Call {settingOr(settings["phone"], SITE_INFO.phone)} or email us with the ceremony and
            the range of dates you are considering.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${settingOr(settings["email"], SITE_INFO.email)}`}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Email the Haveli
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Contact form
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading
            title="Recurring Observances"
            subtitle="Dates shift each year with the tithi — check the annual calendar for this year's dates."
          />
          <div className="mt-8 space-y-4">
            {OBSERVANCES.map((o) => (
              <div key={o.name} className="temple-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg text-maroon">{o.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-primary">{o.when}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link to="/calendar/annual-calendar" className="text-primary hover:underline">
            View the annual calendar
          </Link>{" "}
          for this year's utsav dates.
        </p>
      </section>
    </>
  );
}
