import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { eventsQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events & Utsav Calendar — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Upcoming utsavs, festivals, kathas and community gatherings at Gokuldham Haveli, Atlanta.",
      },
      { property: "og:title", content: "Events & Utsav Calendar — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Upcoming utsavs, festivals and community gatherings at Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  component: EventsPage,
});

function EventsPage() {
  const { data: events } = useSuspenseQuery(eventsQuery);

  return (
    <>
      <PageHeader
        title="Events & Utsav"
        subtitle="Celebrate traditions and join us in festivals, satsangs and cultural gatherings."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {events.map((e) => (
            <Link
              key={e.id}
              to="/events/$slug"
              params={{ slug: e.slug }}
              className="temple-card overflow-hidden transition-transform hover:-translate-y-1"
            >
              {e.image_url ? (
                <img src={e.image_url} alt={e.title} loading="lazy" className="h-52 w-full object-cover" />
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
                <h2 className="mt-2 text-lg text-maroon">{e.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{e.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        {events.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No events have been published yet.
          </p>
        ) : null}
      </section>
    </>
  );
}
