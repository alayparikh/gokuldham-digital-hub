import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut } from "lucide-react";
import { adminList, adminUpsert, adminDelete, adminWhoAmI } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Gokuldham Haveli" },
      { name: "description", content: "Manage Gokuldham Haveli website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — Gokuldham Haveli" },
      { property: "og:description", content: "Manage Gokuldham Haveli website content." },
    ],
  }),
  component: AdminPage,
});

type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "bool" | "list" };

type Section = {
  table: string;
  label: string;
  orderBy?: string;
  fields: Field[];
};

const SECTIONS: Section[] = [
  {
    table: "site_settings",
    label: "Site settings",
    orderBy: "key",
    fields: [
      { name: "key", label: "Key" },
      { name: "value", label: "Value", type: "textarea" },
    ],
  },
  {
    table: "hero_slides",
    label: "Hero slides",
    orderBy: "sort_order",
    fields: [
      { name: "image_url", label: "Image URL" },
      { name: "caption", label: "Caption" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "darshan_times",
    label: "Darshan times",
    orderBy: "sort_order",
    fields: [
      { name: "label", label: "Label" },
      { name: "time_text", label: "Time" },
      { name: "icon", label: "Icon (sun/moon/crown/pray/food)" },
      { name: "days", label: "Days (0=Sun … 6=Sat)", type: "list" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "sponsor_days",
    label: "Sponsor days",
    orderBy: "date",
    fields: [
      { name: "date", label: "Date (YYYY-MM-DD)" },
      { name: "vikram_samvat", label: "Vikram Samvat" },
      { name: "gujarati_month", label: "Gujarati month" },
      { name: "gujarati_paksh", label: "Paksh" },
      { name: "gujarati_tithi", label: "Tithi" },
      { name: "utsav", label: "Utsav" },
    ],
  },
  {
    table: "sponsor_entries",
    label: "Sponsor entries",
    orderBy: "sort_order",
    fields: [
      { name: "day_id", label: "Sponsor day id" },
      { name: "category", label: "Category" },
      { name: "sponsor_name", label: "Sponsor name" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "events",
    label: "Events",
    orderBy: "starts_at",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "starts_at", label: "Starts at (ISO)" },
      { name: "location", label: "Location" },
      { name: "image_url", label: "Image URL" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    table: "blog_posts",
    label: "Blog posts",
    orderBy: "published_at",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "published_at", label: "Published at (ISO)" },
      { name: "image_url", label: "Image URL" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    table: "media_items",
    label: "Bhajans & videos",
    orderBy: "sort_order",
    fields: [
      { name: "title", label: "Title" },
      { name: "youtube_id", label: "YouTube video id" },
      { name: "category", label: "Category (bhajan/kirtan/katha/live)" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "gallery_albums",
    label: "Gallery albums",
    orderBy: "event_date",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "event_date", label: "Date (YYYY-MM-DD)" },
      { name: "cover_url", label: "Cover image URL" },
    ],
  },
  {
    table: "gallery_photos",
    label: "Gallery photos",
    orderBy: "sort_order",
    fields: [
      { name: "album_id", label: "Album id" },
      { name: "image_url", label: "Image URL" },
      { name: "caption", label: "Caption" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "donation_categories",
    label: "Donation categories",
    orderBy: "sort_order",
    fields: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug" },
      { name: "tab", label: "Tab" },
      { name: "image_url", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "suggested_amounts", label: "Suggested amounts", type: "list" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "donations",
    label: "Donations",
    orderBy: "created_at",
    fields: [
      { name: "donor_name", label: "Donor" },
      { name: "donor_email", label: "Email" },
      { name: "amount", label: "Amount", type: "number" },
      { name: "status", label: "Status" },
    ],
  },
  {
    table: "contact_messages",
    label: "Messages",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "subject", label: "Subject" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const remove = useServerFn(adminDelete);
  const whoami = useServerFn(adminWhoAmI);

  const [active, setActive] = useState(SECTIONS[0]!.table);
  const section = useMemo(() => SECTIONS.find((s) => s.table === active)!, [active]);

  const me = useQuery({ queryKey: ["whoami"], queryFn: () => whoami({}) });
  const rows = useQuery({
    queryKey: ["admin", active],
    queryFn: () => list({ data: { table: active, orderBy: section.orderBy ?? "" } }),
    enabled: Boolean(me.data?.isAdmin),
  });

  const [draft, setDraft] = useState<Record<string, unknown>>({});

  async function save(row: Record<string, unknown>) {
    try {
      await upsert({ data: { table: active, row } });
      toast.success("Saved");
      setDraft({});
      qc.invalidateQueries({ queryKey: ["admin", active] });
      qc.invalidateQueries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  }

  async function del(id: string) {
    try {
      await remove({ data: { table: active, id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", active] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }

  if (me.isLoading) {
    return <p className="py-24 text-center text-sm text-muted-foreground">Loading…</p>;
  }

  if (!me.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl text-maroon">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is signed in but does not have the admin role yet. Ask an existing admin to grant
          it.
        </p>
        <Button
          className="mt-6 rounded-full"
          variant="outline"
          onClick={async () => {
            await qc.cancelQueries();
            qc.clear();
            await supabase.auth.signOut();
            navigate({ to: "/auth", replace: true });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl text-maroon">Content Admin</h1>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={async () => {
            await qc.cancelQueries();
            qc.clear();
            await supabase.auth.signOut();
            navigate({ to: "/auth", replace: true });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.table}
            onClick={() => {
              setActive(s.table);
              setDraft({});
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              s.table === active
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="temple-card mt-6 p-5">
        <h2 className="text-lg text-maroon">Add new {section.label.toLowerCase()}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {section.fields.map((f) => (
            <FieldInput
              key={f.name}
              field={f}
              value={draft[f.name]}
              onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
            />
          ))}
        </div>
        <Button className="mt-4 rounded-full" onClick={() => save(draft)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {(rows.data ?? []).map((row) => (
          <RowEditor
            key={String(row["id"] ?? row["key"])}
            section={section}
            row={row as Record<string, unknown>}
            onSave={save}
            onDelete={del}
          />
        ))}
        {rows.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {rows.data && rows.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const str =
    field.type === "list"
      ? Array.isArray(value)
        ? value.join(", ")
        : ""
      : value === null || value === undefined
        ? ""
        : String(value);

  if (field.type === "textarea") {
    return (
      <label className="sm:col-span-2 block text-sm">
        <span className="text-muted-foreground">{field.label}</span>
        <Textarea className="mt-1" rows={4} value={str} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }

  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{field.label}</span>
      <Input
        className="mt-1"
        value={str}
        onChange={(e) => {
          const v = e.target.value;
          if (field.type === "number") onChange(v === "" ? null : Number(v));
          else if (field.type === "list")
            onChange(
              v
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (Number.isNaN(Number(s)) ? s : Number(s))),
            );
          else onChange(v);
        }}
      />
    </label>
  );
}

function RowEditor({
  section,
  row,
  onSave,
  onDelete,
}: {
  section: Section;
  row: Record<string, unknown>;
  onSave: (row: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [local, setLocal] = useState(row);

  return (
    <div className="temple-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {section.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={local[f.name]}
            onChange={(v) => setLocal((r) => ({ ...r, [f.name]: v }))}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="rounded-full" onClick={() => onSave(local)}>
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        {local["id"] ? (
          <Button
            variant="outline"
            className="rounded-full text-destructive"
            onClick={() => onDelete(String(local["id"]))}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
