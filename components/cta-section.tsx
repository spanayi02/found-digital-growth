import { MapPin, ShieldCheck } from "lucide-react";
import { StartOptions } from "@/components/start-options";

const reassurances = [
  [ShieldCheck, "Free, with no obligation"],
  [MapPin, "Cyprus-based team"],
] as const;

export function CTASection({ eyebrow = "Your next step", title = "Not sure where to begin?", body = "Choose the first step that suits you: a review of your website, a look at a new design, or a conversation." }: { eyebrow?: string; title?: string; body?: string }) {
  return (
    <section className="cta-section">
      <div className="site-container">
        <div className="cta-panel" data-motion="rise">
          <div className="cta-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{body}</p>
            <ul className="cta-notes">
              {reassurances.map(([Icon, text]) => <li key={text}><Icon aria-hidden="true" /><span>{text}</span></li>)}
            </ul>
          </div>
          <StartOptions />
        </div>
      </div>
    </section>
  );
}
