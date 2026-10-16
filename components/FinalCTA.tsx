import { Label, ProductImage } from "./Primitives";
import { site } from "@/lib/site";
import { productPools } from "@/lib/productCatalog";

const TALLY_WAITLIST_URL = site.waitlist;

export default function FinalCTA() {
  return (
    <section className="final-cta section-pad" id="early-access">
      <div className="final-strip" aria-hidden="true">
        {productPools.homeCallback.map((n) => (
          <ProductImage index={n} key={n} decorative />
        ))}
      </div>

      <div className="final-copy" data-reveal>
        <Label>YOUR NEXT FIND IS OUT THERE.</Label>

        <h2>
          Less searching.
          <br />
          More <em>finding.</em>
        </h2>

        <p>StyBay is coming soon.</p>

        <form
          action={TALLY_WAITLIST_URL}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
          className="waitlist-form"
        >
          <button type="submit">
            Join the waitlist
          </button>
        </form>

        <span className="form-note">
          Join the list and we&apos;ll let you know when StyBay is ready.
        </span>
      </div>

    </section>
  );
}
