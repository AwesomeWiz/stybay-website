import Link from "next/link";
import PageShell from "./PageShell";
import { Label } from "./Primitives";
import { readLegalDocument, type LegalBlock } from "@/lib/legal";

function Text({ value }: {value: string}) {
  return value.split(/(https:\/\/stybay\.com(?:\/[a-z-]+)?)/g).map((part, index) => part.startsWith("https://stybay.com") ? <Link key={index} href={part.slice("https://stybay.com".length) || "/"}>{part}</Link> : part);
}
function Blocks({ blocks }: {blocks: LegalBlock[]}) {
  return blocks.map((block,index) => block.type === "list" ? <ul key={index}>{block.lines.map((line,i)=><li key={i}><Text value={line}/></li>)}</ul> : block.type === "subheading" ? <h3 key={index}>{block.lines.join("\n")}</h3> : <p key={index}><Text value={block.lines.join("\n")}/></p>);
}
export default function LegalDocument({ slug }: {slug: "privacy-policy" | "terms"}) {
  const document = readLegalDocument(slug);
  return <PageShell className="legal-page" motion={false}>
    <header className="legal-heading section-pad"><Label>STYBAY / LEGAL</Label><h1>{document.title}</h1><div className="legal-dates">{document.dates.map(date=><p key={date}>{date}</p>)}</div></header>
    <div className="legal-layout section-pad"><aside className="legal-contents"><nav aria-label={`${document.title} sections`}><span className="eyebrow">ON THIS PAGE</span>{document.sections.map(section=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><Link className="text-link" href={slug === "terms" ? "/privacy-policy" : "/terms"}>{slug === "terms" ? "Privacy Policy" : "Terms of Use"}</Link></aside><article className="legal-body" aria-label={document.title}><Blocks blocks={document.introduction}/>{document.sections.map(section=><section id={section.id} key={section.id}><h2>{section.title}</h2><Blocks blocks={section.blocks}/></section>)}</article></div>
  </PageShell>;
}
