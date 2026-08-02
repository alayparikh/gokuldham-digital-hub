import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";
import { eventQuery } from "@/lib/queries";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventQuery(params.slug));
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event not found — Gokuldham Haveli" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — Gokuldham Haveli Atlanta`;
    const description = loaderData.summary ?? "An utsav at Gokuldham Haveli, Atlanta.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(loaderData.image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: loaderData.image_url },
              { name: "twitter:image", content: loaderData.image_url },
            ]
          : []),
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const { data: event } = useSuspenseQuery(eventQuery(slug));
  if (!event) return null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>
      <h1 className="mt-4 text-3xl text-maroon sm:text-4xl">{event.title}</h1>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {event.starts_at ? (
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {new Date(event.starts_at).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </span>
        ) : null}
        {event.location ? (
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {event.location}
          </span>
        ) : null}
      </div>
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title}
          className="temple-card mt-6 h-[360px] w-full object-cover"
        />
      ) : null}
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
        {(event.body ?? event.summary ?? "").split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
