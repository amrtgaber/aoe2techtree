import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawGameData, LocaleMap } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

export interface ExtractedData {
  gameData: RawGameData;
  locales: LocaleMap;
}

export function extract(): ExtractedData {
  const dataPath = join(ROOT, "data", "data.json");
  const gameData: RawGameData = JSON.parse(readFileSync(dataPath, "utf-8"));

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
    `Extracted: ${Object.keys(gameData.data.units).length} units, ` +
      `${Object.keys(gameData.data.techs).length} techs, ` +
      `${Object.keys(gameData.data.buildings).length} buildings, ` +
      `${Object.keys(gameData.techtrees).length} civs, ` +
      `${localeDirs.length} locales`
  );

  return { gameData, locales };
}
