import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

export type LegalBlock = { type: "paragraph" | "subheading" | "list"; lines: string[] };
export type LegalSection = { title: string; id: string; blocks: LegalBlock[] };
/** Presentation-only parser for the approved plain-text Markdown documents.
 * No clause rewriting, HTML injection, or externally supplied file paths. */
export function readLegalDocument(slug: "privacy-policy" | "terms") {
  const source = readFileSync(path.join(process.cwd(), "content", "legal", `${slug}.md`), "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const paragraphs = source.trim().split(/\n\s*\n/);
  const title = paragraphs.shift()!;
  const dates = paragraphs.shift()!.split("\n");
  const introduction: LegalBlock[] = [];
  const sections: LegalSection[] = [];
  for (const paragraph of paragraphs) {
    if (/^\d+\. /.test(paragraph) && !paragraph.includes("\n")) {
      sections.push({ title: paragraph, id: `section-${sections.length + 1}`, blocks: [] });
      continue;
    }
    const lines = paragraph.split("\n");
    const type = lines.every(line => line.startsWith("- ")) ? "list" : lines.length === 1 && paragraph.length < 80 && !/[.!?:]$/.test(paragraph) && !paragraph.includes("—") ? "subheading" : "paragraph";
    const block: LegalBlock = { type, lines: type === "list" ? lines.map(line => line.slice(2)) : lines };
    (sections.length ? sections[sections.length - 1].blocks : introduction).push(block);
  }
  return { title, dates, introduction, sections };
}
