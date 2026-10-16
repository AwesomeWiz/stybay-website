import LegalDocument from "@/components/LegalDocument";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("StyBay Privacy Policy", "Read how StyBay collects, uses, stores, and shares information across its website, waitlist, and developing fashion discovery services.", "/privacy-policy");
export default function PrivacyPage() { return <LegalDocument slug="privacy-policy"/>; }
