import fs from 'fs';

import DATA from '../data/data.json';
import STRINGS from '../data/locales/en/strings.json';

import {
  ConvertedBuilding,
  ConvertedTech,
  ConvertedUnit,
  ConvertedCiv,
  DataBuildings,
  DataTechs,
  DataUnits,
  DataTechTrees,
  DataUniques,
  LocaleStrings,
} from './data-conversion-types';

// globals
export const OUTPUT_DIR = './converted-data';

const ENGLISH_STRINGS = STRINGS as LocaleStrings;

const TECH_TREES = DATA.techtrees as DataTechTrees;
const UNITS = DATA.data.units as DataUnits;
const TECHS = DATA.data.techs as DataTechs;
const BUILDINGS = DATA.data.buildings as DataBuildings;

export let unitsWriteStream: fs.WriteStream;
export let techsWriteStream: fs.WriteStream;
export let buildingsWriteStream: fs.WriteStream;
export let civsWriteStream: fs.WriteStream;

// main()
createImageFolders();

openWriteStreams();

convertAllUnits(`${OUTPUT_DIR}/units.json`);
convertAllTechs(`${OUTPUT_DIR}/techs.json`);
convertAllBuildings(`${OUTPUT_DIR}/buildings.json`);
convertAllCivs(`${OUTPUT_DIR}/tech-trees.json`);

/**
 * preps the folders to copy the images into
 */
function createImageFolders() {
  fs.rmSync(`${OUTPUT_DIR}/images`, { recursive: true, force: true });
  fs.mkdirSync(`${OUTPUT_DIR}/images`);
  fs.mkdirSync(`${OUTPUT_DIR}/images/units`);
  fs.mkdirSync(`${OUTPUT_DIR}/images/techs`);
  fs.mkdirSync(`${OUTPUT_DIR}/images/buildings`);
}

export function openWriteStreams() {
  unitsWriteStream = fs.createWriteStream(`${OUTPUT_DIR}/units.ts`);
  unitsWriteStream.write('export const units: any = ');

  techsWriteStream = fs.createWriteStream(`${OUTPUT_DIR}/techs.ts`);
  techsWriteStream.write('export const techs: any = ');

  buildingsWriteStream = fs.createWriteStream(`${OUTPUT_DIR}/buildings.ts`);
  buildingsWriteStream.write('export const buildings: any = ');

  civsWriteStream = fs.createWriteStream(`${OUTPUT_DIR}/civs.ts`);
  civsWriteStream.write('export const civs: any = ');
}

function copyImageFile(id: string, name: string, srcDir: string) {
  const imgSrc = `../img/${srcDir}/${id}.png`;

  if (fs.existsSync(imgSrc)) {
    fs.copyFileSync(
      imgSrc,
      `${OUTPUT_DIR}/images/${srcDir.toLowerCase()}/${name}.png`,
    );
  }
}

/**
 * converts all units to the aoe2-data-api format then writes to file
 * @param filename
 */
function convertAllUnits(filename: string) {
  const unitNames = new Set<string>();

  for (const unit in UNITS) {
    const nameId = UNITS[unit].LanguageNameId;
    const unitName = ENGLISH_STRINGS[nameId].toLowerCase();

    if (!(unitName.includes('melee') || unitName.includes('dismounted'))) {
      unitNames.add(unitName);
      copyImageFile(unit, unitName, 'Units');
    }
  }

  const units: ConvertedUnit[] = [...unitNames].map((unitName) => {
    return { unitName };
  });

  writeToFile(units, unitsWriteStream);
  unitsWriteStream.write(';');
}

/**
 * converts all techs to the aoe2-data-api format then writes to file
 * @param filename
 */
function convertAllTechs(filename: string) {
  const techNames = new Set<string>();

  for (const tech in TECHS) {
    const nameId = TECHS[tech].LanguageNameId;
    let techName = ENGLISH_STRINGS[nameId].toLowerCase();

    if (techName === 'tracking' || techName === 'cartography') continue;
    if (techName === 'spies/treason') techName = 'spies - treason';

    techNames.add(techName);

    copyImageFile(tech, techName, 'Techs');
  }

  const techs: ConvertedTech[] = [...techNames].map((techName) => {
    return { techName };
  });

  writeToFile(techs, techsWriteStream);
  techsWriteStream.write(';');
}

/**
 * converts all buildings to the aoe2-data-api format then writes to file
 * @param filename
 */
