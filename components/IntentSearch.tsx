"use client";
import { useEffect, useRef, useState } from "react";
import { Label, ProductImage } from "./Primitives";
const examples = [
  {
    query: "black dress for summer",
    tokens: ["BLACK", "DRESS", "SUMMER"],
    items: [5, 7, 16],
  },
  {
    query: "something blue for the weekend",
    tokens: ["BLUE", "RELAXED", "WEEKEND"],
    items: [3, 13, 19],
  },
  {
    query: "minimal outfit for dinner",
    tokens: ["MINIMAL", "DRESS", "DINNER"],
    items: [17, 4, 10],
  },
  {
    query: "a little floral, a little romantic",
    tokens: ["FLORAL", "SOFT", "ROMANTIC"],
    items: [0, 8, 14],
  },
];
export default function IntentSearch() {
  const [selected, setSelected] = useState(0);
  const [typed, setTyped] = useState(examples[0].query);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const selectedRef = useRef(0);
  useEffect(() => {
    if (
      !playing ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let timer: ReturnType<typeof setTimeout>;
    let visible = false;
    let index = selectedRef.current;
    const cycle = () => {
      if (!visible) return;
      index = (index + 1) % examples.length;
      setSelected(index);
      selectedRef.current = index;
      let pos = 0;
      setTyped("");
      const type = () => {
        if (!visible) return;
        pos++;
        setTyped(examples[index].query.slice(0, pos));
        timer = setTimeout(
          pos < examples[index].query.length ? type : cycle,
          pos < examples[index].query.length ? 65 : 2600,
        );
      };
      timer = setTimeout(type, 65);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        clearTimeout(timer);
        if (visible) timer = setTimeout(cycle, 3400);
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current!);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [playing]); // Selection is deliberately captured when playback is started.
  const choose = (i: number) => {
    setPlaying(false);
    setSelected(i);
    selectedRef.current = i;
    setTyped(examples[i].query);
  };
  return (
    <section className="intent section-pad" ref={ref}>
      <div className="section-top">
        <Label>04 / YOUR WORDS. YOUR WORLD.</Label>
        <span className="small-note">A preview of intent-based discovery</span>
      </div>
      <div className="intent-heading" data-reveal>
        <h2>
          Search the way
          <br />
          you <em>think.</em>
        </h2>
        <p>
          You don’t need the perfect keyword.
          <br />
          Just somewhere to start.
        </p>
      </div>
      <div className="search-demo">
        <div className="demo-query">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <span aria-hidden="true">
            {typed}
            <i className="typing-caret" />
          </span>
          <button
            onClick={() => setPlaying(!playing)}
            aria-label={
              playing ? "Pause search animation" : "Play search animation"
            }
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div className="search-presets" aria-label="Example searches">
          {examples.map((ex, i) => (
            <button
              key={ex.query}
              onClick={() => choose(i)}
              aria-pressed={selected === i}
            >
              {ex.query}
            </button>
          ))}
        </div>
        <div
          className="search-results"
          aria-label={"Illustrative results for " + examples[selected].query}
        >
          <div className="intent-tokens">
            <span className="eyebrow">A THOUGHT, TAKING SHAPE</span>
            <div>
              {examples[selected].tokens.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <p>
              A few possibilities.
              <br />A whole new direction.
            </p>
            <span className="demo-disclosure">
              Illustrative discovery preview.
              <br />
              StyBay is coming soon.
            </span>
          </div>
          {examples[selected].items.map((n) => (
            <figure key={n}>
              <ProductImage index={n} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
