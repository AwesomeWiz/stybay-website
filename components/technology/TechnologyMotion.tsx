"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Motion only: existing markup, controls, and illustration state remain owners
 * of their layout. Inner frames animate so ranking transforms never compete. */
export default function TechnologyMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".technology-page");
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        compact: "(max-width: 700px)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const compact = context.conditions.compact;
        const scope = gsap.context(() => {
          gsap.from(".technology-hero-art > .product-frame", {
            opacity: 0.2,
            y: compact ? 8 : 14,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "opacity,transform",
          });
          gsap.to(".technology-hero-art", {
            y: compact ? -8 : -20,
            ease: "none",
            scrollTrigger: {
              trigger: ".technology-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          gsap.utils
            .toArray<HTMLElement>(
              ".feature-introduction h2,.taste-lab-heading h2,.dna-heading h2",
            )
            .forEach((heading) => {
              gsap.from(heading, {
                x: compact ? -6 : -12,
                opacity: 0.35,
                duration: 0.65,
                ease: "power2.out",
                clearProps: "opacity,transform",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 90%",
                  once: true,
                },
              });
            });
          gsap.from(
            compact
              ? ".taste-product.is-in-mobile-edit > .product-frame"
              : ".taste-product.is-in-edit > .product-frame",
            {
              y: compact ? 8 : 16,
              opacity: 0.35,
              duration: 0.6,
              stagger: 0.045,
              ease: "power2.out",
              clearProps: "opacity,transform",
              scrollTrigger: {
                trigger: ".taste-board",
                start: "top 88%",
                once: true,
              },
            },
          );
          gsap.from(".store-composition figure", {
            x: compact ? 6 : 14,
            opacity: 0.4,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ".store-composition",
              start: "top 85%",
              once: true,
            },
          });
          gsap.from(".dna-directions button", {
            y: compact ? 8 : 14,
            opacity: 0.35,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ".dna-directions",
              start: "top 88%",
              once: true,
            },
          });
          gsap.from(".constellation-item > .product-frame", {
            opacity: 0.25,
            duration: 0.6,
            stagger: { each: compact ? 0.035 : 0.02, from: "center" },
            clearProps: "opacity",
            scrollTrigger: {
              trigger: ".constellation-stage",
              start: "top 88%",
              once: true,
            },
          });
        }, root);
        return () => scope.revert();
      },
    );
    return () => media.revert();
  }, []);
  return null;
}