function convertAllBuildings(filename: string) {
  const buildingNames = new Set<string>();

  for (const building in BUILDINGS) {
    const nameId = BUILDINGS[building].LanguageNameId;
    const buildingName = ENGLISH_STRINGS[nameId].toLowerCase();
    buildingNames.add(buildingName);

    copyImageFile(building, buildingName, 'Buildings');
  }

  const buildings: ConvertedBuilding[] = [...buildingNames].map(
    (buildingName) => {
      return { buildingName };
    },
  );

  writeToFile(buildings, buildingsWriteStream);
  buildingsWriteStream.write(';');
}

/**
 * converts all tech trees to the aoe2-data-api format then writes to file
 * @param filename
 */
function convertAllCivs(filename: string) {
  const convertedCivs: ConvertedCiv[] = [];

  for (const civName in TECH_TREES) {
    const civ = TECH_TREES[civName];

    const convertedCiv: ConvertedCiv = {
      civName: `${civName}`,
      units: [],
      techs: [],
      buildings: [],
    };

    convertedCiv.units = convertCivUnits(civ.units);
    convertedCiv.techs = convertCivTechs(civ.techs);
    convertedCiv.buildings = convertCivBuildings(civ.buildings);

    const { uniqueUnits, uniqueTechs } = convertUniques(civ.unique);
    convertedCiv.units = [...convertedCiv.units, ...uniqueUnits];
    convertedCiv.techs = [...convertedCiv.techs, ...uniqueTechs];

    convertedCivs.push(convertedCiv);
  }

  writeToFile(convertedCivs, civsWriteStream);
  civsWriteStream.write(';');
}

/**
 * converts units from 1 civs tech tree
 * @param unitIds
 * @returns
 */
function convertCivUnits(unitIds: number[]): ConvertedUnit[] {
  const unitNames = new Set<string>();

  unitIds.forEach((unitId) => {
    const nameId = UNITS[unitId.toString()].LanguageNameId;
    const unitName = ENGLISH_STRINGS[nameId].toLowerCase();
    if (!(unitName.includes('melee') || unitName.includes('dismounted'))) {
      unitNames.add(unitName);
    }
  });

  const units: ConvertedUnit[] = [...unitNames].map((unitName) => {
    return { unitName };
  });

  return units;
}

/**
 * converts techs from 1 civs tech tree
 * @param unitIds
 * @returns
 */
function convertCivTechs(techIds: number[]): ConvertedTech[] {
  const techNames = new Set<string>();

  techIds.forEach((techId) => {
    const nameId = TECHS[techId.toString()].LanguageNameId;
    let techName = ENGLISH_STRINGS[nameId].toLowerCase();

    if (techName === 'tracking' || techName === 'cartography') return;
    if (techName === 'spies/treason') techName = 'spies - treason';

    techNames.add(techName);
  });

  const techs: ConvertedTech[] = [...techNames].map((techName) => {
    return { techName };
  });

  return techs;
}

/**
 * converts buildings from 1 civs tech tree
 * @param unitIds
 * @returns
 */
function convertCivBuildings(buildingsId: number[]): ConvertedBuilding[] {
  const buildingNames = new Set<string>();

  buildingsId.forEach((buildingId) => {
    const nameId = BUILDINGS[buildingId.toString()].LanguageNameId;
    const buildingName = ENGLISH_STRINGS[nameId].toLowerCase();
    buildingNames.add(buildingName);
  });

  const buildings: ConvertedBuilding[] = [...buildingNames].map(
    (buildingName) => {
      return { buildingName };
    },
  );

  return buildings;
}

/**
 * converts unique units and techs for 1 civs tech tree
 * @param uniques
 * @returns
 */
function convertUniques(uniques: DataUniques): {
  uniqueUnits: ConvertedUnit[];
  uniqueTechs: ConvertedTech[];
} {
  const castleUnitId = UNITS[uniques.castleAgeUniqueUnit].LanguageNameId;
  const castleUnit = ENGLISH_STRINGS[castleUnitId].toLowerCase();

  const impUnitId = UNITS[uniques.imperialAgeUniqueUnit].LanguageNameId;
  const impUnit = ENGLISH_STRINGS[impUnitId].toLowerCase();

  const castleTechId = TECHS[uniques.castleAgeUniqueTech].LanguageNameId;
  const castleTech = ENGLISH_STRINGS[castleTechId].toLowerCase();

  const impTechId = TECHS[uniques.imperialAgeUniqueTech].LanguageNameId;
  const impTech = ENGLISH_STRINGS[impTechId].toLowerCase();

  return {
    uniqueUnits: [{ unitName: castleUnit }, { unitName: impUnit }],
    uniqueTechs: [{ techName: castleTech }, { techName: impTech }],
  };
}

/**
 * writes data to stream
 * @param data
 * @param writeStream
 */
export function writeToFile(data: any, writeStream: fs.WriteStream) {
  const jsonString = JSON.stringify(data, null, '');
  writeStream.write(jsonString);
}
