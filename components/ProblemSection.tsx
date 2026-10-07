"use client";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductImage, Label } from "./Primitives";
import { brand } from "@/lib/assets";
export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".browser-window",
          {
            x: (i) => (i === 0 ? -60 : i === 2 ? 60 : 0),
            rotation: (i) => (i - 1) * 9,
          },
          {
            x: 0,
            rotation: (i) => (i - 1) * 3,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "center 50%",
              scrub: 1,
            },
          },
        );
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="problem section-pad" id="experience" ref={ref}>
      <div className="section-top">
        <Label>01 / FROM EVERYWHERE, TO YOU</Label>
        <span className="small-note">A different way to discover</span>
      </div>
      <div className="problem-grid">
        <div data-reveal>
          <h2>
            Shopping shouldn’t
            <br />
            begin with
            <br />
            <em>ten tabs.</em>
          </h2>
          <p>
            A look in mind. A dozen places to check.
            <br />
            And somehow, nothing quite feels right.
          </p>
        </div>
        <div
          className="tabs-composition"
          aria-label="Products from separate store windows coming together in StyBay"
        >
          {[0, 12, 19].map((n, i) => (
            <div className={"browser-window window-" + i} key={n}>
              <div className="window-bar">
                <i />
                <i />
                <i />
                <span>Another open tab</span>
              </div>
              <ProductImage index={n} />
            </div>
          ))}
          <div className="one-place">
            <Image src={brand.emblemSvg} alt="" width={28} height={28} />
            <span>All your possibilities. One place.</span>
          </div>
        </div>
      </div>
      <div className="problem-resolution" data-reveal>
        <h3>
          One place to discover.
          <br />
          <span>Wherever it’s sold.</span>
        </h3>
        <div className="discovery-path">
          <span>Discover</span>
          <i />
          <span>Save</span>
          <i />
          <span>Shop</span>
        </div>
      </div>
    </section>
  );
}
