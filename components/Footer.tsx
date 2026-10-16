import Link from "next/link";
import { Brand } from "./Primitives";
import { navigation } from "@/lib/site";
export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-brand"><Link href="/" aria-label="StyBay home"><Brand /></Link><p>Fashion, perfectly found.</p></div>
    <nav aria-label="Footer navigation">
      {navigation.slice(1).map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      <Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link>
    </nav>
    <span className="footer-copyright">© {new Date().getFullYear()} StyBay</span>
  </footer>;
}
