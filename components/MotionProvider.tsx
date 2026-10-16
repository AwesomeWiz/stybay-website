"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
export default function MotionProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 0.85,
        smoothWheel: true,
        anchors: { offset: -90 },
      });
      lenis.on("scroll", ScrollTrigger.update);
      // A cross-route hash can be positioned before the delayed hero pin adds
      // its space. Settle that initial anchor once, after the pin is ready.
      const initialHash =
        window.location.pathname === "/" ? window.location.hash : "";
      let anchorFrame = 0;
      const settleInitialAnchor = () => {
        if (
          !initialHash ||
          window.location.hash !== initialHash ||
          !document.querySelector(".pin-spacer > .hero")
        )
          return;
        cancelAnimationFrame(anchorFrame);
        anchorFrame = requestAnimationFrame(() => {
          anchorFrame = requestAnimationFrame(() => {
            ScrollTrigger.removeEventListener("refresh", settleInitialAnchor);
            if (window.location.hash !== initialHash) return;
            const target = document.getElementById(initialHash.slice(1));
            if (target) {
              lenis.resize();
              // A numeric target avoids applying scroll-padding twice.
              lenis.scrollTo(
                target.getBoundingClientRect().top + window.scrollY - 100,
                {
                  immediate: true,
                  force: true,
                },
              );
              ScrollTrigger.update();
            }
          });
        });
      };
      if (initialHash)
        ScrollTrigger.addEventListener("refresh", settleInitialAnchor);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
      });
      return () => {
        cancelAnimationFrame(anchorFrame);
        ScrollTrigger.removeEventListener("refresh", settleInitialAnchor);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
