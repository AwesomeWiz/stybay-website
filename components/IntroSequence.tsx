"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { brand, products } from "@/lib/assets";

export default function IntroSequence() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finishIntro = () => {
      window.dispatchEvent(new Event("stybay:intro-complete"));
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let seen = false;

    try {
      seen = sessionStorage.getItem("stybay-intro") === "1";
    } catch {}

    // Skip intro for reduced motion or repeat visits
    if (reducedMotion || seen) {
      gsap.set(ref.current, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      requestAnimationFrame(finishIntro);
      return;
    }

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(".intro-tile");

      gsap.set(ref.current, {
        autoAlpha: 1,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("stybay-intro", "1");
          } catch {}

          finishIntro();
        },
      });

      // Tiles enter
      tl.fromTo(
        tiles,
        {
          opacity: 0,
          scale: 0.72,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.055,
          ease: "power2.out",
        },
      );

      // Product shuffle
      tiles.forEach((tile, i) => {
        const img = tile.querySelector("img");

        for (let step = 0; step < 5; step++) {
          tl.call(
            () => {
              if (img) {
                img.src =
                  products[(i * 3 + step * 7) % products.length].src;
              }
            },
            [],
            0.12 + i * 0.025 + step * (0.12 + i * 0.002),
          );
        }
      });

      // Fashion field settles
      tl.to(
        tiles,
        {
          scale: 1.045,
          duration: 0.55,
          stagger: 0.018,
          ease: "power1.inOut",
        },
        1.3,
      )

        // Products clear
        .to(
          tiles,
          {
            x: (i) => (i % 2 ? -60 : 60),
            y: (i) => ((i % 3) - 1) * 18,
            opacity: 0,
            scale: 0.72,
            stagger: 0.035,
            duration: 0.7,
            ease: "power3.inOut",
          },
          1.9,
        )

        // StyBay mark appears
        .fromTo(
          ".intro-mark",
          {
            scale: 0.72,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          2.4,
        )

        // Brief logo hold
        .to({}, { duration: 0.4 })

        // Gently reveal the website underneath
.to(
  ref.current,
  {
    backgroundColor: "rgba(250, 249, 246, 0)",
    duration: 0.7,
    ease: "power2.inOut",
  },
  3.15,
)

// Keep the mark visible during the reveal,
// then softly release it
.to(
  ".intro-mark",
  {
    opacity: 0,
    scale: 0.96,
    y: -4,
    duration: 0.45,
    ease: "power2.out",
  },
  3.55,
)

// Remove intro completely
.set(ref.current, {
  autoAlpha: 0,
  pointerEvents: "none",
});
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro-field">
        {products.slice(0, 12).map((p, i) => (
          <div
            className="intro-tile"
            key={p.id}
            style={{
              transform: `rotate(${((i % 3) - 1) * 3}deg)`,
            }}
          >
            <Image
              src={p.src}
              alt=""
              width={180}
              height={270}
              sizes="160px"
            />
          </div>
        ))}
      </div>

      <Image
        className="intro-mark"
        src={brand.emblemSvg}
        alt=""
        width={90}
        height={90}
        priority
      />
    </div>
  );
}