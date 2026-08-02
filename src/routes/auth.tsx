import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Gokuldham Haveli Admin" },
      { name: "description", content: "Sign in to manage Gokuldham Haveli website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sign In — Gokuldham Haveli" },
      {
        property: "og:description",
        content: "Sign in to manage Gokuldham Haveli website content.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else toast.success("Check your email to confirm your account.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  // Requires the Google provider to be enabled in the Supabase dashboard
  // (Authentication → Providers) with this site's URL in the allowed redirect list.
  async function onGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/admin" },
    });
    if (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
    // On success Supabase navigates away to Google; nothing further to do here.
  }

  return (
    <>
      <PageHeader title="Sign In" subtitle="Access the Gokuldham content admin." />
      <section className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={onSubmit} className="temple-card space-y-4 p-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" className="w-full rounded-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={onGoogle}
          >
            Continue with Google
          </Button>
          <button
            type="button"
            className="w-full text-center text-sm text-primary"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </>
  );
}
