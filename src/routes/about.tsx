import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Learn about Gokuldham Haveli in Atlanta: our Pushtimarg Vaishnav tradition, seva, community and vision.",
      },
      { property: "og:title", content: "About Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content: "Our Pushtimarg Vaishnav tradition, seva, community and vision in Atlanta, Georgia.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: About,
});

function About() {
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <>
      <PageHeader title="About Gokuldham" subtitle={settings["tagline_gu"]} />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-base leading-relaxed text-muted-foreground">{settings["about_intro"]}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { t: "Seva", d: "Daily darshan, shringar and bhog offered to Shri Gokulnathji." },
            { t: "Satsang", d: "Kathas, bhajans and utsav that keep our traditions alive." },
            { t: "Community", d: "A home for Vaishnav families across Georgia and beyond." },
          ].map((c) => (
            <div key={c.t} className="temple-card p-6 text-center">
              <h3 className="text-xl text-maroon">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading title="Visit Us" subtitle={settings["address"]} />
        </div>
      </section>
    </>
  );
}
