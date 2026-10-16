"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label, ProductImage } from "./Primitives";
import { productPools } from "@/lib/productCatalog";
const moods = [
  { name: "Soft & romantic", ids: productPools.homeMoods[0] },
  { name: "Quiet confidence", ids: productPools.homeMoods[1] },
  { name: "After dark", ids: productPools.homeMoods[2] },
];
export default function PersonalizationSection({ variant = "home" }: { variant?: "home" | "technology" }) {
  const [mood, setMood] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".taste-tile:nth-child(3n+2)",
          { y: 45 },
          {
            y: -35,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".taste-tile img",
        { opacity: 0.25, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.045,
          duration: 0.55,
          ease: "power2.out",
        },
      );
    }, grid);
    return () => ctx.revert();
  }, [mood]);
  return (
    <section className="personalization" ref={ref}>
      <div className="taste-copy">
        <Label>{variant === "home" ? "03 / A LITTLE MORE YOU, EVERY DAY" : "02 / PERSONALIZED DISCOVERY"}</Label>
        <h2>
          {variant === "home" ? <>It notices what<br/>catches <em>your eye.</em></> : <>A feed shaped<br/>around <em>you.</em></>}
        </h2>
        <p>
          The looks you explore. The searches you make.
          <br />
          The pieces you save. StyBay is designed to
          <br className="desktop-break" /> help your next discovery feel closer
          to you.
        </p>
        <div className="mood-selector" aria-label="Preview a style direction">
          {moods.map((m, i) => (
            <button
              key={m.name}
              aria-pressed={mood === i}
              onClick={() => setMood(i)}
            >
              {m.name}
            </button>
          ))}
        </div>
        <span className="taste-note">
          Explore a mood. See the possibilities shift.
        </span>
      </div>
      <div className="taste-grid" ref={grid}>
        {moods[mood].ids.map((n, i) => (
          <figure className="taste-tile" key={i}>
            <ProductImage index={n} />
            {i === 2 && (
              <figcaption>
                <span /> A little more your style
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <div className="taste-footer">
        <span>Your feed evolves as your taste does.</span>
        <span>STYLE ISN’T STATIC. NEITHER IS YOUR FEED.</span>
      </div>
    </section>
  );
}
