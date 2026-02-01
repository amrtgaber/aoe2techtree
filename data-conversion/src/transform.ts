import type { RawGameData, LocaleMap, RawCost } from "./types.js";
import type { Age, Unit, Tech, Building, Civ, Translations } from "./schemas.js";

export interface TransformedData {
  ages: Age[];
  units: Unit[];
  techs: Tech[];
  buildings: Building[];
  civs: Civ[];
  translations: Translations;
}

function transformCost(raw: RawCost): Record<string, number> {
  const cost: Record<string, number> = {};
  if (raw.Food !== undefined) cost.food = raw.Food;
  if (raw.Wood !== undefined) cost.wood = raw.Wood;
  if (raw.Gold !== undefined) cost.gold = raw.Gold;
  if (raw.Stone !== undefined) cost.stone = raw.Stone;
  return cost;
}

function transformAges(gameData: RawGameData): Age[] {
  // Sort by language ID to get sequential age IDs (1=Dark, 2=Feudal, 3=Castle, 4=Imperial)
  return Object.entries(gameData.age_names)
    .sort(([, a], [, b]) => Number(a) - Number(b))
    .map(([, langId], index) => ({
      id: index + 1,
      languageNameId: Number(langId),
    }));
}

function transformUnits(gameData: RawGameData): Unit[] {
  return Object.values(gameData.data.units).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: raw.LanguageNameId,
    languageHelpId: raw.LanguageHelpId,
    hp: raw.HP,
    lineOfSight: raw.LineOfSight,
    garrisonCapacity: raw.GarrisonCapacity,
    cost: transformCost(raw.Cost),
    trainTime: raw.TrainTime,
    speed: raw.Speed,
    attack: raw.Attack,
    attackDelaySeconds: raw.AttackDelaySeconds,
    attacks: raw.Attacks.map((a) => ({ class: a.Class, amount: a.Amount })),
    accuracyPercent: raw.AccuracyPercent,
    range: raw.Range,
    minRange: raw.MinRange,
    reloadTime: raw.ReloadTime,
    meleeArmor: raw.MeleeArmor,
    pierceArmor: raw.PierceArmor,
    armours: raw.Armours.map((a) => ({ class: a.Class, amount: a.Amount })),
    chargeEvent: raw.ChargeEvent,
    chargeType: raw.ChargeType,
    maxCharge: raw.MaxCharge,
    rechargeRate: raw.RechargeRate,
    frameDelay: raw.FrameDelay,
    trait: raw.Trait,
    traitPiece: raw.TraitPiece,
    blastWidth: raw.BlastWidth,
  }));
}

function transformTechs(gameData: RawGameData): Tech[] {
  return Object.values(gameData.data.techs).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: raw.LanguageNameId,
    languageHelpId: raw.LanguageHelpId,
    cost: transformCost(raw.Cost),
    researchTime: raw.ResearchTime,
    repeatable: raw.Repeatable,
  }));
}

function transformBuildings(gameData: RawGameData): Building[] {
  return Object.values(gameData.data.buildings).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: raw.LanguageNameId,
    languageHelpId: raw.LanguageHelpId,
    hp: raw.HP,
    lineOfSight: raw.LineOfSight,
    garrisonCapacity: raw.GarrisonCapacity,
    cost: transformCost(raw.Cost),
    trainTime: raw.TrainTime,
    attack: raw.Attack,
    attacks: raw.Attacks.map((a) => ({ class: a.Class, amount: a.Amount })),
    accuracyPercent: raw.AccuracyPercent,
    range: raw.Range,
    minRange: raw.MinRange,
    reloadTime: raw.ReloadTime,
    meleeArmor: raw.MeleeArmor,
    pierceArmor: raw.PierceArmor,
    armours: raw.Armours.map((a) => ({ class: a.Class, amount: a.Amount })),
  }));
}

function transformCivs(gameData: RawGameData): Civ[] {
  return Object.entries(gameData.techtrees).map(([name, tt]) => ({
    name,
    languageNameId: Number(gameData.civ_names[name]),
    languageHelpTextId: Number(gameData.civ_helptexts[name]),
    monkSuffix: tt.monkSuffix,
    unique: {
      castleAgeUniqueUnit: tt.unique.castleAgeUniqueUnit,
      imperialAgeUniqueUnit: tt.unique.imperialAgeUniqueUnit,
      castleAgeUniqueTech: tt.unique.castleAgeUniqueTech,
      imperialAgeUniqueTech: tt.unique.imperialAgeUniqueTech,
    },
    units: tt.units.map((e) => ({ id: e.id, ageId: e.age })),
    techs: tt.techs.map((e) => ({ id: e.id, ageId: e.age })),
    buildings: tt.buildings.map((e) => ({ id: e.id, ageId: e.age })),
  }));
}

function buildTranslations(
  locales: LocaleMap,
  ages: Age[],
  units: Unit[],
  techs: Tech[],
  buildings: Building[],
  civs: Civ[]
): Translations {
  const neededIds = new Set<string>();

  for (const age of ages) {
    neededIds.add(String(age.languageNameId));
  }
  for (const unit of units) {
    neededIds.add(String(unit.languageNameId));
    neededIds.add(String(unit.languageHelpId));
  }
  for (const tech of techs) {
    neededIds.add(String(tech.languageNameId));
    neededIds.add(String(tech.languageHelpId));
  }
  for (const building of buildings) {
    neededIds.add(String(building.languageNameId));
    neededIds.add(String(building.languageHelpId));
  }
  for (const civ of civs) {
    neededIds.add(String(civ.languageNameId));
    neededIds.add(String(civ.languageHelpTextId));
  }

  const translations: Translations = {};
  for (const [locale, strings] of Object.entries(locales)) {
    const filtered: Record<string, string> = {};
    for (const id of neededIds) {
      if (id in strings) {
        filtered[id] = strings[id];
      }
    }
    translations[locale] = filtered;
  }

  return translations;
}

export function transform(
  gameData: RawGameData,
  locales: LocaleMap
): TransformedData {
  const ages = transformAges(gameData);
  const units = transformUnits(gameData);
  const techs = transformTechs(gameData);
  const buildings = transformBuildings(gameData);
  const civs = transformCivs(gameData);
  const translations = buildTranslations(
    locales,
    ages,
    units,
    techs,
    buildings,
    civs
  );

  console.log(
    `Transformed: ${ages.length} ages, ${units.length} units, ` +
      `${techs.length} techs, ${buildings.length} buildings, ` +
      `${civs.length} civs, ${Object.keys(translations).length} locales`
  );

  return { ages, units, techs, buildings, civs, translations };
}
