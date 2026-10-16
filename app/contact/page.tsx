import { ArrowUpRight } from "@/components/ArrowIcons";
import PageShell from "@/components/PageShell";
import WaitlistCTA from "@/components/WaitlistCTA";
import { Label, ProductImage } from "@/components/Primitives";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("Contact StyBay", "Connect with StyBay Technologies in Kerala, India. Find our location at Rajagiri ORBIIT and follow the next chapter of fashion discovery.", "/contact");
export default function ContactPage() {
  return <PageShell className="contact-page" motion={false}>
    <section className="editorial-hero contact-hero section-pad"><Label>LET’S TALK.</Label><h1>Ideas, questions,<br/>or something<br/><em>worth sharing?</em></h1><div className="contact-email">{site.contactEmail?<a className="text-link" href={`mailto:${site.contactEmail}`}>{site.contactEmail}<span aria-hidden="true"><ArrowUpRight /></span></a>:<p>Our public email will be shared here soon.<br/>For launch updates, join the StyBay waitlist.</p>}</div><figure className="contact-fragment"><ProductImage index={10} priority decorative/></figure></section>
    <section className="contact-location section-pad"><Label>STYBAY TECHNOLOGIES</Label><div><h2>Rooted in Kerala.<br/><em>Looking everywhere.</em></h2><address>Rajagiri ORBIIT<br/>Rajagiri School of Engineering &amp; Technology<br/>Kakkanad, Kerala 682039<br/>India</address><span className="location-caption">KERALA, INDIA / OUR STARTING POINT</span></div></section>
    <WaitlistCTA/>
  </PageShell>;
}
