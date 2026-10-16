import { ArrowUpRight } from "@/components/ArrowIcons";
import Link from "next/link";
import { Label } from "./Primitives";
export default function BrandBridge() {
  return <section className="brand-bridge section-pad">
    <Label>WHAT IS STYBAY?</Label>
    <div><h2>One place to discover<br/>what feels like <em>you.</em></h2><p>Fashion from across the web, brought into a visual discovery experience designed around your taste.</p>
    <div className="editorial-links"><Link className="text-link" href="/about">Why we’re building StyBay <span aria-hidden="true"><ArrowUpRight /></span></Link><Link className="text-link" href="/technology">See how discovery works <span aria-hidden="true"><ArrowUpRight /></span></Link></div></div>
  </section>;
}
