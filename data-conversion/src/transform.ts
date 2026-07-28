import type {
  RawGameData,
  RawTreeMap,
  RawTreeNode,
  LocaleMap,
  RawCost,
} from "./types.js";
import type {
  Age,
  Unit,
  Tech,
  Building,
  Civ,
  UnitUpgrade,
  Translations,
} from "./schemas.js";

export interface TransformedData {
  ages: Age[];
  units: Unit[];
  techs: Tech[];
  buildings: Building[];
  civs: Civ[];
  unitUpgrades: UnitUpgrade[];
  translations: Translations;
}

// Node IDs that duplicate a unique unit at a second building (e.g. Huskarl at
// the Barracks with Anarchy); the data format lists civ units once, at their
// primary building.
const DUPLICATE_UNIT_NODES = new Set([
  759, // Huskarl (Barracks)
  761, // Elite Huskarl (Barracks)
  886, // Tarkan (Stable)
  887, // Elite Tarkan (Stable)
  1260, // Elite Kipchak (Cuman Mercenaries)
]);

// The Xolotl Warrior is trainable by the meso civs at a converted enemy
// Stable, and is absent from the game's tech tree export, so it has to be
// added manually.
const XOLOTL_WARRIOR_ID = 1570;
const XOLOTL_WARRIOR_AGE = 3;
const XOLOTL_CIVS = new Set(["Aztecs", "Incas", "Mayans"]);
const STABLE_ID = 101;

const CASTLE_ID = 82;
const CASTLE_AGE = 3;
const IMPERIAL_AGE = 4;
// Unique techs carry the generic unique-tech scroll icons rather than a
// tech-specific picture, which distinguishes them from the shared castle techs.
const CASTLE_UNIQUE_TECH_PICTURE = 33;
const IMPERIAL_UNIQUE_TECH_PICTURE = 107;

// A tree node's help_string_id minus this offset is the key of the help text
// in the locale files (the same rule generateDataFiles.py uses to decide
// which strings to ship).
const NODE_HELP_STRING_OFFSET = 79000;
// For entities without a tree node, the help text key is the name key plus
// this offset.
const FALLBACK_HELP_STRING_OFFSET = 21000;

interface StringIds {
  nameId: number;
  helpId: number;
}

/**
 * data.json no longer carries help string IDs, and its name IDs point at
 * strings the locale files no longer ship. The tech tree nodes carry the
 * string IDs the locale files are built from, so index those per entity.
 */
function buildStringIdIndex(trees: RawTreeMap): Map<string, StringIds> {
  const index = new Map<string, StringIds>();
  for (const tree of Object.values(trees)) {
    for (const node of [...tree.buildings, ...tree.units_techs]) {
      const key = `${node.use_type}:${node.node_id}`;
      if (!index.has(key)) {
        index.set(key, {
          nameId: node.name_string_id,
          helpId: node.help_string_id - NODE_HELP_STRING_OFFSET,
        });
      }
    }
  }
  return index;
}

function stringIdsFor(
  index: Map<string, StringIds>,
  useType: "Unit" | "Tech" | "Building",
  raw: { ID: number; LanguageNameId: number }
): StringIds {
  // Entities absent from every civ's tree (e.g. the unpacked Trebuchet or
  // the Xolotl Warrior) keep their raw name ID, which the locale files cover
  // through the generator's extra_ids list.
  return (
    index.get(`${useType}:${raw.ID}`) ?? {
      nameId: raw.LanguageNameId,
      helpId: raw.LanguageNameId + FALLBACK_HELP_STRING_OFFSET,
    }
  );
}

function isAvailable(node: RawTreeNode): boolean {
  return node.node_status !== "NotAvailable";
}

function isCastleAgeUniqueUnit(node: RawTreeNode): boolean {
  return (
    node.node_type === "UniqueUnit" &&
    node.building_id === CASTLE_ID &&
    node.age_id === CASTLE_AGE &&
    node.link_node_type === "BuildingTech"
  );
}

