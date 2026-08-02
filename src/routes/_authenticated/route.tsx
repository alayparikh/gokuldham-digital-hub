import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  // The Supabase session lives in localStorage, so the server can never know whether
  // the visitor is signed in. Render this subtree on the client only.
  ssr: false,
  component: AuthenticatedLayout,
  pendingComponent: Checking,
});

function Checking() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Checking your session…
    </div>
  );
}

// The redirect runs in an effect rather than in beforeLoad: a redirect thrown during
// the first client render happens mid-hydration, which makes React discard the tree
// and log a hydration mismatch. After mount it is an ordinary client navigation.
function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "authed">("checking");

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      setStatus("authed");
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (status === "checking") return <Checking />;
  return <Outlet />;
}
