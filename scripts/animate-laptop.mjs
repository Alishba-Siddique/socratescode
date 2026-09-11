import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import gifenc from "gifenc";

// Original generated illustration plus a deterministic, perspective-aligned screen animation.
// Rebuild with: npm run artwork:animate
const { GIFEncoder, quantize, applyPalette } = gifenc;
const size = 600;
const base = await sharp("public/images/socratic-laptop-study.webp")
  .resize(size, size)
  .toBuffer();
const lines = [
  ["# Think it through.", "#a2bdb0"],
  ["values = [1, 2, 3]", "#e7dcc0"],
  ["total = 0", "#e7dcc0"],
  ["for value in values:", "#b0d4cc"],
  ["    total += value", "#e7dcc0"],
  ["print(total)", "#b0d4cc"],
  ["", "#e7dcc0"],
  ["> 6", "#f2c94b"],
];
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
function screen(frame) {
  const progress = Math.min(1, frame / 19);
  const allCharacters = lines.reduce((sum, [line]) => sum + line.length, 0);
  let remaining = Math.floor(progress * allCharacters);
  let cursor = { x: 8, y: 16 };
  const text = lines
    .map(([line, color], index) => {
      const visible = line.slice(0, Math.max(0, remaining));
      remaining -= line.length;
      if (visible) cursor = { x: 8 + visible.length * 6.2, y: 16 + index * 18 };
      return `<text x="8" y="${16 + index * 18}" fill="${color}">${escape(visible)}</text>`;
    })
    .join("");
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 768 768"><defs><clipPath id="screen"><path d="M468 258L693 235L650 458L440 448Z"/></clipPath></defs><g clip-path="url(#screen)"><path d="M468 258L693 235L650 458L440 448Z" fill="#123135"/><g transform="matrix(1,-.09,-.13,1,478,278)" font-family="monospace" font-size="10">${text}${frame % 4 < 2 ? `<rect x="${cursor.x}" y="${cursor.y - 8}" width="4" height="10" fill="#f2c94b"/>` : ""}<path d="M8 165H165" stroke="#8fac9c" stroke-opacity=".25"/><circle cx="10" cy="178" r="2" fill="#9bbaab"/><text x="18" y="181" fill="#8fac9c" font-size="7">${frame < 20 ? "tracing..." : "reasoning complete"}</text></g></g></svg>`,
  );
}
const finalFrame = await sharp(base)
  .composite([{ input: screen(22) }])
  .ensureAlpha()
  .raw()
  .toBuffer();
const palette = quantize(finalFrame, 256);
const encoder = GIFEncoder();
for (let frame = 0; frame < 26; frame++) {
  const rgba = await sharp(base)
    .composite([{ input: screen(frame) }])
    .ensureAlpha()
    .raw()
    .toBuffer();
  const indexed = applyPalette(rgba, palette);
  encoder.writeFrame(indexed, size, size, {
    palette: frame === 0 ? palette : undefined,
    delay: frame === 25 ? 1100 : 160,
    repeat: 0,
  });
}
encoder.finish();
await writeFile("public/images/socratic-laptop-loop.gif", encoder.bytes());
await sharp(base)
  .composite([{ input: screen(22) }])
  .webp({ quality: 90 })
  .toFile("public/images/socratic-laptop-poster.webp");
console.log(
  `Created a ${Math.round(encoder.bytes().length / 1024)} KB animated GIF with 26 frames.`,
);
