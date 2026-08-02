import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Heart, ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_INFO } from "@/lib/site-info";

type NavLeaf = { to: string; label: string };
type NavItem = { label: string; to?: string; children?: NavLeaf[] };

const NAV: NavItem[] = [
  {
    label: "About Us",
    children: [
      { to: "/about", label: "About Us" },
      { to: "/about-us/newsletters", label: "Newsletters" },
      { to: "/events", label: "Events" },
      { to: "/donate", label: "Donate" },
      { to: "/about-us/annakut-mahotsav", label: "Annakut Mahotsav" },
    ],
  },
  {
    label: "Build Our Future",
    children: [
      { to: "/build-our-future/vidyalaya", label: "Vidyalaya" },
      { to: "/build-our-future/volunteer", label: "Volunteer" },
      { to: "/build-our-future/summer-camp", label: "Summer Camp" },
    ],
  },
  {
    label: "Calendar",
    children: [
      { to: "/calendar/annual-calendar", label: "Annual Calendar" },
      { to: "/calendar/vaishnav-muhrat", label: "Vaishnav Muhrat" },
    ],
  },
  {
    label: "Resources",
    children: [
      { to: "/resources", label: "Darshan Guide" },
      { to: "/gallery", label: "Photo Gallery" },
    ],
  },
  { to: "/live", label: "Live" },
  { to: "/bhajans", label: "Bhajans" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
];

function DesktopMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  // Close when focus or the pointer leaves the whole group, and on Escape, so the
  // panel never gets stranded open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!item.children) {
    return (
      <Link
        to={item.to!}
        className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
        activeProps={{ className: "bg-accent text-accent-foreground" }}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
          open ? "text-primary" : "text-foreground/80",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full z-50 min-w-56 pt-2",
          open ? "block" : "pointer-events-none hidden",
        )}
      >
        <ul className="overflow-hidden rounded-xl border border-border bg-parchment py-2 shadow-lg">
          {item.children.map((child) => (
            <li key={child.to}>
              <Link
                to={child.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon text-maroon-foreground shadow-sm">
            <span className="font-display text-lg">ॐ</span>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-maroon">Gokuldham Haveli</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Atlanta, GA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => (
            <DesktopMenu key={item.label} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE_INFO.prasadamUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent lg:inline-flex"
          >
            Gokuldham Prasadam
          </a>
          <Link
            to="/donate"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Heart className="h-4 w-4" /> Donate
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border/70 xl:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="py-1">
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-maroon">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/85 hover:bg-accent"
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to!}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/85 hover:bg-accent"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href={SITE_INFO.prasadamUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium"
          >
            Gokuldham Prasadam
          </a>
          <Link
            to="/donate"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
