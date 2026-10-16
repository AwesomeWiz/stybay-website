import Image from "next/image";
import Link from "next/link";
import { products, brand } from "@/lib/assets";
export function ProductImage({
  index,
  className = "",
  priority = false,
  decorative = false,
}: {
  index: number;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const p = products[index];
  return (
    <span className={`product-frame ${className}`} data-product-id={p.id}>
      <Image
        src={p.src}
        alt={decorative ? "" : p.alt}
        fill
        preload={priority}
        style={{ objectFit: "contain" }}
        sizes="(max-width: 600px) 40vw, 24vw"
      />
    </span>
  );
}
export function Brand({ className = "" }: { className?: string }) {
  return (
    <Image
      className={className}
      src={brand.logo}
      alt="StyBay"
      width={1964}
      height={545}
      priority
      sizes="140px"
    />
  );
}
export function CTA({
  children = "Get early access",
  className = "",
  href = "#early-access",
}: {
  children?: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const content = (
    <>
      {children}
      <span className="cta-dot" aria-hidden="true" />
    </>
  );
  if (href.startsWith("https://"))
    return (
      <a
        className={"cta " + className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  return (
    <Link className={"cta " + className} href={href}>
      {content}
    </Link>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Phone({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={"phone " + className}
      tabIndex={src.includes("/product.webp") ? 0 : undefined}
      role={src.includes("/product.webp") ? "region" : undefined}
      aria-label={
        src.includes("/product.webp")
          ? "Product details preview. Scroll to explore."
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        width={413}
        height={src.includes("/product.webp") ? 1687 : 864}
        sizes="(max-width: 600px) 70vw, 310px"
      />
    </div>
  );
}
