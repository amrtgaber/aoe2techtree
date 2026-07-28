import { z } from "zod";

const armourOrAttackSchema = z.object({
  class: z.number(),
  amount: z.number(),
});

const costSchema = z
  .object({
    food: z.number(),
    wood: z.number(),
    gold: z.number(),
    stone: z.number(),
  })
  .partial();

export const ageSchema = z.object({
  id: z.number(),
  languageNameId: z.number(),
});

export const unitSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  languageNameId: z.number(),
  languageHelpId: z.number(),
  hp: z.number(),
  lineOfSight: z.number(),
  garrisonCapacity: z.number(),
  cost: costSchema,
  trainTime: z.number(),
  speed: z.number(),
  attack: z.number(),
  attackDelaySeconds: z.number(),
  attacks: z.array(armourOrAttackSchema),
  accuracyPercent: z.number(),
  range: z.number(),
  minRange: z.number(),
  reloadTime: z.number(),
  meleeArmor: z.number(),
  pierceArmor: z.number(),
  armours: z.array(armourOrAttackSchema),
  chargeEvent: z.number(),
  chargeType: z.number(),
  maxCharge: z.number(),
  rechargeRate: z.number(),
  frameDelay: z.number(),
  trait: z.number(),
  traitPiece: z.number(),
  blastWidth: z.number(),
  trainedAt: z.array(z.number()),
});

export const techSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  languageNameId: z.number(),
  languageHelpId: z.number(),
  cost: costSchema,
  researchTime: z.number(),
  repeatable: z.boolean(),
  researchedAt: z.array(z.number()),
});

export const buildingSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  languageNameId: z.number(),
  languageHelpId: z.number(),
  hp: z.number(),
  lineOfSight: z.number(),
  garrisonCapacity: z.number(),
  cost: costSchema,
  trainTime: z.number(),
  attack: z.number(),
  attacks: z.array(armourOrAttackSchema),
  accuracyPercent: z.number(),
  range: z.number(),
  minRange: z.number(),
  reloadTime: z.number(),
  meleeArmor: z.number(),
  pierceArmor: z.number(),
  armours: z.array(armourOrAttackSchema),
});

const techtreeEntrySchema = z.object({
  id: z.number(),
  ageId: z.number(),
});

const uniqueSchema = z.object({
  castleAgeUniqueUnit: z.number(),
  imperialAgeUniqueUnit: z.number(),
  castleAgeUniqueTech: z.number(),
  imperialAgeUniqueTech: z.number(),
});

export const civSchema = z.object({
  name: z.string(),
  languageNameId: z.number(),
  languageHelpTextId: z.number(),
  monkSuffix: z.string(),
  unique: uniqueSchema,
  units: z.array(techtreeEntrySchema),
  techs: z.array(techtreeEntrySchema),
  buildings: z.array(techtreeEntrySchema),
});

// The upgrade that produces a unit (e.g. the War Galley research producing
// unit 21). Most upgrade techs are not tree Research nodes and therefore not
// in techs.json, so this record is self-contained rather than a reference.
export const unitUpgradeSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  techId: z.number(),
  cost: costSchema,
  researchTime: z.number(),
});

export const metaSchema = z.object({
  generatedAt: z.string(),
  gamePatch: z.number().nullable(),
  sourceCommit: z.string(),
  counts: z.object({
    ages: z.number(),
    units: z.number(),
    techs: z.number(),
    buildings: z.number(),
    civs: z.number(),
    unitUpgrades: z.number(),
    locales: z.number(),
  }),
});

export const translationsSchema = z.record(
  z.string(),
  z.record(z.string(), z.string())
);

export type Age = z.infer<typeof ageSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Tech = z.infer<typeof techSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type Civ = z.infer<typeof civSchema>;
export type UnitUpgrade = z.infer<typeof unitUpgradeSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type Translations = z.infer<typeof translationsSchema>;
