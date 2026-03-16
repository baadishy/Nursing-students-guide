/**
 * Extracts the hard‑coded learning content from the built bundle and
 * normalises encodings into clean JSON that can be pushed to the backend.
 *
 * Usage:
 *   node scripts/extractContent.js
 *
 * Output:
 *   content/extracted-content.json
 */
const fs = require("fs");
const path = require("path");

const gv = require("../extracted-gv.json");
const yv = require("../extracted-yv.json");
const Sj = require("../extracted-Sj.json");

// Decode mojibake strings like "Ø§Ù„ØªÙ…" into real UTF‑8 Arabic
const fixMojibake = (value) => {
  if (typeof value !== "string") return value;
  if (!/[ØÙÂ]/.test(value)) return value;
  try {
    const decoded = Buffer.from(value, "latin1").toString("utf8");
    return decoded;
  } catch {
    return value;
  }
};

const walk = (value) => {
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = walk(v);
    }
    return result;
  }
  return fixMojibake(value);
};

const payload = {
  theoretical: walk(gv),
  medicalSurgical: walk(yv),
  flashcards: walk(Sj),
};

const outPath = path.join(__dirname, "..", "content", "extracted-content.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${outPath}`);