function isImperialAgeUniqueUnit(node: RawTreeNode): boolean {
  return (
    node.node_type === "UniqueUnit" &&
    node.building_id === CASTLE_ID &&
    node.age_id === IMPERIAL_AGE &&
    node.link_node_type === "UniqueUnit"
  );
}

function isCastleAgeUniqueTech(node: RawTreeNode): boolean {
  return (
    node.node_type === "Research" &&
    node.building_id === CASTLE_ID &&
    node.age_id === CASTLE_AGE &&
    node.link_node_type === "BuildingTech" &&
    node.picture_index === CASTLE_UNIQUE_TECH_PICTURE
  );
}

function isImperialAgeUniqueTech(node: RawTreeNode): boolean {
  return (
    node.node_type === "Research" &&
    node.building_id === CASTLE_ID &&
    node.age_id === IMPERIAL_AGE &&
    node.link_node_type === "BuildingTech" &&
    node.picture_index === IMPERIAL_UNIQUE_TECH_PICTURE
  );
}

/** Building IDs each unit is trained at / each tech is researched at. */
interface TrainingLocations {
  units: Map<number, Set<number>>;
  techs: Map<number, Set<number>>;
}

// Locations are a structural fact of the tech tree, so NotAvailable nodes
// count too (a civ lacking the Elite Cannon Galleon doesn't change where
// it is trained).
function buildTrainingLocations(trees: RawTreeMap): TrainingLocations {
  const units = new Map<number, Set<number>>();
  const techs = new Map<number, Set<number>>();
  for (const tree of Object.values(trees)) {
    for (const node of tree.units_techs) {
      if (node.building_id === null) {
        continue;
      }
      const target =
        node.use_type === "Unit"
          ? units
          : node.use_type === "Tech"
            ? techs
            : null;
      if (target === null) {
        continue;
      }
      let locations = target.get(node.node_id);
      if (locations === undefined) {
        locations = new Set();
        target.set(node.node_id, locations);
      }
      locations.add(node.building_id);
    }
  }
  units.set(XOLOTL_WARRIOR_ID, new Set([STABLE_ID]));
  return { units, techs };
}

function locationList(
  locations: Map<number, Set<number>>,
  id: number
): number[] {
  return [...(locations.get(id) ?? [])].sort((a, b) => a - b);
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
  // The "base" era lists the four age name string IDs in age order
  // (1=Dark, 2=Feudal, 3=Castle, 4=Imperial)
  return gameData.age_names.base.map((langId, index) => ({
    id: index + 1,
    languageNameId: Number(langId),
  }));
}

function transformUnits(
  gameData: RawGameData,
  stringIds: Map<string, StringIds>,
  locations: TrainingLocations
): Unit[] {
  return Object.values(gameData.data.Unit).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: stringIdsFor(stringIds, "Unit", raw).nameId,
    languageHelpId: stringIdsFor(stringIds, "Unit", raw).helpId,
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
    trainedAt: locationList(locations.units, raw.ID),
  }));
}

function transformTechs(
  gameData: RawGameData,
  stringIds: Map<string, StringIds>,
  locations: TrainingLocations
): Tech[] {
  return Object.values(gameData.data.Tech).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: stringIdsFor(stringIds, "Tech", raw).nameId,
    languageHelpId: stringIdsFor(stringIds, "Tech", raw).helpId,
    cost: transformCost(raw.Cost),
    researchTime: raw.ResearchTime,
    repeatable: raw.Repeatable,
    researchedAt: locationList(locations.techs, raw.ID),
  }));
}

function transformUnitUpgrades(gameData: RawGameData): UnitUpgrade[] {
  return Object.entries(gameData.data.unit_upgrades)
    .map(([unitId, raw]) => ({
      id: Number(unitId),
      internalName: raw.internal_name,
      techId: raw.ID,
      cost: transformCost(raw.Cost),
      researchTime: raw.ResearchTime,
    }))
    .sort((a, b) => a.id - b.id);
}

