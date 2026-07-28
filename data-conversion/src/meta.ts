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

interface GamePatch {
  patch: number | null;
  date: string | null;
}

/**
 * The game patch number is not part of the data files; upstream records it in
 * commit messages of the form "Implement DE Update <patch>". If that
 * convention ever changes, this would silently keep matching the last old
 * commit, so the staleness check below compares against data.json's actual
 * last change.
 */
function latestGamePatch(): GamePatch {
  const entry = git([
    "log",
    "--grep",
    "^Implement DE Update",
    "--format=%s|%cs",
    "-1",
  ]);
  const [subject, date] = entry?.split("|") ?? [];
  const match = subject?.match(/(\d+)\s*$/);
  return match
    ? { patch: Number(match[1]), date: date ?? null }
    : { patch: null, date: null };
}

const PATCH_STALENESS_LIMIT_MS = 90 * 24 * 60 * 60 * 1000;

function warnIfPatchLooksStale(patchDate: string | null): void {
  const dataDate = git(["log", "-1", "--format=%cs", "--", "data/data.json"]);
  if (patchDate === null || dataDate === null) {
    return;
  }
  const gap = Date.parse(dataDate) - Date.parse(patchDate);
  if (gap > PATCH_STALENESS_LIMIT_MS) {
    console.warn(
      `WARNING: data/data.json last changed ${dataDate} but the newest ` +
        `"Implement DE Update" commit is from ${patchDate} — upstream may ` +
        `have changed its patch commit convention, so gamePatch could be stale.`
    );
  }
}

export function buildMeta(data: TransformedData): Meta {
  const { patch, date } = latestGamePatch();
  warnIfPatchLooksStale(date);

  const meta = metaSchema.parse({
    generatedAt: new Date().toISOString(),
    gamePatch: patch,
    gamePatchDate: date,
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
    `Meta: game patch ${meta.gamePatch ?? "unknown"} ` +
      `(${meta.gamePatchDate ?? "no date"}), ` +
      `source ${meta.sourceCommit.slice(0, 9)}`
  );

  return meta;
}
