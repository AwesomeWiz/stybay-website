import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
await mkdir(".qa", { recursive: true });
const files = (await readdir("public/assets/products")).sort(
  (a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]),
);
const normalized = process.argv.includes("--normalized");
for (let start = 0; start < files.length; start += 20) {
  const composite = [];
  for (const [i, file] of files.slice(start, start + 20).entries()) {
    const left = (i % 5) * 200,
      top = Math.floor(i / 5) * 290;
    composite.push({
      input: await sharp(
        normalized
          ? `public/assets/optimized/${file.replace(/\.[^.]+$/, ".webp")}`
          : `public/assets/products/${file}`,
      )
        .resize(190, 255, { fit: "contain", background: "#f4f3f0" })
        .png()
        .toBuffer(),
      left,
      top,
    });
    composite.push({
      input: Buffer.from(
        `<svg width="190" height="28"><text x="8" y="20" font-size="18">${file}</text></svg>`,
      ),
      left,
      top: top + 255,
    });
  }
  await sharp({
    create: { width: 1000, height: 1160, channels: 3, background: "#fff" },
  })
    .composite(composite)
    .png()
    .toFile(
      `.qa/${normalized ? "display-" : ""}products-${start + 1}-${Math.min(start + 20, files.length)}.png`,
    );
}
console.log(`Created contact sheets for ${files.length} images.`);
