import { CTA, Label } from "./Primitives";
import { site } from "@/lib/site";
export default function WaitlistCTA() {
  return <section className="editorial-waitlist section-pad" aria-labelledby="waitlist-title">
    <div><Label>COMING SOON / STYBAY</Label><h2 id="waitlist-title">Your next favourite find<br/>starts <em>here.</em></h2><p>Be among the first to experience StyBay.<br/>Join the waitlist for launch and early-access updates.</p></div>
    <CTA href={site.waitlist}>Join the waitlist</CTA>
  </section>;
}
