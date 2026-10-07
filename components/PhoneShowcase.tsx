"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Label, Phone } from "./Primitives";
import { ui } from "@/lib/assets";
const steps = [
  {
    label: "DISCOVER",
    title: "Your next find.\nAnd the one after.",
    copy: "A visual feed designed around your taste. Familiar favourites, unexpected finds, and a little room for something new.",
    src: ui.home,
    alt: "StyBay Home with a two-column personalized fashion feed",
  },
  {
    label: "SEARCH",
    title: "Start with a thought.\nFind a whole look.",
    copy: "A colour, a feeling, an occasion. Explore what you have in mind, even when you don’t have the exact words.",
    src: ui.search,
    alt: "StyBay Search with visual search and style exploration",
  },
  {
    label: "EXPLORE",
    title: "Look closer.\nKeep discovering.",
    copy: "Get the details, compare available options, and follow a find to something similar. When it feels right, visit the original store.",
    src: ui.product,
    alt: "StyBay product details, price comparison and similar products",
  },
  {
    label: "SAVE",
    title: "Good finds deserve\na place of their own.",
    copy: "Keep the pieces that catch your eye. Bring them together in collections for a mood, a moment, or your next chapter.",
    src: ui.collection,
    alt: "StyBay Old Money collection with saved fashion finds",
  },
];
export default function PhoneShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const panels = gsap.utils.toArray<HTMLElement>(".screen-layer");
          const show = (index: number) => {
            setActive(index);
            panels.forEach((panel, i) =>
              gsap.to(panel, {
                autoAlpha: i === index ? 1 : 0,
                y: i === index ? 0 : 16,
                duration: 0.45,
                overwrite: true,
              }),
            );
          };
          gsap.utils.toArray<HTMLElement>(".story-step").forEach((step, i) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top center",
              end: "bottom center",
              onEnter: () => show(i),
              onEnterBack: () => show(i),
            });
          });
          gsap.to(".screen-layer.long-screen img", {
            yPercent: -46,
            ease: "none",
            scrollTrigger: {
              trigger: ".story-step:nth-child(3)",
              start: "top 40%",
              end: "bottom 60%",
              scrub: 1,
            },
          });
        }, ref);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, []);
  return (
    <section className="showcase section-pad" id="how-it-works" ref={ref}>
      <div className="section-top">
        <Label>02 / MEET YOUR NEW DISCOVERY HABIT</Label>
        <span className="small-note">The StyBay experience</span>
      </div>
      <div className="showcase-grid">
        <div className="story-copy">
          {steps.map((step, i) => (
            <article className="story-step" key={step.label} id={"step-" + i}>
              <div className="step-kicker">
                <span>0{i + 1}</span>
                <Label>{step.label}</Label>
              </div>
              <h2>
                {step.title.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    <br />
                  </span>
                ))}
              </h2>
              <p>{step.copy}</p>
              <div className="mobile-phone">
                <Phone src={step.src} alt={step.alt} />
              </div>
            </article>
          ))}
        </div>
        <div className="phone-sticky">
          <div className="phone-halo" />
          <span className="phone-aside">DESIGNED AROUND YOUR TASTE</span>
          <div className="phone showcase-phone">
            {steps.map((step, i) => (
              <div
                className={"screen-layer " + (i === 2 ? "long-screen" : "")}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  visibility: i === 0 ? "visible" : "hidden",
                }}
                key={step.label}
              >
                <Image
                  src={step.src}
                  alt={step.alt}
                  width={413}
                  height={i === 2 ? 1687 : 864}
                  sizes="310px"
                />
              </div>
            ))}
          </div>
          <div className="phone-pagination" aria-label="Walkthrough chapters">
            {steps.map((s, i) => (
              <a
                key={s.label}
                href={"#step-" + i}
                className={i === active ? "active" : ""}
                aria-current={i === active ? "step" : undefined}
                aria-label={s.label}
              >
                <span />
              </a>
            ))}
          </div>
          <p className="screen-caption">A glimpse of what’s coming.</p>
        </div>
      </div>
    </section>
  );
}
