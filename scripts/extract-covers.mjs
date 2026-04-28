import { parseFile } from "music-metadata";
import { readdir, writeFile, stat, access } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

const ROOT = path.resolve("public/tracks");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".mp3"))
      files.push(full);
  }
  return files;
}

const exists = async (p) => {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const mp3s = await walk(ROOT);
let extracted = 0;
let skipped = 0;
let missing = 0;

for (const mp3 of mp3s) {
  const out = mp3.replace(/\.mp3$/i, ".jpg");
  if (await exists(out)) {
    skipped++;
    continue;
  }
  const meta = await parseFile(mp3);
  const pic = meta.common.picture?.[0];
  if (!pic) {
    missing++;
    console.warn("no cover: " + path.relative(ROOT, mp3));
    continue;
  }
  await writeFile(out, pic.data);
  extracted++;
  console.log("✓ " + path.relative(ROOT, out));
}

console.log(`\nextracted ${extracted}, skipped ${skipped}, missing ${missing}`);
