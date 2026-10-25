import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, LayoutTemplate, MonitorSmartphone, Palette, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { FAQList } from "@/components/faq-list";
import { PageMotion } from "@/components/page-motion";
import { PrototypeForm } from "@/components/prototype-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Website Prototype Cyprus: See Your New Website First",
  description: "Get a free homepage prototype for your Cyprus business before you pay anything. Designed around your services, on desktop and mobile, with no obligation.",
  alternates: { canonical: "/free-prototype" },
};

const steps = [
  ["Tell us about the business", "Two minutes, no website needed", "Day 1"],
  ["We design your homepage", "Your services, your area, your customers", "3-5 days"],
  ["We walk you through it", "A short call or a private link", "Online"],
  ["You decide", "Build the full site, or keep the idea", "No cost"],
] as const;

const included = [
  [LayoutTemplate, "A real homepage", "Designed for your business, not a template with your logo dropped in"],
  [MonitorSmartphone, "Desktop and mobile", "See how it looks on the phone, where most customers will meet it"],
  [Target, "Built to bring enquiries", "A clear first screen and one main action: call, book or enquire"],
  [Palette, "Your brand", "We work with your logo, colours and photos, or suggest a direction"],
] as const;

const reassurances = [
  [ShieldCheck, "Free, with no obligation"],
  [Clock, "Homepage prototype in 3 to 5 working days"],
  [Users, "Five prototypes a month, so each one gets real attention"],
] as const;

const prototypeFaqs = [
  ["Is the prototype really free?", "Yes. The homepage prototype costs nothing and you are under no obligation to continue. If you like it, we quote the full website. If not, that is the end of it."],
  ["Why do you offer it for free?", "Most business owners find it hard to judge a website from a proposal. Seeing your own business on screen makes the decision easier, and the businesses that like the prototype usually become clients."],
  ["What exactly do I receive?", "A designed homepage for your business on desktop and mobile, shared through a private link or on a short call. It is a design prototype, not a live website, so it is not published under your domain."],
  ["Do I need an existing website?", "No. Many requests come from businesses that only have a Facebook or Instagram page, or nothing online yet. Tell us what the business does and who it serves, and we design from there."],
  ["How is this different from the free audit?", "The audit reviews a website you already have and lists what to fix. The prototype shows what a new website could look like, so you can judge whether our style suits the business."],
  ["What happens if I want the full website?", "We send a fixed quote based on the pages and features you need. Website packages start at €599. The prototype becomes the starting point of the design, so the work is not wasted."],
] as const;

export default function FreePrototypePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Offer",
        name: "Free Website Prototype",
        description: metadata.description,
        url: `${siteConfig.url}/free-prototype`,
        price: "0",
        priceCurrency: "EUR",
        areaServed: { "@type": "Country", name: "Cyprus" },
        seller: { "@id": `${siteConfig.url}/#business` },
      },
      {
        "@type": "FAQPage",
        mainEntity: prototypeFaqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
      },
    ],
  };

  return (
    <main className="prototype-page motion-page">
      <PageMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="lit-hero audit-lit-hero">
        <div className="site-container lit-hero-grid">
          <div>
            <p className="eyebrow">Free website prototype</p>
            <h1>See your new website <em>before you pay.</em></h1>
            <p className="lit-hero-lead">We design the homepage of your new website for free, around your business and your customers. If the style suits you, we build the rest. If not, you owe nothing.</p>
            <a className="button button-accent button-large prototype-hero-cta" href="#prototype-form" data-track="prototype_cta_click" data-track-location="prototype_hero">
              Request My Free Prototype <ArrowRight aria-hidden="true" />
            </a>
            <p className="audit-deliverable">Five prototypes a month, for businesses in Cyprus.</p>
          </div>

          <div className="hero-panel audit-scorecard" aria-label="How the free prototype works">
            <p className="hero-panel-head"><span>How it works</span><span>When</span></p>
            {steps.map(([title, detail, when], index) => (
              <div className="scorecard-row audit-priority" key={title}>
                <span>0{index + 1}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <em data-impact={index === steps.length - 1 ? "high" : undefined}>{when}</em>
              </div>
            ))}
            <p className="hero-panel-foot"><span>Your cost</span><strong>€0</strong></p>
          </div>
        </div>
      </section>

      <section className="audit-form-section" id="prototype-form">
        <div className="site-container audit-form-grid">
          <div data-motion="rise">
            <p className="eyebrow">Request your prototype</p>
            <h2>Tell us who the website is for.</h2>
            <p>A few details are enough to start. The more we know about your customers and what you want them to do, the closer the first design will be.</p>
            <ul className="prototype-reassurance">
              {reassurances.map(([Icon, text]) => <li key={text}><Icon aria-hidden="true" /><span>{text}</span></li>)}
            </ul>
          </div>
          <div className="form-panel" data-motion="rise"><PrototypeForm /></div>
        </div>
      </section>

      <section className="audit-areas section-pad">
        <div className="site-container">
          <p className="eyebrow" data-motion="rise">What you receive</p>
          <div className="audit-area-grid">
            {included.map(([Icon, title, body]) => (
              <article key={title} data-motion="rise"><i aria-hidden="true"><Icon /></i><h2>{title}</h2><p>{body}</p></article>
            ))}
          </div>
          <p className="prototype-links" data-motion="rise">
            <span><Sparkles aria-hidden="true" /> Want to see the standard first? <Link className="text-link" href="/work">Browse our recent work</Link></span>
            <span><CalendarDays aria-hidden="true" /> Rather talk it through? <Link className="text-link" href="/book">Book a call</Link></span>
          </p>
        </div>
      </section>

      <section className="audit-faq section-pad">
        <div className="site-container">
          <div className="section-heading" data-motion="rise">
            <p className="eyebrow">Questions</p>
            <h2>Free, and no catch.</h2>
          </div>
          <FAQList list={prototypeFaqs} />
        </div>
      </section>
    </main>
  );
}
