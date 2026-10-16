"use client";
import { ArrowLeftRight } from "@/components/ArrowIcons";

import { useState, type CSSProperties } from "react";
import {
  productPools,
  rankByPreferences,
  type PreferenceVector,
} from "@/lib/productCatalog";
import { Label, ProductImage } from "../Primitives";
const dimensions = [
  { id: "expression", from: "Minimal", to: "Expressive" },
  { id: "structure", from: "Relaxed", to: "Structured" },
  { id: "palette", from: "Neutral", to: "Colourful" },
];
export default function TasteLab() {
  const [preference, setPreference] = useState<PreferenceVector>([1, 2, 1]);
  const order = rankByPreferences(productPools.tasteLab, preference);
  const describe = (axis: number) =>
    preference[axis] === 2
      ? "Balanced"
      : `${preference[axis] < 2 ? dimensions[axis].from : dimensions[axis].to}${preference[axis] === 0 || preference[axis] === 4 ? " focus" : " leaning"}`;
  return (
    <section
      className="taste-lab section-pad"
      aria-labelledby="taste-lab-title"
    >
      <div className="lab-caption">
        <Label>02 / PERSONALIZED DISCOVERY</Label>
        <span>VISUAL STUDY / 01</span>
      </div>
      <div className="taste-lab-heading">
        <h2 id="taste-lab-title">
          Your style doesn’t
          <br />
          fit in <em>a dropdown.</em>
        </h2>
        <div>
          <h3>A feed shaped around you.</h3>
          <p>
            The looks you explore. The searches you make. The pieces you save.
            StyBay is designed to help your next discovery feel closer to you.
          </p>
        </div>
      </div>
      <div
        className="taste-dimensions"
        role="group"
        aria-label="Illustrative style preferences"
      >
        {dimensions.map((dimension, axis) => (
          <div className="taste-dimension" key={dimension.id}>
            <label htmlFor={`taste-${dimension.id}`}>
              <span>{dimension.from}</span>
              <span aria-hidden="true"><ArrowLeftRight /></span>
              <span>{dimension.to}</span>
            </label>
            <input
              id={`taste-${dimension.id}`}
              type="range"
              min="0"
              max="4"
              step="1"
              value={preference[axis]}
              aria-label={`${dimension.from} to ${dimension.to}`}
              aria-valuetext={describe(axis)}
              style={
                { "--progress": `${preference[axis] * 25}%` } as CSSProperties
              }
              onChange={(event) =>
                setPreference(
                  (previous) =>
                    previous.map((value, i) =>
                      i === axis ? Number(event.target.value) : value,
                    ) as unknown as PreferenceVector,
                )
              }
            />
            <output htmlFor={`taste-${dimension.id}`}>{describe(axis)}</output>
          </div>
        ))}
      </div>
      <div className="taste-board" aria-label="Curated visual preference study">
        {productPools.tasteLab.map((index) => {
          const rank = order.indexOf(index);
          return (
            <figure
              key={index}
              className={`taste-product ${rank < 8 ? "is-in-edit" : ""} ${rank < 6 ? "is-in-mobile-edit" : ""}`}
              aria-hidden={rank >= 8}
              style={
                {
                  "--column": rank % 4,
                  "--row": Math.floor(rank / 4),
                  "--mcolumn": rank % 3,
                  "--mrow": Math.floor(rank / 3),
                  "--nudge": `${rank % 2 ? 14 : 0}px`,
                } as CSSProperties
              }
            >
              <ProductImage index={index} />
            </figure>
          );
        })}
      </div>
      <div className="taste-lab-note">
        <p>
          Style is rarely one label. Discovery becomes more interesting when
          preferences overlap.
        </p>
        <span className="lab-disclaimer">
          Illustrative product interaction · curated locally
        </span>
      </div>
    </section>
  );
}
