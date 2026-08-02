import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { eventsQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar/annual-calendar")({
  head: () => ({
    meta: [
      { title: "Annual Calendar — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "The full calendar of utsavs, festivals and observances celebrated at Gokuldham Haveli, month by month.",
      },
      { property: "og:title", content: "Annual Calendar — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Utsavs and festivals at Gokuldham Haveli, month by month.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  component: AnnualCalendarPage,
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function AnnualCalendarPage() {
  const { data: events } = useSuspenseQuery(eventsQuery);

  // Group events by calendar year, then by month index, so the page mirrors the
  // year → month drill-down on gokuldham.org.
  const byYear = useMemo(() => {
    const map = new Map<number, Map<number, typeof events>>();
    for (const e of events) {
      if (!e.starts_at) continue;
      const d = new Date(e.starts_at);
      if (Number.isNaN(d.getTime())) continue;
      const year = d.getFullYear();
      const month = d.getMonth();
      if (!map.has(year)) map.set(year, new Map());
      const months = map.get(year)!;
      if (!months.has(month)) months.set(month, []);
      months.get(month)!.push(e);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [events]);

  const [openYear, setOpenYear] = useState<number | null>(byYear[0]?.[0] ?? null);

  return (
    <>
      <PageHeader
        title="Annual Calendar"
        subtitle="Utsavs, festivals and observances at Gokuldham Haveli through the year."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        {byYear.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No dated events have been published yet. Please check back soon.
          </p>
        ) : (
          <div className="space-y-4">
            {byYear.map(([year, months]) => {
              const open = openYear === year;
              return (
                <div key={year} className="temple-card overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenYear(open ? null : year)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="font-display text-3xl text-maroon">{year}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        open && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {open ? (
                    <div className="border-t border-border/70 px-6 py-5">
                      {MONTHS.map((label, index) => {
                        const monthEvents = months.get(index);
                        if (!monthEvents?.length) return null;
                        return (
                          <div key={label} className="mb-6 last:mb-0">
                            <h3 className="text-lg font-semibold text-maroon">{label}</h3>
                            <ul className="mt-2 space-y-2">
                              {monthEvents.map((e) => (
                                <li key={e.id}>
                                  <Link
                                    to="/events/$slug"
                                    params={{ slug: e.slug }}
                                    className="flex flex-wrap items-baseline gap-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                  >
                                    <span className="font-medium text-primary">
                                      {new Date(e.starts_at!).toLocaleDateString(undefined, {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                    <span className="text-foreground/85">{e.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Looking for auspicious dates?{" "}
          <Link to="/calendar/vaishnav-muhrat" className="text-primary hover:underline">
            See Vaishnav Muhrat
          </Link>
          .
        </p>
      </section>
    </>
  );
}
