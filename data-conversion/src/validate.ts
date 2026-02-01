import { z } from "zod";
import {
  ageSchema,
  unitSchema,
  techSchema,
  buildingSchema,
  civSchema,
  translationsSchema,
} from "./schemas.js";
import type { TransformedData } from "./transform.js";

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

  const translationsResult = translationsSchema.safeParse(data.translations);
  if (!translationsResult.success) {
    throw new Error(
      `Translations validation failed:\n${translationsResult.error.message}`
    );
  }

  console.log(
    `Validated: ${ages.length} ages, ${units.length} units, ` +
      `${techs.length} techs, ${buildings.length} buildings, ` +
      `${civs.length} civs, ${Object.keys(translationsResult.data).length} locales`
  );

  return {
    ages,
    units,
    techs,
    buildings,
    civs,
    translations: translationsResult.data,
  };
}
