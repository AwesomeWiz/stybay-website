import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
const base = path.resolve("public/assets");
const output = path.join(base, "optimized");
await mkdir(output, { recursive: true });
let before = 0,
  after = 0;
await import("./normalize-products.mjs");
for (const folder of ["ui-designs"])
  for (const file of await readdir(path.join(base, folder))) {
    if (process.argv.includes("--new-products")) continue;
    const input = path.join(base, folder, file);
    const dest = path.join(output, path.parse(file).name + ".webp");
    // Preserve existing exports when extending the library.
    if (
      process.argv.includes("--new-only") &&
      (await stat(dest).then(
        () => true,
        () => false,
      ))
    )
      continue;
    before += (await stat(input)).size;
    await sharp(input)
      .resize({
        width: 826,
        withoutEnlargement: true,
      })
      .webp({ quality: 94, effort: 6 })
      .toFile(dest);
    after += (await stat(dest)).size;
  }
console.log({
  sourceMB: (before / 1e6).toFixed(2),
  optimizedMB: (after / 1e6).toFixed(2),
});
