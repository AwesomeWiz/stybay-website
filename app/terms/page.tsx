import LegalDocument from "@/components/LegalDocument";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("StyBay Terms of Use", "Read the terms governing StyBay’s fashion discovery services, third-party retailer links, product information, and use of the platform.", "/terms");
export default function TermsPage() { return <LegalDocument slug="terms"/>; }