function transformBuildings(
  gameData: RawGameData,
  stringIds: Map<string, StringIds>
): Building[] {
  return Object.values(gameData.data.Building).map((raw) => ({
    id: raw.ID,
    internalName: raw.internal_name,
    languageNameId: stringIdsFor(stringIds, "Building", raw).nameId,
    languageHelpId: stringIdsFor(stringIds, "Building", raw).helpId,
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

function transformCivs(gameData: RawGameData, trees: RawTreeMap): Civ[] {
  return Object.entries(gameData.civs).map(([name, info]) => {
    const tree = trees[name];

    // A unit can appear at more than one building (e.g. the Petard at both
    // Castle and Krepost); keep one entry per ID with its earliest age.
    const buildings = new Map<number, number>();
    const units = new Map<number, number>();
    const techs = new Map<number, number>();
    const addEntry = (map: Map<number, number>, id: number, age: number) => {
      const existing = map.get(id);
      if (existing === undefined || age < existing) {
        map.set(id, age);
      }
    };

    const unique: Partial<Civ["unique"]> = {};
    let monkSuffix = "";

    for (const node of tree.buildings) {
      if (isAvailable(node)) {
        addEntry(buildings, node.node_id, node.age_id);
      }
    }

    for (const node of tree.units_techs) {
      if (node.name === "Monk") {
        monkSuffix = `_${node.picture_index}`;
      }
      if (!isAvailable(node)) {
        continue;
      }
      if (node.use_type === "Building") {
        addEntry(buildings, node.node_id, node.age_id);
      } else if (node.use_type === "Unit") {
        if (isCastleAgeUniqueUnit(node)) {
          unique.castleAgeUniqueUnit = node.node_id;
        } else if (isImperialAgeUniqueUnit(node)) {
          unique.imperialAgeUniqueUnit = node.node_id;
        } else if (!DUPLICATE_UNIT_NODES.has(node.node_id)) {
          addEntry(units, node.node_id, node.age_id);
        }
      } else if (node.use_type === "Tech") {
        if (isCastleAgeUniqueTech(node)) {
          unique.castleAgeUniqueTech = node.node_id;
        } else if (isImperialAgeUniqueTech(node)) {
          unique.imperialAgeUniqueTech = node.node_id;
        } else {
          addEntry(techs, node.node_id, node.age_id);
        }
      }
    }

    if (XOLOTL_CIVS.has(name)) {
      addEntry(units, XOLOTL_WARRIOR_ID, XOLOTL_WARRIOR_AGE);
    }

    const {
      castleAgeUniqueUnit,
      imperialAgeUniqueUnit,
      castleAgeUniqueTech,
      imperialAgeUniqueTech,
    } = unique;
    if (
      castleAgeUniqueUnit === undefined ||
      imperialAgeUniqueUnit === undefined ||
      castleAgeUniqueTech === undefined ||
      imperialAgeUniqueTech === undefined
    ) {
      throw new Error(
        `Could not identify unique units/techs for ${name}: ${JSON.stringify(unique)}`
      );
    }

    const toEntries = (map: Map<number, number>) =>
      [...map.entries()]
        .map(([id, ageId]) => ({ id, ageId }))
        .sort((a, b) => a.id - b.id);

    return {
      name,
      languageNameId: info.name_string_id,
      languageHelpTextId: info.help_string_id,
      monkSuffix,
      unique: {
        castleAgeUniqueUnit,
        imperialAgeUniqueUnit,
        castleAgeUniqueTech,
        imperialAgeUniqueTech,
      },
      units: toEntries(units),
      techs: toEntries(techs),
      buildings: toEntries(buildings),
    };
  });
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
  locales: LocaleMap,
  trees: RawTreeMap
): TransformedData {
  const ages = transformAges(gameData);
  const stringIds = buildStringIdIndex(trees);
  const locations = buildTrainingLocations(trees);
  const units = transformUnits(gameData, stringIds, locations);
  const techs = transformTechs(gameData, stringIds, locations);
  const buildings = transformBuildings(gameData, stringIds);
  const civs = transformCivs(gameData, trees);
  const unitUpgrades = transformUnitUpgrades(gameData);
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
      `${civs.length} civs, ${unitUpgrades.length} unit upgrades, ` +
      `${Object.keys(translations).length} locales`
  );

  return { ages, units, techs, buildings, civs, unitUpgrades, translations };
}
