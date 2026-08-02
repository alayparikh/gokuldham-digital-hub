import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Users, Mic, Sparkles } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/build-our-future/vidyalaya")({
  head: () => ({
    meta: [
      { title: "Gokuldham Vidyalaya — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Gokuldham Vidyalaya is a weekend school for over 200 students, teaching Gujarati, Pushtimarg teachings, festivals, public speaking and Indian culture.",
      },
      { property: "og:title", content: "Gokuldham Vidyalaya" },
      {
        property: "og:description",
        content: "A weekend school rooted in our heritage, our Thakorji and our community.",
      },
    ],
  }),
  component: VidyalayaPage,
});

const CURRICULUM = [
  {
    icon: BookOpen,
    title: "Gujarati Language",
    body: "Reading, writing and conversation, so children can speak with their grandparents and read our texts in the original.",
  },
  {
    icon: Sparkles,
    title: "Hindu & Pushtimarg Teachings",
    body: "The principles of Sanatan Dharma and the Path of Grace, taught at a level each age group can carry with them.",
  },
  {
    icon: Users,
    title: "Festivals & Rituals",
    body: "The significance behind each utsav, the rituals we perform, and the cultural practices that surround them.",
  },
  {
    icon: Mic,
    title: "Public Speaking & Leadership",
    body: "Confidence on stage and in front of the sabha, developed through the annual Namaste program.",
  },
];

function VidyalayaPage() {
  return (
    <>
      <PageHeader
        title="Gokuldham Vidyalaya"
        subtitle="An educational initiative rooted in love for our heritage, devotion to our Thakorji, and a deep commitment to our community."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "200+", l: "Students enrolled" },
            { n: "K–9", l: "Grade levels" },
            { n: "Weekends", l: "When we meet" },
          ].map((s) => (
            <div key={s.l} className="temple-card p-6 text-center">
              <p className="font-display text-3xl text-maroon">{s.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-base leading-relaxed text-muted-foreground">
          Vidyalaya runs on weekends and welcomes children from kindergarten through 9th grade, with
          a dedicated youth program continuing beyond 9th grade. Our teachers are volunteers from
          the sangat, and every class is built around the idea that our children should feel our
          traditions as their own rather than learn them as a subject.
        </p>

        <div className="mt-14">
          <SectionHeading title="What Students Learn" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {CURRICULUM.map((c) => (
              <div key={c.title} className="temple-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg text-maroon">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link
            to="/build-our-future/volunteer"
            className="inline-flex items-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Volunteer to teach
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Support Vidyalaya
          </Link>
        </div>
      </section>
    </>
  );
}
