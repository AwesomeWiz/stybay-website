"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand, CTA } from "./Primitives";
import { navigation, site } from "@/lib/site";
function Navigation({ pathname }: { pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  const links = navigation.map(({ href, label }) => (
    <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
  ));
  return (
    <header ref={header} className={`header ${scrolled || pathname !== "/" || open ? "is-scrolled" : ""}`} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <Link href="/" aria-label="StyBay home"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <div className="header-actions">
        <CTA href={site.waitlist}>Join waitlist</CTA>
        <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
      </div>
      <nav className="mobile-navigation" id="mobile-navigation" aria-label="Mobile navigation" hidden={!open}>{links}<span className="menu-note">Fashion, perfectly found.</span></nav>
    </header>
  );
}
export default function Header() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}
