"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label, ProductImage } from "../Primitives";
import { productPools } from "@/lib/productCatalog";
export default function DiscoveryStory() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(".gather-tile", { x: (i) => (i % 2 ? 1 : -1) * (window.innerWidth < 700 ? 18 : 65), y: (i) => [35, -35, 15, -15][i], rotation: (i) => [-9, 6, 8, -5][i] }, { x: 0, y: 0, rotation: 0, stagger: 0.04, ease: "power1.inOut", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "center 45%", scrub: 0.8 } });
        gsap.from(".gather-boundary", { opacity: 0, scale: 1.08, scrollTrigger: { trigger: ref.current, start: "top 65%", end: "center 45%", scrub: 0.8 } });
      }, ref);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section className="discovery-story section-pad" ref={ref}>
    <div className="discovery-story-copy"><Label>02 / A DIFFERENT STARTING POINT</Label><h2>Fashion is everywhere.<br/>Finding the right thing<br/><em>isn’t.</em></h2><p>Another store. The same search. A few more tabs. Finding a look can become a routine of scrolling, comparing, and starting again.</p><p>We’re starting somewhere else: your taste, your mood, the occasion, or a little inspiration.</p><span className="story-question">What feels like you?</span></div>
    <div className="gather-scene"><div className="gather-boundary" aria-hidden="true"/><div className="gather-grid">{productPools.aboutStory.map(n => <figure className="gather-tile" key={n}><ProductImage index={n}/></figure>)}</div><span className="gather-caption">MANY POSSIBILITIES. ONE POINT OF VIEW.</span></div>
  </section>;
}
