/** Raw type definitions matching the structure of data/data.json and data/trees/<CIV>.json */

export interface RawArmourOrAttack {
  Amount: number;
  Class: number;
}

export interface RawCost {
  Food?: number;
  Wood?: number;
  Gold?: number;
  Stone?: number;
}

export interface RawUnit {
  ID: number;
  internal_name: string;
  LanguageNameId: number;
  HP: number;
  LineOfSight: number;
  GarrisonCapacity: number;
  Cost: RawCost;
  TrainTime: number;
  Speed: number;
  Attack: number;
  AttackDelaySeconds: number;
  Attacks: RawArmourOrAttack[];
  AccuracyPercent: number;
  Range: number;
  MinRange: number;
  ReloadTime: number;
  MeleeArmor: number;
  PierceArmor: number;
  Armours: RawArmourOrAttack[];
  ChargeEvent: number;
  ChargeType: number;
  MaxCharge: number;
  RechargeRate: number;
  FrameDelay: number;
  Trait: number;
  TraitPiece: number;
  BlastWidth: number;
}

export interface RawTech {
  ID: number;
  internal_name: string;
  LanguageNameId: number;
  Cost: RawCost;
  ResearchTime: number;
  Repeatable: boolean;
}

export interface RawBuilding {
  ID: number;
  internal_name: string;
  LanguageNameId: number;
  HP: number;
  LineOfSight: number;
  GarrisonCapacity: number;
  Cost: RawCost;
  TrainTime: number;
  Attack: number;
  Attacks: RawArmourOrAttack[];
  AccuracyPercent: number;
  Range: number;
  MinRange: number;
  ReloadTime: number;
  MeleeArmor: number;
  PierceArmor: number;
  Armours: RawArmourOrAttack[];
}

export interface RawUnitUpgrade {
  ID: number;
  internal_name: string;
  Cost: RawCost;
  ResearchTime: number;
}

export interface RawCivInfo {
  Building: number[];
  Tech: number[];
  Unit: number[];
  era: string;
  help_string_id: number;
  internal_name: string;
  meta: Record<string, unknown>;
  name_string_id: number;
}

/** A node in a civ's tech tree layout file (data/trees/<CIV>.json) */
export interface RawTreeNode {
  age_id: number;
  building_id: number | null;
  help_string_id: number;
  id: string;
  link_id: number | null;
  link_node_type: string | null;
  name: string;
  name_string_id: number;
  node_id: number;
  node_status: string;
  node_type: string | null;
  picture_index: number;
  row: number;
  use_type: "Building" | "Tech" | "Unit";
}

export interface RawTree {
  buildings: RawTreeNode[];
  units_techs: RawTreeNode[];
}

export type RawTreeMap = Record<string, RawTree>;

export interface RawGameData {
  age_names: Record<string, string[]>;
  civs: Record<string, RawCivInfo>;
  data: {
    Unit: Record<string, RawUnit>;
    Tech: Record<string, RawTech>;
    Building: Record<string, RawBuilding>;
    unit_upgrades: Record<string, RawUnitUpgrade>;
  };
  tech_tree_strings: Record<string, string>;
}

export type LocaleMap = Record<string, Record<string, string>>;
