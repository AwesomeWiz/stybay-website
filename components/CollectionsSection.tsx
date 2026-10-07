"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label, ProductImage, Phone } from "./Primitives";
import { ui } from "@/lib/assets";
export default function CollectionsSection() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".collection-card", {
          x: (i) => (i % 2 ? 75 : -75),
          y: 80,
          rotation: (i) => (i % 2 ? 12 : -12),
          opacity: 0.3,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "center 55%",
            scrub: 1,
          },
        });
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="collections section-pad" ref={ref}>
      <div className="collection-heading" data-reveal>
        <Label>05 / KEEP THE FEELING</Label>
        <h2>
          Save a vibe,
          <br />
          not just <em>a product.</em>
        </h2>
        <p>
          A quieter wardrobe. A weekend away.
          <br />
          That version of you you’re still figuring out.
          <br />
          Make a little space for all of it.
        </p>
      </div>
      <div className="collection-scene">
        <div className="collection-card collection-left">
          <ProductImage index={15} />
          <span>Quiet confidence</span>
        </div>
        <Phone
          src={ui.profile}
          alt="StyBay profile showing Old Money, Minimalist, and Tailored collections"
        />
        <div className="collection-card collection-right">
          <ProductImage index={10} />
          <span>Somewhere sunny</span>
        </div>
        <div className="collection-label">
          <span>YOUR STYLE, COLLECTED.</span>
          <span>For now. For later. For you.</span>
        </div>
      </div>
    </section>
  );
}
