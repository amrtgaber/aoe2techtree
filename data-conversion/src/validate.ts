import { z } from "zod";
import {
  ageSchema,
  unitSchema,
  techSchema,
  buildingSchema,
  civSchema,
  unitUpgradeSchema,
  translationsSchema,
} from "./schemas.js";
import type { TransformedData } from "./transform.js";

// Structural validation can't catch an upstream format drift that merely
// empties derived fields — empty arrays and absent translation keys are
// schema-legal — so coverage floors guard the expected density too.
const TRAINED_AT_FLOOR = 0.9;
const NAME_STRING_FLOOR = 0.95;
const HELP_STRING_FLOOR = 0.9;
const MIN_UNIT_UPGRADES = 50;

function checkCoverage(
  label: string,
  covered: number,
  total: number,
  floor: number,
  problems: string[]
): void {
  if (total > 0 && covered / total < floor) {
    problems.push(
      `${label}: ${covered}/${total}, below the ${Math.round(floor * 100)}% floor`
    );
  }
}

function checkSanity(data: TransformedData): void {
  const problems: string[] = [];

  checkCoverage(
    "units with a trainedAt location",
    data.units.filter((u) => u.trainedAt.length > 0).length,
    data.units.length,
    TRAINED_AT_FLOOR,
    problems
  );
  checkCoverage(
    "techs with a researchedAt location",
    data.techs.filter((t) => t.researchedAt.length > 0).length,
    data.techs.length,
    TRAINED_AT_FLOOR,
    problems
  );

  if (data.unitUpgrades.length < MIN_UNIT_UPGRADES) {
    problems.push(
      `unit upgrades: ${data.unitUpgrades.length}, expected at least ${MIN_UNIT_UPGRADES}`
    );
  }

  const nameIds = [
    ...data.ages.map((a) => a.languageNameId),
    ...data.units.map((u) => u.languageNameId),
    ...data.techs.map((t) => t.languageNameId),
    ...data.buildings.map((b) => b.languageNameId),
    ...data.civs.map((c) => c.languageNameId),
  ].map(String);
  const helpIds = [
    ...data.units.map((u) => u.languageHelpId),
    ...data.techs.map((t) => t.languageHelpId),
    ...data.buildings.map((b) => b.languageHelpId),
    ...data.civs.map((c) => c.languageHelpTextId),
  ].map(String);

  for (const [locale, strings] of Object.entries(data.translations)) {
    checkCoverage(
      `${locale} name strings`,
      nameIds.filter((id) => id in strings).length,
      nameIds.length,
      NAME_STRING_FLOOR,
      problems
    );
    checkCoverage(
      `${locale} help strings`,
      helpIds.filter((id) => id in strings).length,
      helpIds.length,
      HELP_STRING_FLOOR,
      problems
    );
  }

  if (problems.length > 0) {
    throw new Error(
      "Coverage sanity checks failed — the upstream data format may have " +
        `drifted:\n  ${problems.join("\n  ")}`
    );
  }
}

function validateArray<T>(
  schema: z.ZodType<T>,
  data: unknown[],
  label: string
): T[] {
  const results: T[] = [];
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const result = schema.safeParse(data[i]);
    if (result.success) {
      results.push(result.data);
    } else {
      const issues = result.error.issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      errors.push(`${label}[${i}]:\n${issues}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation failed for ${errors.length} ${label} entries:\n${errors.join("\n")}`
    );
  }

  return results;
}

export function validate(data: TransformedData): TransformedData {
  const ages = validateArray(ageSchema, data.ages, "ages");
  const units = validateArray(unitSchema, data.units, "units");
  const techs = validateArray(techSchema, data.techs, "techs");
  const buildings = validateArray(buildingSchema, data.buildings, "buildings");
  const civs = validateArray(civSchema, data.civs, "civs");
  const unitUpgrades = validateArray(
    unitUpgradeSchema,
    data.unitUpgrades,
    "unitUpgrades"
  );

  const translationsResult = translationsSchema.safeParse(data.translations);
  if (!translationsResult.success) {
    throw new Error(
      `Translations validation failed:\n${translationsResult.error.message}`
    );
  }

  const validated: TransformedData = {
    ages,
    units,
    techs,
    buildings,
    civs,
    unitUpgrades,
    translations: translationsResult.data,
  };

  checkSanity(validated);

  console.log(
    `Validated: ${ages.length} ages, ${units.length} units, ` +
      `${techs.length} techs, ${buildings.length} buildings, ` +
      `${civs.length} civs, ${unitUpgrades.length} unit upgrades, ` +
      `${Object.keys(translationsResult.data).length} locales ` +
      `(coverage floors passed)`
  );

  return validated;
}
