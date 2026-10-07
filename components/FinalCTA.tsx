import { Brand, Label, ProductImage } from "./Primitives";

const TALLY_WAITLIST_URL = "https://tally.so/r/0Qpg8P";

export default function FinalCTA() {
  return (
    <section className="final-cta section-pad" id="early-access">
      <div className="final-strip" aria-hidden="true">
        {[8, 3, 17, 10, 15, 19, 14].map((n) => (
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

      <footer>
        <a href="#" aria-label="StyBay home">
          <Brand />
        </a>

        <p>Fashion, perfectly found.</p>

        <span>© {new Date().getFullYear()} StyBay</span>
      </footer>
    </section>
  );
}