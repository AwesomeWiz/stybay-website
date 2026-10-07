"use client";
import { useEffect, useState } from "react";
import { Brand, CTA } from "./Primitives";
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header className={"header " + (scrolled ? "is-scrolled" : "")}>
      <a href="#" aria-label="StyBay home">
        <Brand />
      </a>
      <nav aria-label="Main navigation">
        <a href="#experience">The experience</a>
        <a href="#how-it-works">How it works</a>
      </nav>
      <CTA />
    </header>
  );
}
