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
});

export const techSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  languageNameId: z.number(),
  languageHelpId: z.number(),
  cost: costSchema,
  researchTime: z.number(),
  repeatable: z.boolean(),
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

export const translationsSchema = z.record(
  z.string(),
  z.record(z.string(), z.string())
);

export type Age = z.infer<typeof ageSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Tech = z.infer<typeof techSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type Civ = z.infer<typeof civSchema>;
export type Translations = z.infer<typeof translationsSchema>;
