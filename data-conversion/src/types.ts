/** Raw type definitions matching the structure of data/data.json */

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
  LanguageHelpId: number;
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
  LanguageHelpId: number;
  Cost: RawCost;
  ResearchTime: number;
  Repeatable: boolean;
}

export interface RawBuilding {
  ID: number;
  internal_name: string;
  LanguageNameId: number;
  LanguageHelpId: number;
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

export interface RawTechtreeEntry {
  id: number;
  age: number;
}

export interface RawTechtreeUnique {
  castleAgeUniqueUnit: number;
  imperialAgeUniqueUnit: number;
  castleAgeUniqueTech: number;
  imperialAgeUniqueTech: number;
}

export interface RawTechtree {
  units: RawTechtreeEntry[];
  techs: RawTechtreeEntry[];
  buildings: RawTechtreeEntry[];
  unique: RawTechtreeUnique;
  monkSuffix: string;
}

export interface RawGameData {
  age_names: Record<string, string>;
  civ_names: Record<string, string>;
  civ_helptexts: Record<string, string>;
  data: {
    units: Record<string, RawUnit>;
    techs: Record<string, RawTech>;
    buildings: Record<string, RawBuilding>;
  };
  techtrees: Record<string, RawTechtree>;
}

export type LocaleMap = Record<string, Record<string, string>>;
