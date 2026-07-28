import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { metaSchema, type Meta } from "./schemas.js";
import type { TransformedData } from "./transform.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

function git(args: string[]): string | null {
  try {
    const out = execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
    return out === "" ? null : out;
  } catch {
    return null;
  }
}

/**
 * The game patch number is not part of the data files; upstream records it in
 * commit messages of the form "Implement DE Update <patch>".
 */
function latestGamePatch(): number | null {
  const subject = git([
    "log",
    "--grep",
    "^Implement DE Update",
    "--format=%s",
    "-1",
  ]);
  const match = subject?.match(/(\d+)\s*$/);
  return match ? Number(match[1]) : null;
}

export function buildMeta(data: TransformedData): Meta {
  const meta = metaSchema.parse({
    generatedAt: new Date().toISOString(),
    gamePatch: latestGamePatch(),
    sourceCommit: git(["rev-parse", "HEAD"]) ?? "unknown",
    counts: {
      ages: data.ages.length,
      units: data.units.length,
      techs: data.techs.length,
      buildings: data.buildings.length,
      civs: data.civs.length,
      unitUpgrades: data.unitUpgrades.length,
      locales: Object.keys(data.translations).length,
    },
  });

  console.log(
    `Meta: game patch ${meta.gamePatch ?? "unknown"}, ` +
      `source ${meta.sourceCommit.slice(0, 9)}`
  );

  return meta;
}
