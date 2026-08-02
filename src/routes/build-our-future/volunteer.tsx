import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/public-content.functions";
import { PageHeader } from "@/components/site/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/build-our-future/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Volunteer at Gokuldham Haveli: event management, teaching, community outreach, administrative and technical support.",
      },
      { property: "og:title", content: "Volunteer at Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Give your time and skills in seva of Shri Gokulnathji and our community.",
      },
    ],
  }),
  component: VolunteerPage,
});

const AREAS = [
  "Event Management",
  "Teaching & Education",
  "Community Outreach",
  "Administrative Support",
  "Technical Support",
  "Other",
];

function VolunteerPage() {
  const submit = useServerFn(sendContactMessage);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed) {
      toast.error("Please confirm that you want to become a volunteer.");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const area = String(fd.get("area") ?? "Other");
    setBusy(true);
    try {
      // Volunteer sign-ups land in the same inbox as contact messages; the subject
      // line carries the chosen area so admins can triage them.
      await submit({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || undefined,
          subject: `Volunteer — ${area}`,
          message: String(fd.get("message") ?? "") || `I would like to volunteer for ${area}.`,
        },
      });
      toast.success("Thank you — we will be in touch about volunteering.");
      form.reset();
      setConfirmed(false);
    } catch {
      toast.error("Sorry, the form could not be submitted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Volunteer"
        subtitle="Serving Shri Krishna in His divine form of ShriNathji through the Path of Grace — and serving the community that surrounds Him."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-2xl text-maroon">Where you can help</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The Haveli runs on seva. Whether you can give an hour a month or a weekend a year, there
            is a place for you. Tell us where your interest lies and we will connect you with the
            right team.
          </p>
          <ul className="mt-6 space-y-3">
            {AREAS.map((a) => (
              <li key={a} className="temple-card px-5 py-3 text-sm text-foreground/85">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="temple-card space-y-4 p-6">
          <Input name="name" placeholder="Full name" required maxLength={120} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="phone" placeholder="Phone number" maxLength={40} />
            <Input name="email" type="email" placeholder="Email address" required maxLength={200} />
          </div>
          <div>
            <label
              htmlFor="volunteer-area"
              className="mb-1.5 block text-sm font-medium text-foreground/85"
            >
              Area of interest
            </label>
            <select
              id="volunteer-area"
              name="area"
              defaultValue={AREAS[0]}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            name="message"
            placeholder="Anything you would like us to know (optional)"
            rows={5}
            maxLength={4000}
          />
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
              aria-label="Yes, I want to become a Volunteer"
            />
            <span>Yes, I want to become a Volunteer</span>
          </label>
          <Button type="submit" disabled={busy} className="w-full rounded-full">
            {busy ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </section>
    </>
  );
}
