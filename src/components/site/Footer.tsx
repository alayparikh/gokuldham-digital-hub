import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Youtube } from "lucide-react";

export function Footer({ settings }: { settings?: Record<string, string> }) {
  const s = settings ?? {};
  return (
    <footer className="mt-20 border-t border-border bg-parchment">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl text-maroon">Gokuldham Haveli</h3>
          <p className="gu mt-2 text-sm text-muted-foreground">
            {s["tagline_gu"] ?? "મારું ગોકુલધામ, તારું ગોકુલધામ આપણું ગોકુલધામ"}
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A Pushtimarg Vaishnav haveli in Atlanta, Georgia devoted to the seva of Shri
            Gokulnathji — daily darshan, utsav, satsang and community service.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-maroon">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-primary">
                Events & Utsav
              </Link>
            </li>
            <li>
              <Link to="/live" className="hover:text-primary">
                Live Darshan
              </Link>
            </li>
            <li>
              <Link to="/bhajans" className="hover:text-primary">
                Bhajans
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-primary">
                Donate & Seva
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-maroon">Contact</h4>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{s["address"] ?? "Atlanta, GA"}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{s["phone"] ?? ""}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{s["email"] ?? "info@gokuldham.org"}</span>
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
          <Link to="/admin" className="hover:text-primary">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
