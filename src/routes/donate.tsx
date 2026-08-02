import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { HandHeart } from "lucide-react";
import { toast } from "sonner";
import { donateQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  tab: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/donate")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Donate & Seva — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Support daily seva, utsav, annakut and the haveli building fund at Gokuldham Haveli, Atlanta. One-time and recurring donations.",
      },
      { property: "og:title", content: "Donate & Seva — Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content: "Support daily seva, utsav and the building fund at Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(donateQuery),
  component: DonatePage,
});

const PRESETS = [51, 101, 251, 501, 1001];

function DonatePage() {
  const { data } = useSuspenseQuery(donateQuery);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const tabs = Array.from(new Set(data.categories.map((c) => c.tab)));
  const activeTab = search.tab && tabs.includes(search.tab) ? search.tab : (tabs[0] ?? "");
  const visible = data.categories.filter((c) => c.tab === activeTab);
  const activeCategory = visible.find((c) => c.slug === search.category) ?? visible[0];

  const [amount, setAmount] = useState<number | "">(101);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(false);

  const finalAmount = custom ? Number(custom) : amount || 0;

  return (
    <>
      <PageHeader title="Donate & Seva" subtitle={data.settings["donation_intro"]} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => navigate({ search: { tab: t } })}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                t === activeTab
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {visible.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ search: { tab: activeTab, category: c.slug } })}
                className={`temple-card overflow-hidden text-left transition-transform hover:-translate-y-1 ${
                  activeCategory?.id === c.id ? "ring-2 ring-primary" : ""
                }`}
              >
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} loading="lazy" className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 w-full bg-accent" />
                )}
                <div className="p-4">
                  <h2 className="text-lg text-maroon">{c.name}</h2>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                  {c.suggested_amount ? (
                    <p className="mt-2 text-sm font-semibold text-primary">
                      Suggested ${c.suggested_amount}
                    </p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          <aside className="temple-card h-fit p-6">
            <h2 className="text-xl text-maroon">
              {activeCategory ? activeCategory.name : "Make a donation"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every contribution supports daily seva and the haveli community.
            </p>

            <div className="mt-5 flex gap-2 rounded-full bg-muted p-1">
              {[
                { k: false, l: "One-time" },
                { k: true, l: "Monthly" },
              ].map((o) => (
                <button
                  key={o.l}
                  onClick={() => setRecurring(o.k)}
                  className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium ${
                    recurring === o.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAmount(p);
                    setCustom("");
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    !custom && amount === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-accent"
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>

            <Input
              className="mt-3"
              inputMode="decimal"
              placeholder="Other amount (USD)"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            />

            <Button
              className="mt-5 w-full rounded-full"
              onClick={() =>
                toast.info(
                  "Card payments are not switched on yet — ask to enable payments and this button will open secure checkout.",
                )
              }
              disabled={!finalAmount}
            >
              <HandHeart className="mr-2 h-4 w-4" />
              Donate ${finalAmount || 0}
              {recurring ? " / month" : ""}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Prefer another way?{" "}
              <Link to="/contact" className="text-primary underline">
                Contact us
              </Link>{" "}
              for check or bank transfer details.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
