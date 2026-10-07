"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label, ProductImage } from "./Primitives";
const moods = [
  { name: "Soft & romantic", ids: [8, 14, 0, 19, 3, 17] },
  { name: "Quiet confidence", ids: [17, 10, 12, 15, 13, 9] },
  { name: "After dark", ids: [7, 4, 6, 16, 11, 18] },
];
export default function PersonalizationSection() {
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
        <Label>03 / A LITTLE MORE YOU, EVERY DAY</Label>
        <h2>
          It notices what
          <br />
          catches <em>your eye.</em>
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
