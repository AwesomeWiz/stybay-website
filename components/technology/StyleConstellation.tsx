"use client";
import { useState, type CSSProperties } from "react";
import {
  productCatalog,
  productPools,
  styleConcepts,
  type StyleConcept,
} from "@/lib/productCatalog";
import { ProductImage } from "../Primitives";

const pool = productPools.constellation;
function orderFor(active: StyleConcept | null, edit: number[]) {
  return [...edit].sort(
    (a, b) =>
      Number(active && productCatalog[b].concepts.includes(active)) -
      Number(active && productCatalog[a].concepts.includes(active)),
  );
}
export default function StyleConstellation() {
  const [active, setActive] = useState<StyleConcept | null>(null);
  const order = orderFor(active, pool),
    mobileOrder = orderFor(active, pool.slice(0, 12));
  return (
    <div className="constellation" aria-labelledby="constellation-title">
      <div className="lab-caption">
        <span>VISUAL STUDY / 03</span>
        <span>Overlapping ideas</span>
      </div>
      <h3 id="constellation-title">
        Style isn’t
        <br />
        <em>one dimension.</em>
      </h3>
      <div
        className="constellation-controls"
        role="group"
        aria-label="Explore a visual style concept"
      >
        <button
          aria-pressed={!active}
          onClick={() => setActive(null)}
          onFocus={() => setActive(null)}
          onPointerMove={(event) => {
            if (event.pointerType === "mouse") setActive(null);
          }}
        >
          All ideas
        </button>
        {styleConcepts.map((concept) => (
          <button
            key={concept}
            aria-pressed={active === concept}
            onClick={() => setActive(concept)}
            onFocus={() => setActive(concept)}
            onPointerMove={(event) => {
              if (event.pointerType === "mouse") setActive(concept);
            }}
          >
            {concept}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {active
          ? `${active} is in focus. Other ideas remain visible for context.`
          : "All visual ideas are in view."}
      </p>
      <div className="constellation-stage">
        {pool.map((index, position) => {
          const rank = order.indexOf(index),
            mobileRank = mobileOrder.indexOf(index);
          const relevant =
            !active || productCatalog[index].concepts.includes(active);
          return (
            <figure
              key={index}
              className={`constellation-item ${position >= 12 ? "desktop-edit" : ""} ${relevant ? "is-relevant" : "is-receding"}`}
              style={
                {
                  "--dx": (rank % 6) - (position % 6),
                  "--dy": Math.floor(rank / 6) - Math.floor(position / 6),
                  "--mx": (mobileRank % 3) - (position % 3),
                  "--my": Math.floor(mobileRank / 3) - Math.floor(position / 3),
                  "--tilt": `${[0, -3, 2, 0, 3, -2][position % 6]}deg`,
                } as CSSProperties
              }
            >
              <ProductImage index={index} />
            </figure>
          );
        })}
      </div>
      <p className="lab-disclaimer">
        An illustrative view of how fashion can be understood through
        overlapping visual ideas.
      </p>
    </div>
  );
}
