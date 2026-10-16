"use client";
import { ArrowUpRight } from "@/components/ArrowIcons";

import { useState } from "react";
import { Label, ProductImage } from "../Primitives";
import { productPools } from "@/lib/productCatalog";
const relationships = [
  {
    label: "A warmer palette",
    description:
      "A chocolate palette brings warmth to another defined-waist, long silhouette.",
  },
  {
    label: "Shared palette",
    description: "A green direction, softened into sage and a longer line.",
  },
  {
    label: "A similar long line",
    description:
      "A navy column follows the long line, with a different neckline and an evening impression.",
  },
  {
    label: "A fuller silhouette",
    description:
      "A burgundy flare takes the evening mood in a more romantic direction.",
  },
  {
    label: "A bolder direction",
    description:
      "An asymmetric red silhouette brings a stronger colour and sharper line.",
  },
];
export default function SimilarStyles() {
  const [active, setActive] = useState(0);
  const [details, setDetails] = useState(false);
  return (
    <section
      className="visual-dna section-pad"
      id="similar-styles"
      aria-labelledby="visual-dna-title"
    >
      <div className="lab-caption">
        <Label>04 / SIMILAR STYLES · IN DEVELOPMENT</Label>
        <span>VISUAL STUDY / 02</span>
      </div>
      <div className="dna-heading">
        <h2 id="visual-dna-title">
          Why this.
          <br />
          <em>And what feels like it?</em>
        </h2>
        <div>
          <h3>Found something you love? Keep exploring.</h3>
          <p>
            One interesting find should open up possibilities. We’re working
            toward easier similar-product and style discovery, from a familiar
            silhouette to a different detail.
          </p>
        </div>
      </div>
      <div className="dna-source">
        <div className="dna-source-note">
          <span className="eyebrow">THE STARTING POINT</span>
          <p>
            One piece.
            <br />
            Several ways
            <br />
            <em>of seeing.</em>
          </p>
          <button
            className="text-link"
            aria-expanded={details}
            aria-controls="dna-attributes"
            onClick={() => setDetails(!details)}
          >
            {details ? "Close visual notes" : "Read the visual details"}{" "}
            <span aria-hidden="true">{details ? "−" : "+"}</span>
          </button>
        </div>
        <figure>
          <ProductImage index={productPools.visualDNA[0]} />
        </figure>
        <dl className="dna-attributes" id="dna-attributes" hidden={!details}>
          <div>
            <dt>SILHOUETTE</dt>
            <dd>High neck, long line</dd>
          </div>
          <div>
            <dt>PALETTE</dt>
            <dd>Forest green, brown accents</dd>
          </div>
          <div>
            <dt>STRUCTURE</dt>
            <dd>A defined, belted waist</dd>
          </div>
          <div>
            <dt>MOOD</dt>
            <dd>Understated tailoring</dd>
          </div>
        </dl>
      </div>
      <div
        className="dna-directions"
        role="group"
        aria-label="Explore an illustrative visual relationship"
      >
        {relationships.map((relationship, i) => (
          <button
            key={relationship.label}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <ProductImage index={productPools.visualDNA[i + 1]} />
            <span>
              {relationship.label}
              <span aria-hidden="true"><ArrowUpRight /></span>
            </span>
          </button>
        ))}
      </div>
      <p className="dna-relationship" aria-live="polite">
        <span className="dna-description" key={active}>
          {relationships[active].description}
        </span>
      </p>
      <p className="lab-disclaimer">
        Illustrative selection, not live recommendations.
      </p>
    </section>
  );
}
