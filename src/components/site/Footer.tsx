import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Youtube } from "lucide-react";
import { SITE_INFO, settingOr, telHref, mapsHref } from "@/lib/site-info";

const EXPLORE = [
  { to: "/about", label: "About Us" },
  { to: "/about-us/newsletters", label: "Newsletters" },
  { to: "/events", label: "Events & Utsav" },
  { to: "/calendar/annual-calendar", label: "Annual Calendar" },
  { to: "/resources", label: "Darshan Guide" },
  { to: "/blog", label: "Blog" },
] as const;

const COMMUNITY = [
  { to: "/build-our-future/vidyalaya", label: "Vidyalaya" },
  { to: "/build-our-future/volunteer", label: "Volunteer" },
  { to: "/build-our-future/summer-camp", label: "Summer Camp" },
  { to: "/live", label: "Live Darshan" },
  { to: "/bhajans", label: "Bhajans" },
  { to: "/donate", label: "Donate & Seva" },
] as const;

export function Footer({ settings }: { settings?: Record<string, string> }) {
  const s = settings ?? {};
  const address = settingOr(s["address"], SITE_INFO.address);
  const phone = settingOr(s["phone"], SITE_INFO.phone);
  const email = settingOr(s["email"], SITE_INFO.email);

  return (
    <footer className="mt-20 border-t border-border bg-parchment">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl text-maroon">{SITE_INFO.name}</h3>
          <p className="gu mt-2 text-sm text-muted-foreground">
            {s["tagline_gu"] ?? SITE_INFO.taglineGu}
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A Pushtimarg Vaishnav haveli in Atlanta, Georgia devoted to the seva of Shri Gokulnathji
            — daily darshan, utsav, satsang and community service.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-maroon">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {EXPLORE.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-maroon">Community</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {COMMUNITY.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-maroon">Contact</h4>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={mapsHref(address)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                {address}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={telHref(phone)} className="hover:text-primary">
                {phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${email}`} className="break-all hover:text-primary">
                {email}
              </a>
            </li>
            {s["youtube_channel_url"] ? (
              <li className="flex gap-2">
                <Youtube className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={s["youtube_channel_url"]}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  YouTube Channel
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Gokuldham Haveli, Atlanta. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href={SITE_INFO.prasadamUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              Gokuldham Prasadam
            </a>
            <Link to="/contact" className="hover:text-primary">
              Contact Us
            </Link>
            <Link to="/admin" className="hover:text-primary">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
