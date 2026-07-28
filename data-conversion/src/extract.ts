import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawGameData, LocaleMap, RawTreeMap } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

export interface ExtractedData {
  gameData: RawGameData;
  locales: LocaleMap;
  trees: RawTreeMap;
}

export function extract(): ExtractedData {
  const dataPath = join(ROOT, "data", "data.json");
  const gameData: RawGameData = JSON.parse(readFileSync(dataPath, "utf-8"));

  const treesDir = join(ROOT, "data", "trees");
  const trees: RawTreeMap = {};
  for (const civName of Object.keys(gameData.civs)) {
    const treePath = join(treesDir, `${civName.toUpperCase()}.json`);
    trees[civName] = JSON.parse(readFileSync(treePath, "utf-8"));
  }

  const localesDir = join(ROOT, "data", "locales");
  const localeDirs = readdirSync(localesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const locales: LocaleMap = {};
  for (const locale of localeDirs) {
    const stringsPath = join(localesDir, locale, "strings.json");
    locales[locale] = JSON.parse(readFileSync(stringsPath, "utf-8"));
  }

  console.log(
    `Extracted: ${Object.keys(gameData.data.Unit).length} units, ` +
      `${Object.keys(gameData.data.Tech).length} techs, ` +
      `${Object.keys(gameData.data.Building).length} buildings, ` +
      `${Object.keys(trees).length} civs, ` +
      `${localeDirs.length} locales`
  );

  return { gameData, locales, trees };
}
