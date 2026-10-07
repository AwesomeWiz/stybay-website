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

    const heroCopy = stage.querySelector<HTMLElement>(".hero-copy");
    const heroBottom = stage.querySelector<HTMLElement>(".hero-bottom");
    const heroDevice = stage.querySelector<HTMLElement>(".hero-device");
    const heroDeviceImage =
      stage.querySelector<HTMLElement>(".hero-device img");
    const heroResolution =
      stage.querySelector<HTMLElement>(".hero-resolution");

    const heroTiles =
      gsap.utils.toArray<HTMLElement>(".hero-tile");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let entranceTimeline: gsap.core.Timeline | null = null;
    let scrollTimeline: gsap.core.Timeline | null = null;
    let scrollInitialized = false;

    /*
     * INITIAL HERO STATE
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

    /*
     * SCROLL TRANSFORMATION
     *
     * IMPORTANT:
     * This gets created only AFTER the hero entrance finishes.
     *
     * That means GSAP records:
     *
     * hero-copy   = visible
     * hero-tiles  = visible
     * hero-bottom = visible
     *
     * as the starting state.
     *
     * Therefore scrolling back to the top restores them correctly.
     */

    const createScrollAnimation = () => {
      if (scrollInitialized || reducedMotion) return;

      scrollInitialized = true;

      const tiles = heroTiles.filter(
        (tile) => tile.offsetWidth > 0,
      );

      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,

          start: "top top",

          end: () =>
            "+=" +
            window.innerHeight *
              (window.innerWidth < 700 ? 0.8 : 1.15),

          scrub: 0.8,

          pin: true,

          invalidateOnRefresh: true,
        },
      });

      /*
       * Fade hero copy as scrolling begins
       */

      scrollTimeline
        .to(
          heroCopy,
          {
            autoAlpha: 0,
            y: -50,
            duration: 0.22,
          },
          0,
        )

        .to(
          heroBottom,
          {
            opacity: 0,
            y: -8,
            duration: 0.15,
          },
          0,
        );

      /*
       * Pull product cards toward the phone
       */

      tiles.forEach((tile, i) => {
        scrollTimeline!.to(
          tile,
          {
            x: () => {
              const stageRect =
                stage.getBoundingClientRect();

              const tileRect =
                tile.getBoundingClientRect();

              return (
                stageRect.width / 2 +
                (i % 2 ? 67 : -67) -
                (tileRect.left -
                  stageRect.left +
                  tileRect.width / 2)
              );
            },

            y: () => {
              const stageRect =
                stage.getBoundingClientRect();

              const tileRect =
                tile.getBoundingClientRect();

              return (
                stageRect.height / 2 +
                (Math.floor(i / 2) - 1.5) * 126 -
                (tileRect.top -
                  stageRect.top +
                  tileRect.height / 2)
              );
            },

            scale: () => 126 / tile.offsetWidth,

            rotation: 0,

            duration: 0.52,

            ease: "power2.inOut",
          },
          0.04,
        );
      });

      /*
       * Phone reveal
       */

      scrollTimeline
        .fromTo(
          heroDevice,
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

        /*
         * Product cards disappear into phone
         */

        .to(
          tiles,
          {
            opacity: 0,
            duration: 0.15,
          },
          0.66,
        )

        /*
         * Real StyBay UI appears
         */

        .fromTo(
          heroDeviceImage,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.2,
          },
          0.65,
        )

        /*
         * Resolution copy
         */

        .fromTo(
          heroResolution,
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

      /*
       * Refresh after animation creation so
       * ScrollTrigger calculates everything correctly.
       */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    /*
     * HERO ENTRANCE
     */

    const revealHero = () => {
      if (reducedMotion) {
        gsap.set(
          [heroCopy, heroTiles, heroBottom],
          {
            clearProps:
              "opacity,visibility,transform",
          },
        );

        return;
      }

      /*
       * Prevent accidental duplicate entrance calls
       */

      if (entranceTimeline) return;

      entranceTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },

        /*
         * Only create ScrollTrigger once hero
         * is fully visible.
         */
        onComplete: createScrollAnimation,
      });

      /*
       * Product imagery
       */

      entranceTimeline.to(heroTiles, {
        autoAlpha: 1,
        y: 0,
        scale: 1,

        duration: 0.75,

        stagger: {
          each: 0.055,
          from: "random",
        },
      });

      /*
       * Main hero copy
       */

      entranceTimeline.to(
        heroCopy,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.85,
        },
        "-=0.52",
      );

      /*
       * Bottom editorial text
       */

      entranceTimeline.to(
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
     * WAIT FOR INTRO
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
        {
          once: true,
        },
      );
    }

    /*
     * CLEANUP
     */

    return () => {
      window.removeEventListener(
        "stybay:intro-complete",
        revealHero,
      );

      entranceTimeline?.kill();

      if (scrollTimeline) {
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      }
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