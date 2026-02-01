import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TransformedData } from "./transform.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUTPUT_DIR = join(__dirname, "..", "output");
const IMG_DIR = join(ROOT, "img");

function writeJson(filename: string, data: unknown): void {
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n");
}

function copyImages(
  category: "units" | "techs" | "buildings",
  sourceDir: string,
  ids: number[]
): void {
  const destDir = join(OUTPUT_DIR, "images", category);
  mkdirSync(destDir, { recursive: true });

  let copied = 0;
  for (const id of ids) {
    const src = join(IMG_DIR, sourceDir, `${id}.png`);
    if (existsSync(src)) {
      copyFileSync(src, join(destDir, `${id}.png`));
      copied++;
    }
  }

  console.log(`  ${category}: ${copied}/${ids.length} images copied`);
}

export function write(data: TransformedData): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  writeJson("ages.json", data.ages);
  writeJson("units.json", data.units);
  writeJson("techs.json", data.techs);
  writeJson("buildings.json", data.buildings);
  writeJson("civs.json", data.civs);
  writeJson("translations.json", data.translations);

  console.log("Copying images...");
  copyImages(
    "units",
    "Units",
    data.units.map((u) => u.id)
  );
  copyImages(
    "techs",
    "Techs",
    data.techs.map((t) => t.id)
  );
  copyImages(
    "buildings",
    "Buildings",
    data.buildings.map((b) => b.id)
  );

  console.log(`Output written to ${OUTPUT_DIR}`);
}
