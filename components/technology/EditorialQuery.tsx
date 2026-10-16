"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productPools } from "@/lib/productCatalog";
import { ProductImage } from "../Primitives";
export default function EditorialQuery() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".query-emphasis",
          { color: "#6a6965" },
          {
            color: "#08758f",
            stagger: 0.16,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 75%",
              end: "center 45%",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          ".query-study-image",
          { y: (i) => (i % 2 ? 32 : -20), opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 65%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          },
        );
      }, ref);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return (
    <div className="editorial-query section-pad" ref={ref}>
      <div className="query-margin">
        <span>AN IDEA, BEFORE A KEYWORD.</span>
        <span>Search the way you think.</span>
      </div>
      <blockquote>
        “Something <em className="query-emphasis">effortless</em>
        <br />
        for a <em className="query-emphasis">warm</em>{" "}
        <em className="query-emphasis">evening.</em>”
      </blockquote>
      <div className="query-study">
        <figure className="query-study-image">
          <ProductImage index={productPools.technologyQuery[0]} />
          <figcaption>
            A flowing line.
            <br />
            An earthy palette.
            <br />
            An understated mood.
          </figcaption>
        </figure>
      </div>
      <p className="lab-disclaimer">
        An illustrative interpretation of an idea, rather than a live search
        result.
      </p>
    </div>
  );
}
