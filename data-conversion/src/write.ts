import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawTreeMap } from "./types.js";
import type { Meta } from "./schemas.js";
import type { TransformedData } from "./transform.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUTPUT_DIR = join(__dirname, "..", "output");
const IMG_DIR = join(ROOT, "img");
// ID-named images for entities that have no tech tree node (and therefore no
// picture_index), preserved from before upstream switched to
// picture_index-named images.
const SUPPLEMENTAL_IMG_DIR = join(__dirname, "..", "img");

function writeJson(filename: string, data: unknown): void {
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * The image files are named by the game's picture_index, not by entity ID,
 * so map each entity to the picture_index of its tree node. Regional
 * variants (e.g. Trade Cart skins) share a node ID with differing picture
 * indexes per civ; the first available node wins.
 */
function buildPictureIndexMap(trees: RawTreeMap): Map<string, number> {
  const pictures = new Map<string, number>();
  const fallbacks = new Map<string, number>();
  for (const tree of Object.values(trees)) {
    for (const node of [...tree.buildings, ...tree.units_techs]) {
      const key = `${node.use_type}:${node.node_id}`;
      if (node.node_status !== "NotAvailable") {
        if (!pictures.has(key)) {
          pictures.set(key, node.picture_index);
        }
      } else if (!fallbacks.has(key)) {
        fallbacks.set(key, node.picture_index);
      }
    }
  }
  for (const [key, pictureIndex] of fallbacks) {
    if (!pictures.has(key)) {
      pictures.set(key, pictureIndex);
    }
  }
  return pictures;
}

function copyImages(
  category: "units" | "techs" | "buildings",
  useType: "Unit" | "Tech" | "Building",
  ids: number[],
  pictures: Map<string, number>
): void {
  const destDir = join(OUTPUT_DIR, "images", category);
  mkdirSync(destDir, { recursive: true });

  let copied = 0;
  const missing: number[] = [];
  for (const id of ids) {
    const pictureIndex = pictures.get(`${useType}:${id}`);
    const candidates = [
      ...(pictureIndex !== undefined
        ? [join(IMG_DIR, useType, `${pictureIndex}.png`)]
        : []),
      join(SUPPLEMENTAL_IMG_DIR, useType, `${id}.png`),
    ];
    const src = candidates.find(existsSync);
    if (src !== undefined) {
      copyFileSync(src, join(destDir, `${id}.png`));
      copied++;
    } else {
      missing.push(id);
    }
  }

  const missingNote =
    missing.length > 0 ? ` (missing: ${missing.join(", ")})` : "";
  console.log(`  ${category}: ${copied}/${ids.length} images copied${missingNote}`);
}

function copyCivImages(civNames: string[]): void {
  const destDir = join(OUTPUT_DIR, "images", "civs");
  mkdirSync(destDir, { recursive: true });

  let copied = 0;
  const missing: string[] = [];
  for (const name of civNames) {
    const src = join(IMG_DIR, "Civs", `${name.toLowerCase()}.png`);
    if (existsSync(src)) {
      copyFileSync(src, join(destDir, `${name}.png`));
      copied++;
    } else {
      missing.push(name);
    }
  }

  const missingNote =
    missing.length > 0 ? ` (missing: ${missing.join(", ")})` : "";
  console.log(`  civs: ${copied}/${civNames.length} images copied${missingNote}`);
}

export function write(
  data: TransformedData,
  trees: RawTreeMap,
  meta: Meta
): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  writeJson("ages.json", data.ages);
  writeJson("units.json", data.units);
  writeJson("techs.json", data.techs);
  writeJson("buildings.json", data.buildings);
  writeJson("civs.json", data.civs);
  writeJson("unit_upgrades.json", data.unitUpgrades);
  writeJson("translations.json", data.translations);
  writeJson("meta.json", meta);

  console.log("Copying images...");
  const pictures = buildPictureIndexMap(trees);
  copyImages(
    "units",
    "Unit",
    data.units.map((u) => u.id),
    pictures
  );
  copyImages(
    "techs",
    "Tech",
    data.techs.map((t) => t.id),
    pictures
  );
  copyImages(
    "buildings",
    "Building",
    data.buildings.map((b) => b.id),
    pictures
  );
  copyCivImages(data.civs.map((c) => c.name));

  console.log(`Output written to ${OUTPUT_DIR}`);
}
