import { ArrowUpRight } from "@/components/ArrowIcons";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { Label } from "@/components/Primitives";
export default function NotFound() { return <PageShell className="not-found-page" motion={false}><section className="editorial-hero section-pad"><Label>404 / A LITTLE OFF THE BEATEN PATH</Label><h1>This one got<br/><em>away.</em></h1><p>The page you’re looking for couldn’t be found.</p><Link href="/" className="text-link">Back to discovering <span aria-hidden="true"><ArrowUpRight /></span></Link></section></PageShell>; }
