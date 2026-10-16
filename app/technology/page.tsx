import { ArrowDown, ArrowUpRight } from "@/components/ArrowIcons";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import WaitlistCTA from "@/components/WaitlistCTA";
import Image from "next/image";
import { Label, ProductImage } from "@/components/Primitives";
import EditorialQuery from "@/components/technology/EditorialQuery";
import TasteLab from "@/components/technology/TasteLab";
import SimilarStyles from "@/components/technology/SimilarStyles";
import StyleConstellation from "@/components/technology/StyleConstellation";
import TechnologyMotion from "@/components/technology/TechnologyMotion";
import { productPools } from "@/lib/productCatalog";
import { ui } from "@/lib/assets";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "StyBay Technology — Intelligent Fashion Discovery",
  "Explore StyBay’s developing approach to intelligent fashion search, personal discovery, similar styles, and collections. Designed around the way you discover.",
  "/technology",
);
export default function TechnologyPage() {
  return (
    <PageShell className="technology-page">
      <TechnologyMotion />
      <section className="editorial-hero technology-hero section-pad">
        <Label>DESIGNED AROUND DISCOVERY.</Label>
        <div className="technology-hero-grid">
          <div>
            <h1>
              Search less.
              <br />
              <em>Discover more.</em>
            </h1>
            <p>
              StyBay is being built to make fashion discovery more intuitive
              through intelligent search, personalization, and visual
              exploration.
            </p>
            <a className="text-link" href="#intelligent-search">
              Explore the possibilities <span aria-hidden="true"><ArrowDown /></span>
            </a>
          </div>
          <div className="technology-hero-art">
            <ProductImage index={productPools.technologyHero[0]} priority />
            <ProductImage index={productPools.technologyHero[1]} />
            <span>“Something that feels like me.”</span>
          </div>
        </div>
        <div className="development-note">
          <span>PRE-LAUNCH / PRODUCT DIRECTION</span>
          <p>A look at what we’re designing, and what we’re exploring next.</p>
        </div>
      </section>
      <section
        className="feature-introduction section-pad"
        id="intelligent-search"
      >
        <Label>01 / INTELLIGENT FASHION SEARCH</Label>
        <h2>
          Describe the idea.
          <br />
          <em>Not the SKU.</em>
        </h2>
        <p>
          Finding fashion shouldn’t depend on the perfect keyword. We’re
          developing search around natural descriptions of styles, colours,
          moods, and occasions.
        </p>
      </section>
      <EditorialQuery />
      <TasteLab />
      <section className="across-stores section-pad">
        <div className="feature-copy" data-reveal>
          <Label>03 / DISCOVER ACROSS STORES</Label>
          <h2>
            More possibilities.
            <br />
            One place
            <br />
            <em>to discover them.</em>
          </h2>
          <p>
            Our direction is a single discovery layer for products from
            different online retailers. Explore through StyBay, then continue to
            the original retailer when you’re ready to shop.
          </p>
          <p className="retailer-note">
            StyBay is a discovery platform. Purchases take place with the
            retailer.
          </p>
        </div>
        <div className="store-composition">
          <figure>
            <ProductImage index={productPools.technologyStores[0]} />
            <figcaption>A different colour.</figcaption>
          </figure>
          <figure>
            <ProductImage index={productPools.technologyStores[1]} />
            <figcaption>A different detail.</figcaption>
          </figure>
          <figure>
            <ProductImage index={productPools.technologyStores[2]} />
            <figcaption>A new possibility.</figcaption>
          </figure>
          <span>ONE PLACE TO EXPLORE.</span>
        </div>
      </section>
      <SimilarStyles />
      <section className="technology-phone-feature section-pad">
        <div className="interface-proof">
          <span className="proof-label">INTERFACE STUDY / PRODUCT DETAILS</span>
          <div
            className="ui-study ui-study-product"
            role="region"
            aria-label="StyBay product interface preview, scroll to explore"
            tabIndex={0}
          >
            <Image
              src={ui.product}
              alt="StyBay product preview showing details, retailer options, and similar products"
              width={413}
              height={1687}
              sizes="(max-width: 600px) 85vw, 360px"
            />
          </div>
          <span className="example-note">
            Product preview · scroll inside to explore
          </span>
        </div>
        <div className="feature-copy" data-reveal>
          <Label>05 / EXPLORE & COMPARE</Label>
          <h2>
            See the options
            <br />
            <em>before choosing.</em>
          </h2>
          <p>
            The product experience is designed to bring information and
            available alternatives into view before you continue to the original
            retailer.
          </p>
          <p>
            Prices and availability can change. The retailer’s site is the place
            to confirm the details before buying.
          </p>
        </div>
      </section>
      <section className="technology-phone-feature collection-feature section-pad">
        <div className="feature-copy" data-reveal>
          <Label>06 / COLLECTIONS</Label>
          <h2>
            Save a vibe.
            <br />
            <em>Not just a product.</em>
          </h2>
          <p>
            A collection can begin with a mood, an occasion, or a style you want
            to explore. We’re designing a way to keep those ideas together, and
            come back when the moment feels right.
          </p>
          <div className="collection-words">
            <span>Old Money</span>
            <span>Minimalist</span>
            <span>Tailored</span>
          </div>
        </div>
        <div className="interface-proof">
          <span className="proof-label">INTERFACE STUDY / SAVED IDEAS</span>
          <div
            className="ui-study ui-study-collection"
            role="region"
            aria-label="StyBay saved collection interface preview, scroll to explore"
            tabIndex={0}
          >
            <Image
              src={ui.collection}
              alt="StyBay collection preview with saved fashion products"
              width={413}
              height={864}
              sizes="(max-width: 600px) 85vw, 360px"
            />
          </div>
        </div>
      </section>
      <section
        className="technology-direction section-pad"
        id="technology-direction"
      >
        <Label>THE TECHNOLOGY DIRECTION</Label>
        <div className="direction-heading">
          <h2>
            Intelligent technology.
            <br />
            <em>Personal discovery.</em>
          </h2>
          <p>
            Fashion has a language.
            <br />
            And it isn’t only words.
          </p>
        </div>
        <div className="direction-copy">
          <p>
            StyBay is being developed to connect language with visual signals.
            Our goal is to interpret the style, mood, context, and aesthetic
            behind a search—and bring that intent closer to relevant products.
          </p>
          <p>
            We’re exploring multimodal techniques that combine textual and
            visual understanding for fashion search, similar-style discovery,
            and personalization. This is a direction in development, not a claim
            of finished technology.
          </p>
        </div>
        <StyleConstellation />
        <Link className="text-link" href="/about">
          The idea behind StyBay <span aria-hidden="true"><ArrowUpRight /></span>
        </Link>
      </section>
      <WaitlistCTA />
    </PageShell>
  );
}
