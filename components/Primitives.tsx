import Image from "next/image";
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
    <Image
      className={className}
      src={p.src}
      alt={decorative ? "" : p.alt}
      width={p.width}
      height={p.height}
      priority={priority}
      sizes="(max-width: 600px) 40vw, 24vw"
    />
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
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a className={"cta " + className} href="#early-access">
      {children}
      <span className="cta-dot" aria-hidden="true" />
    </a>
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
