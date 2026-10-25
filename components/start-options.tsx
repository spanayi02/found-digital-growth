import Link from "next/link";
import { ArrowUpRight, CalendarDays, LayoutTemplate, ScanSearch } from "lucide-react";

// The three ways to start with VISION. Shown together wherever a visitor picks a next step,
// so the free offers and the call always read as one short, consistent choice.
export const startOptions = [
  { href: "/free-audit", icon: ScanSearch, title: "Free website audit", detail: "Have a website? Get a written review of what to fix first." },
  { href: "/free-prototype", icon: LayoutTemplate, title: "Free prototype", detail: "See a homepage designed for your business before you commit." },
  { href: "/book", icon: CalendarDays, title: "Book a call", detail: "Pick a time: Teams, Zoom, Google Meet or phone." },
] as const;

export function StartOptions({ variant = "panel", onSelect }: { variant?: "panel" | "menu"; onSelect?: () => void }) {
  return (
    <ul className={`start-options start-options-${variant}`}>
      {startOptions.map(({ href, icon: Icon, title, detail }) => (
        <li key={href}>
          <Link href={href} onClick={onSelect} data-track="start_option_click" data-track-label={title} data-track-location={variant}>
            <i aria-hidden="true"><Icon /></i>
            <span><strong>{title}</strong><small>{detail}</small></span>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
