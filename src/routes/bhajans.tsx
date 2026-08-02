import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play } from "lucide-react";
import { mediaQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/bhajans")({
  head: () => ({
    meta: [
      { title: "Bhajans & Kirtan Library — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Watch and listen to bhajans, kirtans and haveli sangeet recorded at Gokuldham Haveli, Atlanta.",
      },
      { property: "og:title", content: "Bhajans & Kirtan Library — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Bhajans, kirtans and haveli sangeet from Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mediaQuery),
  component: BhajansPage,
});

function BhajansPage() {
  const { data } = useSuspenseQuery(mediaQuery);
  const items = data.media.filter((m) => m.category === "bhajan" || m.category === "kirtan");
  const [active, setActive] = useState<string | null>(items[0]?.youtube_id ?? null);

  return (
    <>
      <PageHeader
        title="Bhajans & Kirtan"
        subtitle="Haveli sangeet, kirtans and bhajans offered in seva of Shri Gokulnathji."
      />
      <section className="mx-auto max-w-6xl px-4 py-12">
        {items.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No bhajans have been added yet. Add YouTube videos from the admin panel and they appear here.
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="temple-card overflow-hidden">
              <div className="aspect-video w-full">
                {active ? (
                  <iframe
                    key={active}
                    src={`https://www.youtube.com/embed/${active}?autoplay=0`}
                    title="Bhajan player"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : null}
              </div>
            </div>

            <ul className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {items.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setActive(m.youtube_id)}
                    className={`temple-card flex w-full items-center gap-3 p-3 text-left transition-colors ${
                      active === m.youtube_id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${m.youtube_id}/mqdefault.jpg`}
                      alt={m.title}
                      loading="lazy"
                      className="h-14 w-24 rounded-md object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {m.title}
                      </span>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary">
                        <Play className="h-3 w-3" /> Play
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
