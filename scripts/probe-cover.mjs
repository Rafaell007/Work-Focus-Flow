import { parseFile } from "music-metadata";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/probe-cover.mjs <path-to-mp3>");
  process.exit(1);
}

const meta = await parseFile(path.resolve(file));
const pics = meta.common.picture ?? [];
console.log(JSON.stringify({
  hasCover: pics.length > 0,
  count: pics.length,
  format: pics[0]?.format,
  byteLength: pics[0]?.data?.length,
}, null, 2));
