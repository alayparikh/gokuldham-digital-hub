import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TABLES = [
  "site_settings",
  "hero_slides",
  "darshan_times",
  "sponsor_days",
  "sponsor_entries",
  "events",
  "blog_posts",
  "media_items",
  "gallery_albums",
  "gallery_photos",
  "donation_categories",
  "donations",
  "contact_messages",
] as const;

const tableSchema = z.enum(TABLES);
type TableName = (typeof TABLES)[number];
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Row = Record<string, Json>;

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const adminWhoAmI = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { userId: context.userId, isAdmin: Boolean(data) };
  });

export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        orderBy: z.string().max(60).optional(),
        ascending: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = context.supabase as any;
    let q = sb.from(data.table as TableName).select("*");
    if (data.orderBy) q = q.order(data.orderBy, { ascending: data.ascending ?? true });
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as Row[];
  });

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, row: z.record(z.string(), z.any()) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = context.supabase as any;
    const { data: row, error } = await sb
      .from(data.table as TableName)
      .upsert(data.row)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as Row | null;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, id: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = context.supabase as any;
    const { error } = await sb
      .from(data.table as TableName)
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSaveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ key: z.string().min(1).max(80), value: z.string().max(5000) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = context.supabase as any;
    const { error } = await sb
      .from("site_settings")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
