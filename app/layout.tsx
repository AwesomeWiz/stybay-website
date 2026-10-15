import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "StyBay — Fashion, Perfectly Found";

const description =
  "Discover fashion from across the web in one visual, personalized feed. Search, save and find styles that feel like you. StyBay is coming soon.";

const origin =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stybay.com";

export const metadata: Metadata = {
  metadataBase: new URL(origin),

  title,
  description,

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/assets/logo_emblem.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/logo_emblem.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title,
    description,
    type: "website",
    siteName: "StyBay",
    url: origin,
    images: [
      {
        url: "/assets/full_logo.png",
        alt: "StyBay",
      },
    ],
  },

  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF9F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StyBay",
              url: origin,
              description,
            }).replace(/</g, "\u003c"),
          }}
        />
      </body>
    </html>
  );
}