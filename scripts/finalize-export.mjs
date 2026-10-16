import { copyFile, readdir } from "node:fs/promises";
import path from "node:path";

// Next 16.4's exporter passes platform-native relative paths to a URL encoder
// that replaces only '/'. On Windows this leaves nested __next.* directories,
// but the browser requests dotted filenames. Add portable aliases without
// changing framework code or removing any of the generated payloads.
const root = path.resolve("out");
let aliases = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "assets" && entry.name !== "_next")
        await visit(source);
      continue;
    }
    if (!entry.name.endsWith(".txt")) continue;
    const parts = path.relative(root, source).split(path.sep);
    const segment = parts.findIndex((part) => part.startsWith("__next."));
    if (segment < 0 || segment === parts.length - 1) continue;
    const destination = path.resolve(
      root,
      ...parts.slice(0, segment),
      parts.slice(segment).join("."),
    );
    if (!destination.startsWith(root + path.sep))
      throw new Error("Export alias escaped output directory");
    await copyFile(source, destination);
    aliases++;
  }
}
await visit(root);
console.log(`Static navigation payloads ready (${aliases} portable aliases).`);
