"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label } from "../Primitives";
export default function Purpose() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.timeline({scrollTrigger:{trigger:".vision-copy", start:"top 80%", end:"top 35%", scrub:0.6}}).to(".purpose-mission",{yPercent:-100,opacity:0,duration:1},0).fromTo(".purpose-vision",{yPercent:100,opacity:0},{yPercent:0,opacity:1,duration:1},0);
      }, ref);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return <section className="purpose section-pad" ref={ref}>
    <div className="purpose-side" aria-hidden="true"><span>OUR REASON. OUR HORIZON.</span><div className="purpose-word"><span className="purpose-mission">Mission.</span><span className="purpose-vision">Vision.</span></div></div>
    <div className="purpose-copy"><article><Label>03 / OUR MISSION</Label><h2>Make discovery<br/><em>feel natural.</em></h2><p>To simplify fashion discovery by bringing products from across retailers into a more intuitive, personal, and accessible experience.</p></article><article className="vision-copy"><Label>04 / OUR VISION</Label><h2>Style without<br/><em>store boundaries.</em></h2><p>A future where finding fashion feels as natural as expressing your style. Where you can explore beyond stores and brands, and discover what feels like you.</p></article></div>
  </section>;
}
