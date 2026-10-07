"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { brand, products } from "@/lib/assets";
export default function IntroSequence() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("stybay-intro") === "1";
    } catch {}
    if (seen) return;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(".intro-tile");
      gsap.set(ref.current, { autoAlpha: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("stybay-intro", "1");
          } catch {}
        },
      });
      tl.fromTo(
        tiles,
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 0.24, stagger: 0.035 },
      );
      tiles.forEach((tile, i) => {
        const img = tile.querySelector("img");
        for (let step = 0; step < 5; step++)
          tl.call(
            () => {
              if (img) img.src = products[(i * 3 + step * 7) % 20].src;
            },
            [],
            0.06 + i * 0.017 + step * (0.073 + i * 0.003),
          );
      });
      tl.to(tiles, { scale: 1.07, duration: 0.3, stagger: 0.012 }, 0.7)
        .to(
          tiles,
          {
            x: (i) => (i % 2 ? -50 : 50),
            opacity: 0,
            scale: 0.65,
            stagger: 0.025,
            duration: 0.48,
          },
          1.15,
        )
        .fromTo(
          ".intro-mark",
          { scale: 0.65, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45 },
          1.45,
        )
        .to(
          ref.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.6,
            ease: "power3.inOut",
          },
          1.85,
        )
        .set(ref.current, { autoAlpha: 0 });
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
            style={{ transform: "rotate(" + ((i % 3) - 1) * 3 + "deg)" }}
          >
            <Image src={p.src} alt="" width={180} height={270} sizes="160px" />
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
