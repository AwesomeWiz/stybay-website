import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Deterministic display derivatives for these isolated catalogue photographs.
// Only border-connected neutral backdrop pixels are replaced. Garment pixels
// retain their source colour; there is no generative fill or material inference.
const background = "#f0efeb",
  width = 480,
  height = 720;
const sourceDirectory = "public/assets/products",
  outputDirectory = "public/assets/optimized";
const tolerance = { 1: 6, 18: 7, 20: 7, 26: 7, 27: 5, 42: 4, 54: 8 };
// This white-on-grey photograph has almost no colour boundary. A visually
// checked interior guard protects its white body/sleeves during flood fill.
const interiorGuards = {
  27: [
    [0.43, 0.135],
    [0.57, 0.15],
    [0.68, 0.17],
    [0.745, 0.545],
    [0.685, 0.55],
    [0.635, 0.4],
    [0.695, 0.907],
    [0.305, 0.907],
    [0.365, 0.41],
    [0.325, 0.55],
    [0.245, 0.545],
    [0.34, 0.17],
  ],
};
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const pipelineRevision = hash(await readFile(new URL(import.meta.url))).slice(
  0,
  12,
);
const previous = await readFile("lib/productDisplay.json", "utf8").then(
  JSON.parse,
  () => ({}),
);
function inPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i],
      [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
function median(values) {
  return values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
}
async function normalize(file) {
  const id = Number(file.match(/\d+/)[0]);
  const source = await readFile(path.join(sourceDirectory, file));
  const sourceHash = hash(source);
  const existing = await readFile(
    path.join(outputDirectory, `product${id}.webp`),
  ).catch(() => null);
  if (
    previous.pipelineRevision === pipelineRevision &&
    previous.sourceRevisions?.[id] === sourceHash.slice(0, 12) &&
    existing &&
    hash(existing).slice(0, 12) === previous.revisions?.[id]
  ) {
    return {
      id,
      source: file,
      sourceHash,
      revision: previous.revisions[id],
      bytes: existing.length,
      cached: true,
    };
  }
  const { data, info } = await sharp(source)
    .rotate()
    .flatten({ background: "#ffffff" })
    .toColourspace("srgb")
    .resize({
      width: 800,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width,
    h = info.height,
    n = w * h;
  const channels = [[], [], []];
  for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 80)))
    for (const y of [0, h - 1])
      for (let c = 0; c < 3; c++) channels[c].push(data[(y * w + x) * 3 + c]);
  for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 80)))
    for (const x of [0, w - 1])
      for (let c = 0; c < 3; c++) channels[c].push(data[(y * w + x) * 3 + c]);
  const backdrop = channels.map(median),
    threshold = tolerance[id] ?? 16;
  const eligible = new Uint8Array(n),
    visited = new Uint8Array(n),
    queue = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * 3;
    const distance = Math.max(
      ...backdrop.map((colour, c) => Math.abs(data[p + c] - colour)),
    );
    const guarded =
      interiorGuards[id] &&
      inPolygon((i % w) / w, Math.floor(i / w) / h, interiorGuards[id]);
    eligible[i] = !guarded && distance <= threshold ? 1 : 0;
  }
  let head = 0,
    tail = 0;
  const add = (i) => {
    if (!visited[i] && eligible[i]) {
      visited[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < w; x++) {
    add(x);
    add((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    add(y * w);
    add(y * w + w - 1);
  }
  while (head < tail) {
    const i = queue[head++],
      x = i % w;
    if (x) add(i - 1);
    if (x < w - 1) add(i + 1);
    if (i >= w) add(i - w);
    if (i < n - w) add(i + w);
  }
  // Find the main connected silhouette to ignore isolated compression specks.
  const seen = new Uint8Array(n);
  let largest = { count: 0, left: w, top: h, right: 0, bottom: 0 };
  for (let start = 0; start < n; start++) {
    if (visited[start] || seen[start]) continue;
    head = 0;
    tail = 1;
    queue[0] = start;
    seen[start] = 1;
    const bounds = { count: 0, left: w, top: h, right: 0, bottom: 0 };
    const visit = (i) => {
      if (!visited[i] && !seen[i]) {
        seen[i] = 1;
        queue[tail++] = i;
      }
    };
    while (head < tail) {
      const i = queue[head++],
        x = i % w,
        y = Math.floor(i / w);
      bounds.count++;
      bounds.left = Math.min(bounds.left, x);
      bounds.right = Math.max(bounds.right, x);
      bounds.top = Math.min(bounds.top, y);
      bounds.bottom = Math.max(bounds.bottom, y);
      if (x) visit(i - 1);
      if (x < w - 1) visit(i + 1);
      if (i >= w) visit(i - w);
      if (i < n - w) visit(i + w);
    }
    if (bounds.count > largest.count) largest = bounds;
  }
  if (largest.count < n * 0.025 || largest.count > n * 0.9)
    throw new Error(
      `${file}: backdrop could not be isolated; inspect before adding a normalization override`,
    );
  const left = Math.max(0, largest.left - 3),
    top = Math.max(0, largest.top - 3);
  const crop = {
    left,
    top,
    width: Math.min(w, largest.right + 4) - left,
    height: Math.min(h, largest.bottom + 4) - top,
  };
  const alpha = Buffer.from(
    Uint8Array.from(visited, (value) => (value ? 0 : 255)),
  );
  const softened = await sharp(alpha, {
    raw: { width: w, height: h, channels: 1 },
  })
    .blur(0.4)
    .greyscale()
    .raw()
    .toBuffer();
  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = softened[i];
  }
  const cutout = await sharp(rgba, {
    raw: { width: w, height: h, channels: 4 },
  })
    .extract(crop)
    .resize({ width: 414, height: 622, fit: "inside" })
    .png()
    .toBuffer();
  const size = await sharp(cutout).metadata();
  if (size.width > width || size.height > height)
    throw new Error(`${file}: oversized cutout ${size.width}×${size.height}`);
  const display = await sharp({
    create: { width, height, channels: 3, background },
  })
    .composite([
      {
        input: cutout,
        left: Math.round((width - size.width) / 2),
        top: Math.round((height - size.height) / 2),
      },
    ])
    .webp({ quality: 86, effort: 6 })
    .toBuffer();
  await writeFile(path.join(outputDirectory, `product${id}.webp`), display);
  return {
    id,
    source: file,
    sourceHash,
    revision: hash(display).slice(0, 12),
    bytes: display.length,
    backdrop,
    crop,
  };
}
await mkdir(outputDirectory, { recursive: true });
await mkdir(".qa", { recursive: true });
const files = (await readdir(sourceDirectory))
  .filter((file) => /^product\d+\.(png|jpg|jpeg)$/i.test(file))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
const report = [];
for (const file of files) report.push(await normalize(file));
await writeFile(
  "lib/productDisplay.json",
  JSON.stringify(
    {
      version: 1,
      pipelineRevision,
      width,
      height,
      background,
      sourceRevisions: Object.fromEntries(
        report.map((item) => [item.id, item.sourceHash.slice(0, 12)]),
      ),
      revisions: Object.fromEntries(
        report.map((item) => [item.id, item.revision]),
      ),
    },
    null,
    2,
  ) + "\n",
);
await writeFile(
  ".qa/product-normalization.json",
  JSON.stringify(report, null, 2),
);
console.log(
  `Normalized ${report.length} source photographs on ${width}×${height} ${background} canvases: ${(report.reduce((sum, item) => sum + item.bytes, 0) / 1e6).toFixed(2)} MB.`,
);
