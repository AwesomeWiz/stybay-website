import { ArrowUpRight } from "@/components/ArrowIcons";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import WaitlistCTA from "@/components/WaitlistCTA";
import { Label, ProductImage } from "@/components/Primitives";
import DiscoveryStory from "@/components/about/DiscoveryStory";
import Purpose from "@/components/about/Purpose";
import { productPools } from "@/lib/productCatalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "StyBay About — Reimagining Fashion Discovery",
  "Fashion is personal. Finding it should be too. Meet the idea, mission, and vision behind StyBay’s approach to fashion discovery.",
  "/about",
);
export default function AboutPage() {
  return (
    <PageShell className="about-page">
      <section className="editorial-hero about-hero section-pad">
        <Label>FASHION DISCOVERY, REIMAGINED.</Label>
        <h1>
          Fashion is personal.
          <br />
          Finding it should
          <br />
          be <em>too.</em>
        </h1>
        <div className="about-hero-image">
          <ProductImage index={productPools.aboutHero} priority />
          <span>A STYLE OF YOUR OWN.</span>
        </div>
        <div className="hero-footnote">
          <span>THE STYBAY STORY</span>
          <p>
            A more intuitive way to discover fashion across the web. Different
            stores, one visual experience. Your taste at the centre.
          </p>
        </div>
      </section>
      <section className="about-introduction section-pad">
        <div className="editorial-diptych">
          <figure>
            <ProductImage index={productPools.aboutDiptych[0]} />
            <figcaption>Room for the familiar.</figcaption>
          </figure>
          <figure>
            <ProductImage index={productPools.aboutDiptych[1]} />
            <figcaption>Space for the unexpected.</figcaption>
          </figure>
        </div>
        <div data-reveal>
          <Label>01 / WHO WE ARE</Label>
          <h2>
            Not another store.
            <br />A new way
            <br />
            <em>to find.</em>
          </h2>
          <p>
            StyBay is a fashion technology startup. We’re creating a place to
            explore products from different retailers through preferences,
            occasions, and inspiration.
          </p>
          <p>
            A discovery experience that leaves room for individuality. And for
            the look you didn’t know you were looking for.
          </p>
        </div>
      </section>
      <DiscoveryStory />
      <Purpose />
      <section className="manifesto-close section-pad" data-reveal>
        <Label>FASHION DISCOVERY, MADE PERSONAL.</Label>
        <h2>
          Discover beyond brands.
          <br />
          Explore your style.
          <br />
          <em>Find what feels like you.</em>
        </h2>
        <Link className="text-link" href="/technology">
          Explore the technology <span aria-hidden="true"><ArrowUpRight /></span>
        </Link>
      </section>
      <WaitlistCTA />
    </PageShell>
  );
}
