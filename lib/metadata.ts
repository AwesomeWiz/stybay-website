import type { Metadata } from "next";
import { site } from "./site";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: `${site.origin}${path}` },
    openGraph: { title, description, url: `${site.origin}${path}`, type: "website", siteName: "StyBay", images: [{ url: `${site.origin}/assets/full_logo.png`, alt: "StyBay" }] },
    twitter: { card: "summary", title, description },
  };
}
