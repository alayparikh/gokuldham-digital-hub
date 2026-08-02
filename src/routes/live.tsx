import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { mediaQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Darshan & Streaming — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Watch live darshan, kathas and utsav streams from Gokuldham Haveli, Atlanta on YouTube Live.",
      },
      { property: "og:title", content: "Live Darshan — Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content: "Watch live darshan, kathas and utsav streams from Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mediaQuery),
  component: LivePage,
});

function LivePage() {
  const { data } = useSuspenseQuery(mediaQuery);
  const channelId = data.settings["youtube_channel_id"] ?? "";
  const embed = channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}`
    : (data.settings["youtube_live_embed_url"] ?? "");

  const recent = data.media.filter((m) => m.category === "live" || m.category === "katha");

  return (
    <>
      <PageHeader
        title="Live Darshan"
        subtitle="Join the haveli from anywhere — darshan, katha and utsav streamed live."
      />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="temple-card overflow-hidden">
          {embed ? (
            <div className="aspect-video w-full">
              <iframe
                src={embed}
                title="Gokuldham Haveli live stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-accent text-center text-sm text-accent-foreground">
              <span className="max-w-sm px-6">
                A YouTube channel has not been configured yet. Add it from the admin panel to show
                the live stream here.
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-4 w-4 text-primary" />
          The player shows the current live stream automatically when the haveli goes live.
        </p>

        {recent.length ? (
          <div className="mt-14">
            <h2 className="text-2xl text-maroon">Past Streams & Kathas</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {recent.map((m) => (
                <div key={m.id} className="temple-card overflow-hidden">
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${m.youtube_id}`}
                      title={m.title}
                      loading="lazy"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base text-maroon">{m.title}</h3>
                    {m.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {m.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
