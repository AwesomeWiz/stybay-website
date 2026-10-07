"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductImage, CTA, Label, Phone } from "./Primitives";
import { ui } from "@/lib/assets";

const selection = [8, 3, 1, 17, 9, 14, 10, 18];

export default function HeroDiscovery() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const stage = ref.current;
    if (!stage) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const heroCopy = stage.querySelector(".hero-copy");
      const heroTiles =
        gsap.utils.toArray<HTMLElement>(".hero-tile");
      const heroBottom = stage.querySelector(".hero-bottom");

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * HERO ENTRANCE
       */

      if (!reducedMotion) {
        gsap.set(heroCopy, {
          autoAlpha: 0,
          y: 28,
        });

        gsap.set(heroTiles, {
          autoAlpha: 0,
          y: 22,
          scale: 0.96,
        });

        gsap.set(heroBottom, {
          autoAlpha: 0,
          y: 12,
        });
      }

      const revealHero = () => {
        if (reducedMotion) {
          gsap.set(
            [heroCopy, heroTiles, heroBottom],
            {
              clearProps: "opacity,visibility,transform",
            },
          );
          return;
        }

        const entrance = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        // Product imagery appears first
        entrance.to(heroTiles, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: {
            each: 0.055,
            from: "random",
          },
        });

        // Main copy settles in
        entrance.to(
          heroCopy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
          },
          "-=0.52",
        );

        // Bottom editorial line appears last
        entrance.to(
          heroBottom,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.35",
        );
      };

      /*
       * Wait for intro before revealing hero.
       */

      let introAlreadySeen = false;

      try {
        introAlreadySeen =
          sessionStorage.getItem("stybay-intro") === "1";
      } catch {}

      if (introAlreadySeen || reducedMotion) {
        requestAnimationFrame(revealHero);
      } else {
        window.addEventListener(
          "stybay:intro-complete",
          revealHero,
          { once: true },
        );
      }

      /*
       * EXISTING HERO SCROLL ANIMATION
       */

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const tiles = gsap.utils
            .toArray<HTMLElement>(".hero-tile")
            .filter((tile) => tile.offsetWidth > 0);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () =>
                "+=" +
                window.innerHeight *
                  (window.innerWidth < 700
                    ? 0.8
                    : 1.15),

              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            ".hero-copy",
            {
              autoAlpha: 0,
              y: -50,
              duration: 0.22,
            },
            0,
          ).to(
            ".hero-bottom",
            {
              opacity: 0,
              duration: 0.15,
            },
            0,
          );

          tiles.forEach((tile, i) => {
            tl.to(
              tile,
              {
                x: () => {
                  const s =
                    stage.getBoundingClientRect();

                  const r =
                    tile.getBoundingClientRect();

                  return (
                    s.width / 2 +
                    (i % 2 ? 67 : -67) -
                    (r.left -
                      s.left +
                      r.width / 2)
                  );
                },

                y: () => {
                  const s =
                    stage.getBoundingClientRect();

                  const r =
                    tile.getBoundingClientRect();

                  return (
                    s.height / 2 +
                    (Math.floor(i / 2) - 1.5) *
                      126 -
                    (r.top -
                      s.top +
                      r.height / 2)
                  );
                },

                scale: () =>
                  126 / tile.offsetWidth,

                rotation: 0,
                duration: 0.52,
                ease: "power2.inOut",
              },
              0.04,
            );
          });

          tl.fromTo(
            ".hero-device",
            {
              opacity: 0,
              scale: 1.04,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.2,
            },
            0.49,
          )
            .to(
              tiles,
              {
                opacity: 0,
                duration: 0.15,
              },
              0.66,
            )

            .fromTo(
              ".hero-device img",
              {
                opacity: 0,
              },
              {
                opacity: 1,
                duration: 0.2,
              },
              0.65,
            )

            .fromTo(
              ".hero-resolution",
              {
                opacity: 0,
                y: 24,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.2,
              },
              0.78,
            )

            .to({}, { duration: 0.15 });
        },
      );

      return () => {
        window.removeEventListener(
          "stybay:intro-complete",
          revealHero,
        );
      };
    }, ref);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      className="hero"
      ref={ref}
      aria-labelledby="hero-title"
    >
      <div
        className="hero-field"
        aria-hidden="true"
      >
        {selection.map((n, i) => (
          <div
            className={`hero-tile tile-${i}`}
            key={n}
          >
            <ProductImage
              index={n}
              priority={i < 4}
              decorative
            />

            <span className="tile-tag">
              {
                [
                  "A little romantic",
                  "Something unexpected",
                  "Your kind of green",
                  "Simply you",
                ][i % 4]
              }
            </span>
          </div>
        ))}
      </div>

      <div className="hero-copy">
        <Label>
          A WORLD OF STYLE. YOUR POINT OF VIEW.
        </Label>

        <h1 id="hero-title">
          Find what
          <br />
          feels like <em>you.</em>
        </h1>

        <p>
          Fashion from across the web,
          <br className="mobile-break" /> shaped
          into one discovery feed.
        </p>

        <div className="hero-actions">
          <CTA />
          <span className="coming">
            Coming soon
          </span>
        </div>
      </div>

      <div className="hero-device">
        <Phone
          src={ui.home}
          alt="StyBay personalized discovery feed"
        />
      </div>

      <div className="hero-resolution">
        <span className="eyebrow">
          ALL THAT POSSIBILITY.
        </span>

        <h2>
          One feed.
          <br />
          Entirely you.
        </h2>
      </div>

      <div className="hero-bottom">
        <span>
          LESS SEARCHING. MORE FINDING.
        </span>

        <a href="#experience">
          SCROLL TO DISCOVER{" "}
          <span aria-hidden="true">↓</span>
        </a>

        <span>
          FASHION, PERFECTLY FOUND.
        </span>
      </div>
    </section>
  );
}