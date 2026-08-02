import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/queries";
import { sendContactMessage } from "@/lib/public-content.functions";
import { PageHeader } from "@/components/site/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Reach Gokuldham Haveli in Atlanta for darshan timings, seva bookings, utsav sponsorship and general enquiries.",
      },
      { property: "og:title", content: "Contact Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content: "Reach us for darshan timings, seva bookings and utsav sponsorship.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const submit = useServerFn(sendContactMessage);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || undefined,
          subject: String(fd.get("subject") ?? "") || undefined,
          message: String(fd.get("message") ?? ""),
        },
      });
      toast.success("Thank you — your message has been sent.");
      form.reset();
    } catch {
      toast.error("Sorry, the message could not be sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Contact Us" subtitle="We would love to hear from you." />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="temple-card flex gap-3 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-maroon">Address</h2>
              <p className="mt-1 text-sm text-muted-foreground">{settings["address"]}</p>
            </div>
          </div>
          <div className="temple-card flex gap-3 p-5">
            <Phone className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-maroon">Phone</h2>
              <p className="mt-1 text-sm text-muted-foreground">{settings["phone"]}</p>
            </div>
          </div>
          <div className="temple-card flex gap-3 p-5">
            <Mail className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-maroon">Email</h2>
              <p className="mt-1 text-sm text-muted-foreground">{settings["email"]}</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="temple-card space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" placeholder="Your name" required maxLength={120} />
            <Input name="email" type="email" placeholder="Email address" required maxLength={200} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="phone" placeholder="Phone (optional)" maxLength={40} />
            <Input name="subject" placeholder="Subject (optional)" maxLength={200} />
          </div>
          <Textarea
            name="message"
            placeholder="How can we help?"
            required
            rows={6}
            maxLength={4000}
          />
          <Button type="submit" disabled={busy} className="w-full rounded-full">
            {busy ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </>
  );
}
