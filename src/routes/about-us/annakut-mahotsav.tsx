import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";
import { SITE_INFO } from "@/lib/site-info";

export const Route = createFileRoute("/about-us/annakut-mahotsav")({
  head: () => ({
    meta: [
      { title: "Annakut Mahotsav — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Annakut Mahotsav at Gokuldham Haveli — the grand offering of mountains of prasad to Shri Gokulnathji, held the day after Diwali.",
      },
      { property: "og:title", content: "Annakut Mahotsav — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "The grand annual offering of prasad to Shri Gokulnathji.",
      },
    ],
  }),
  component: AnnakutPage,
});

function AnnakutPage() {
  return (
    <>
      <PageHeader
        title="Annakut Mahotsav"
        subtitle="The grand offering of mountains of prasad to Shri Gokulnathji, in memory of Shri Krishna lifting Govardhan."
      />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-base leading-relaxed text-muted-foreground">
          Annakut — literally &ldquo;a mountain of food&rdquo; — recalls the day Shri Krishna lifted
          Govardhan hill to shelter the people of Vraja, and asked that the offering meant for Indra
          be made to the hill instead. In Pushtimarg, Annakut is the largest bhog of the year. The
          Haveli is filled with hundreds of preparations arranged before Thakorji, and the whole
          sangat gathers for darshan.
        </p>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          At Gokuldham Haveli the mahotsav is held the day after Diwali, marking the Vaishnav new
          year. Preparation begins days in advance, with families across Georgia cooking, arranging
          and decorating together — the seva is as much a part of the utsav as the darshan itself.
        </p>

        <div className="mt-14">
          <SectionHeading title="Take Part" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="temple-card p-6 text-center">
              <h3 className="text-lg text-maroon">Offer Seva</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sponsor a preparation, a decoration or a portion of the bhog.
              </p>
            </div>
            <div className="temple-card p-6 text-center">
              <h3 className="text-lg text-maroon">Volunteer</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Join the kitchen, setup or darshan management teams.
              </p>
            </div>
            <div className="temple-card p-6 text-center">
              <h3 className="text-lg text-maroon">Attend Darshan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bring your family for darshan and mahaprasad.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            to="/donate"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Sponsor Annakut Seva
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            See this year's date
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions about Annakut seva? Call {SITE_INFO.phone} or email{" "}
          <a className="text-primary hover:underline" href={`mailto:${SITE_INFO.email}`}>
            {SITE_INFO.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
