import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
const base = path.resolve("public/assets");
const output = path.join(base, "optimized");
await mkdir(output, { recursive: true });
let before = 0,
  after = 0;
for (const folder of ["products", "ui-designs"])
  for (const file of await readdir(path.join(base, folder))) {
    const input = path.join(base, folder, file);
    const dest = path.join(output, path.parse(file).name + ".webp");
    before += (await stat(input)).size;
    await sharp(input)
      .resize({
        width: folder === "products" ? 640 : 826,
        withoutEnlargement: true,
      })
      .webp({ quality: folder === "products" ? 83 : 94, effort: 6 })
      .toFile(dest);
    after += (await stat(dest)).size;
  }
console.log({
  sourceMB: (before / 1e6).toFixed(2),
  optimizedMB: (after / 1e6).toFixed(2),
});
