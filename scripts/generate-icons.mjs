// Regenerates the PNG app icons from public/icons/icon.svg.
// Run with:  node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile("public/icons/icon.svg");
const BG = "#D9482E";

const outputs = [
  ["public/icons/icon-192.png", 192, 1],
  ["public/icons/icon-512.png", 512, 1],
  ["public/icons/apple-touch-icon.png", 180, 1],
  // Maskable icons need extra padding so Android can crop them into any shape.
  ["public/icons/icon-maskable-512.png", 512, 0.8],
  ["app/icon.png", 64, 1],
];

for (const [file, size, scale] of outputs) {
  const inner = Math.round(size * scale);
  const art = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer();
  const image = sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: art, gravity: "center" }]);
  await image.png().toFile(file);
  console.log("wrote", file);
}
