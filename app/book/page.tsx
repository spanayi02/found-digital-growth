import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { PageMotion } from "@/components/page-motion";

export const metadata: Metadata = {
  title: "Book a Call with VISION.",
  description: "Pick a day and time that suits you and talk to VISION. about your website: Microsoft Teams, Zoom, Google Meet or a phone call. Free, with no obligation.",
  alternates: { canonical: "/book" },
};

// Keep in step with the meeting types offered in the booking form.
const meetingTypes = [
  ["Microsoft Teams", "Video call, link in your confirmation"],
  ["Zoom", "Video call, link in your confirmation"],
  ["Google Meet", "Video call, link in your confirmation"],
  ["Phone call", "We call the number you give us"],
] as const;

const callSteps = [
  ["Pick a day and time", "Any weekday evening, 20:00 to 23:00 Cyprus time."],
  ["Choose how we meet", "Teams, Zoom, Google Meet or a phone call."],
  ["We confirm with you", "By email or phone, with the meeting link or the number we will call. If the slot is taken, we suggest the nearest free one."],
] as const;

export default function BookPage() {
  return (
    <main className="book-page motion-page">
      <PageMotion />

      <section className="lit-hero audit-lit-hero">
        <div className="site-container lit-hero-grid">
          <div>
            <p className="eyebrow">Book a call</p>
            <h1>Talk it through, <em>your way.</em></h1>
            <p className="lit-hero-lead">Pick a day and time that suits you and choose how we meet. We confirm it with you, then we talk about the business and what the website should do next.</p>
            <a className="button button-accent button-large prototype-hero-cta" href="#book-call" data-track="book_cta_click" data-track-location="book_hero">
              Choose a time <ArrowRight aria-hidden="true" />
            </a>
            <p className="audit-deliverable">Free, with no obligation.</p>
          </div>

          <div className="hero-panel audit-scorecard" aria-label="Ways to meet">
            <p className="hero-panel-head"><span>How we meet</span><span>Your choice</span></p>
            {meetingTypes.map(([title, detail], index) => (
              <div className="scorecard-row audit-priority" key={title}>
                <span>0{index + 1}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
              </div>
            ))}
            <p className="hero-panel-foot"><span>Your cost</span><strong>€0</strong></p>
          </div>
        </div>
      </section>

      <section className="book-section" id="book-call">
        <div className="site-container book-grid">
          <div data-motion="rise">
            <p className="eyebrow">How it works</p>
            <h2>Three steps, about a minute.</h2>
            <ol className="book-steps">
              {callSteps.map(([title, body], index) => <li key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{body}</p></div></li>)}
            </ol>
            <p className="book-alt">Prefer something in writing? Get a <Link className="text-link" href="/free-audit">free website audit</Link> or a <Link className="text-link" href="/free-prototype">free prototype</Link>.</p>
          </div>

          <div className="book-calendar" data-motion="rise">
            <BookingForm />
          </div>
        </div>
      </section>
    </main>
  );
}
