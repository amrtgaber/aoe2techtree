export const buildings: any = [
  {
    buildingName: 'barracks',
    units: [
      { unitName: 'militia' },
      { unitName: 'man-at-arms' },
      { unitName: 'spearman' },
      { unitName: 'eagle scout' },
      { unitName: 'long swordsman' },
      { unitName: 'pikeman' },
      { unitName: 'eagle warrior' },
      { unitName: 'huskarl' },
      { unitName: 'elite huskarl' },
      { unitName: 'two-handed swordsman' },
      { unitName: 'champion' },
      { unitName: 'halberdier' },
      { unitName: 'elite eagle warrior' },
      { unitName: 'condottiero' },
      { unitName: 'legionary' },
    ],
    techs: [
      { techName: 'supplies' },
      { techName: 'squires' },
      { techName: 'arson' },
      { techName: 'gambesons' },
    ],
    age: 'dark age',
  },
  {
    buildingName: 'dock',
    units: [
      { unitName: 'fishing ship' },
      { unitName: 'transport ship' },
      { unitName: 'fire galley' },
      { unitName: 'trade cog' },
      { unitName: 'demolition raft' },
      { unitName: 'galley' },
      { unitName: 'fire ship' },
      { unitName: 'demolition ship' },
      { unitName: 'war galley' },
      { unitName: 'turtle ship' },
      { unitName: 'longboat' },
      { unitName: 'caravel' },
      { unitName: 'fast fire ship' },
      { unitName: 'cannon galleon' },
      { unitName: 'heavy demolition ship' },
      { unitName: 'galleon' },
      { unitName: 'elite turtle ship' },
      { unitName: 'elite longboat' },
      { unitName: 'elite caravel' },
      { unitName: 'thirisadai' },
      { unitName: 'elite cannon galleon' },
      { unitName: 'dromon' },
    ],
    techs: [
      { techName: 'gillnets' },
      { techName: 'careening' },
      { techName: 'dry dock' },
      { techName: 'shipwright' },
    ],
    age: 'dark age',
  },
  {
    buildingName: 'siege workshop',
    units: [
      { unitName: 'battering ram' },
      { unitName: 'armored elephant' },
      { unitName: 'mangonel' },
      { unitName: 'scorpion' },
      { unitName: 'siege tower' },
      { unitName: 'capped ram' },
      { unitName: 'siege elephant' },
      { unitName: 'onager' },
      { unitName: 'heavy scorpion' },
      { unitName: 'bombard cannon' },
      { unitName: 'siege ram' },
      { unitName: 'siege onager' },
      { unitName: 'houfnice' },
    ],
    techs: [],
    age: 'castle age',
  },
  { buildingName: 'farm', units: [], techs: [], age: 'dark age' },
  {
    buildingName: 'mill',
    units: [],
    techs: [
      { techName: 'horse collar' },
      { techName: 'heavy plow' },
      { techName: 'crop rotation' },
    ],
    age: 'dark age',
  },
  { buildingName: 'house', units: [], techs: [], age: 'dark age' },
  {
    buildingName: 'town center',
    units: [{ unitName: 'villager' }, { unitName: 'flemish militia' }],
    techs: [
      { techName: 'feudal age' },
      { techName: 'loom' },
      { techName: 'town watch' },
      { techName: 'castle age' },
      { techName: 'wheelbarrow' },
      { techName: 'town patrol' },
      { techName: 'imperial age' },
      { techName: 'hand cart' },
    ],
    age: 'castle age',
  },
  { buildingName: 'palisade wall', units: [], techs: [], age: 'dark age' },
  { buildingName: 'watch tower', units: [], techs: [], age: 'feudal age' },
  {
    buildingName: 'castle',
    units: [
      { unitName: 'petard' },
      { unitName: 'trebuchet' },
      { unitName: 'flaming camel' },
      { unitName: 'composite bowman' },
      { unitName: 'elite composite bowman' },
      { unitName: 'jaguar warrior' },
      { unitName: 'elite jaguar warrior' },
      { unitName: 'ratha' },
      { unitName: 'elite ratha' },
      { unitName: 'camel archer' },
      { unitName: 'elite camel archer' },
      { unitName: 'hussite wagon' },
      { unitName: 'elite hussite wagon' },
      { unitName: 'longbowman' },
      { unitName: 'elite longbowman' },
      { unitName: 'konnik' },
      { unitName: 'elite konnik' },
      { unitName: 'coustillier' },
      { unitName: 'elite coustillier' },
      { unitName: 'arambai' },
      { unitName: 'elite arambai' },
      { unitName: 'cataphract' },
      { unitName: 'elite cataphract' },
      { unitName: 'woad raider' },
      { unitName: 'elite woad raider' },
      { unitName: 'chu ko nu' },
      { unitName: 'elite chu ko nu' },
      { unitName: 'kipchak' },
      { unitName: 'elite kipchak' },
      { unitName: 'urumi swordsman' },
      { unitName: 'elite urumi swordsman' },
      { unitName: 'shotel warrior' },
      { unitName: 'elite shotel warrior' },
      { unitName: 'throwing axeman' },
      { unitName: 'elite throwing axeman' },
      { unitName: 'monaspa' },
      { unitName: 'elite monaspa' },
      { unitName: 'huskarl' },
      { unitName: 'elite huskarl' },
      { unitName: 'chakram thrower' },
      { unitName: 'elite chakram thrower' },
      { unitName: 'ghulam' },
      { unitName: 'elite ghulam' },
      { unitName: 'tarkan' },
      { unitName: 'elite tarkan' },
      { unitName: 'kamayuk' },
      { unitName: 'elite kamayuk' },
      { unitName: 'genoese crossbowman' },
      { unitName: 'elite genoese crossbowman' },
      { unitName: 'samurai' },
      { unitName: 'elite samurai' },
      { unitName: 'ballista elephant' },
      { unitName: 'elite ballista elephant' },
      { unitName: 'war wagon' },
      { unitName: 'elite war wagon' },
      { unitName: 'leitis' },
      { unitName: 'elite leitis' },
      { unitName: 'magyar huszar' },
      { unitName: 'elite magyar huszar' },
      { unitName: 'karambit warrior' },
      { unitName: 'elite karambit warrior' },
      { unitName: 'gbeto' },
      { unitName: 'elite gbeto' },
      { unitName: 'plumed archer' },
      { unitName: 'elite plumed archer' },
      { unitName: 'mangudai' },
      { unitName: 'elite mangudai' },
      { unitName: 'war elephant' },
      { unitName: 'elite war elephant' },
      { unitName: 'obuch' },
      { unitName: 'elite obuch' },
      { unitName: 'organ gun' },
      { unitName: 'elite organ gun' },
      { unitName: 'centurion' },
      { unitName: 'elite centurion' },
      { unitName: 'mameluke' },
      { unitName: 'elite mameluke' },
      { unitName: 'serjeant' },
      { unitName: 'elite serjeant' },
      { unitName: 'boyar' },
      { unitName: 'elite boyar' },
      { unitName: 'conquistador' },
      { unitName: 'elite conquistador' },
      { unitName: 'keshik' },
      { unitName: 'elite keshik' },
      { unitName: 'teutonic knight' },
      { unitName: 'elite teutonic knight' },
      { unitName: 'janissary' },
      { unitName: 'elite janissary' },
      { unitName: 'rattan archer' },
      { unitName: 'elite rattan archer' },
      { unitName: 'berserk' },
      { unitName: 'elite berserk' },
    ],
    techs: [
      { techName: 'hoardings' },
      { techName: 'sappers' },
      { techName: 'conscription' },
      { techName: 'spies - treason' },
      { techName: 'cilician fleet' },
      { techName: 'fereters' },
      { techName: 'atlatl' },
      { techName: 'garland wars' },
      { techName: 'paiks' },
      { techName: 'mahayana' },
      { techName: 'kasbah' },
      { techName: 'maghrebi camels' },
      { techName: 'wagenburg tactics' },
      { techName: 'hussite reforms' },
      { techName: 'yeomen' },
      { techName: 'warwolf' },
      { techName: 'stirrups' },
      { techName: 'bagains' },
      { techName: 'burgundian vineyards' },
      { techName: 'flemish revolution' },
      { techName: 'howdah' },
      { techName: 'manipur cavalry' },
      { techName: 'greek fire' },
      { techName: 'logistica' },
      { techName: 'stronghold' },
      { techName: 'furor celtica' },
      { techName: 'great wall' },
      { techName: 'rocketry' },
      { techName: 'steppe husbandry' },
      { techName: 'cuman mercenaries' },
      { techName: 'medical corps' },
      { techName: 'wootz steel' },
      { techName: 'royal heirs' },
      { techName: 'torsion engines' },
      { techName: 'bearded axe' },
      { techName: 'chivalry' },
      { techName: 'svan towers' },
      { techName: 'aznauri cavalry' },
      { techName: 'anarchy' },
      { techName: 'perfusion' },
      { techName: 'kshatriyas' },
      { techName: 'frontier guards' },
      { techName: 'grand trunk road' },
      { techName: 'shatagni' },
      { techName: 'marauders' },
      { techName: 'atheism' },
      { techName: 'andean sling' },
      { techName: 'fabric shields' },
      { techName: 'pavise' },
      { techName: 'silk road' },
      { techName: 'yasama' },
      { techName: 'kataparuto' },
      { techName: 'tusk swords' },
      { techName: 'double crossbow' },
      { techName: 'eupseong' },
      { techName: 'shinkichon' },
      { techName: 'hill forts' },
      { techName: 'tower shields' },
      { techName: 'corvinian army' },
      { techName: 'recurve bow' },
      { techName: 'thalassocracy' },
      { techName: 'forced levy' },
      { techName: 'tigui' },
      { techName: 'farimba' },
      { techName: "hul'che javelineers" },
      { techName: 'el dorado' },
      { techName: 'nomads' },
      { techName: 'drill' },
      { techName: 'kamandaran' },
      { techName: 'citadels' },
      { techName: 'szlachta privileges' },
      { techName: 'lechitic legacy' },
      { techName: 'carrack' },
      { techName: 'arquebus' },
      { techName: 'ballistas' },
      { techName: 'comitatenses' },
      { techName: 'bimaristan' },
      { techName: 'counterweights' },
      { techName: 'first crusade' },
      { techName: 'hauberk' },
      { techName: 'detinets' },
      { techName: 'druzhina' },
      { techName: 'inquisition' },
      { techName: 'supremacy' },
      { techName: 'silk armor' },
      { techName: 'timurid siegecraft' },
      { techName: 'ironclad' },
      { techName: 'crenellations' },
      { techName: 'sipahi' },
      { techName: 'artillery' },
      { techName: 'chatras' },
      { techName: 'paper money' },
      { techName: 'chieftains' },
      { techName: 'bogsveigar' },
    ],
    age: 'castle age',
  },
  {
    buildingName: 'market',
    units: [{ unitName: 'trade cart' }],
    techs: [
      { techName: 'coinage' },
      { techName: 'caravan' },
      { techName: 'banking' },
      { techName: 'guilds' },
    ],
    age: 'feudal age',
  },
  {
    buildingName: 'archery range',
    units: [
      { unitName: 'archer' },
      { unitName: 'skirmisher' },
      { unitName: 'crossbowman' },
      { unitName: 'elite skirmisher' },
      { unitName: 'slinger' },
      { unitName: 'cavalry archer' },
      { unitName: 'elephant archer' },
      { unitName: 'genitour' },
      { unitName: 'arbalester' },
      { unitName: 'imperial skirmisher' },
      { unitName: 'hand cannoneer' },
      { unitName: 'heavy cavalry archer' },
      { unitName: 'elite elephant archer' },
      { unitName: 'elite genitour' },
    ],
    techs: [{ techName: 'thumb ring' }, { techName: 'parthian tactics' }],
    age: 'feudal age',
  },
  {
    buildingName: 'stable',
    units: [
      { unitName: 'scout cavalry' },
      { unitName: 'camel scout' },
      { unitName: 'light cavalry' },
      { unitName: 'shrivamsha rider' },
      { unitName: 'camel rider' },
      { unitName: 'knight' },
      { unitName: 'battle elephant' },
      { unitName: 'steppe lancer' },
      { unitName: 'xolotl warrior' },
      { unitName: 'tarkan' },
      { unitName: 'elite tarkan' },
      { unitName: 'hussar' },
      { unitName: 'elite shrivamsha rider' },
      { unitName: 'heavy camel rider' },
      { unitName: 'cavalier' },
      { unitName: 'elite battle elephant' },
      { unitName: 'elite steppe lancer' },
      { unitName: 'winged hussar' },
      { unitName: 'imperial camel rider' },
      { unitName: 'paladin' },
      { unitName: 'savar' },
    ],
    techs: [{ techName: 'bloodlines' }, { techName: 'husbandry' }],
    age: 'feudal age',
  },
  {
    buildingName: 'blacksmith',
    units: [],
    techs: [
      { techName: 'padded archer armor' },
      { techName: 'fletching' },
      { techName: 'forging' },
      { techName: 'scale barding armor' },
      { techName: 'scale mail armor' },
      { techName: 'leather archer armor' },
      { techName: 'bodkin arrow' },
      { techName: 'iron casting' },
      { techName: 'chain barding armor' },
      { techName: 'chain mail armor' },
      { techName: 'ring archer armor' },
      { techName: 'bracer' },
      { techName: 'blast furnace' },
      { techName: 'plate barding armor' },
      { techName: 'plate mail armor' },
    ],
    age: 'feudal age',
  },
  {
    buildingName: 'monastery',
    units: [{ unitName: 'monk' }, { unitName: 'missionary' }],
    techs: [
      { techName: 'redemption' },
      { techName: 'atonement' },
      { techName: 'herbal medicine' },
      { techName: 'heresy' },
      { techName: 'sanctity' },
      { techName: 'fervor' },
      { techName: 'devotion' },
      { techName: 'faith' },
      { techName: 'illumination' },
      { techName: 'block printing' },
      { techName: 'theocracy' },
    ],
    age: 'castle age',
  },
  { buildingName: 'stone wall', units: [], techs: [], age: 'feudal age' },
  { buildingName: 'fortified wall', units: [], techs: [], age: 'castle age' },
  { buildingName: 'fish trap', units: [], techs: [], age: 'feudal age' },
  {
    buildingName: 'university',
    units: [],
    techs: [
      { techName: 'masonry' },
      { techName: 'fortified wall' },
      { techName: 'ballistics' },
      { techName: 'guard tower' },
      { techName: 'heated shot' },
      { techName: 'murder holes' },
      { techName: 'treadmill crane' },
      { techName: 'architecture' },
      { techName: 'chemistry' },
      { techName: 'siege engineers' },
      { techName: 'keep' },
      { techName: 'arrowslits' },
      { techName: 'bombard tower' },
    ],
    age: 'castle age',
  },
  { buildingName: 'guard tower', units: [], techs: [], age: 'castle age' },
  { buildingName: 'keep', units: [], techs: [], age: 'imperial age' },
  { buildingName: 'bombard tower', units: [], techs: [], age: 'imperial age' },
  { buildingName: 'wonder', units: [], techs: [], age: 'imperial age' },
  { buildingName: 'gate', units: [], techs: [], age: 'feudal age' },
  {
    buildingName: 'lumber camp',
    units: [],
    techs: [
      { techName: 'double-bit axe' },
      { techName: 'bow saw' },
      { techName: 'two-man saw' },
    ],
    age: 'dark age',
  },
  {
    buildingName: 'mining camp',
    units: [],
    techs: [
      { techName: 'gold mining' },
      { techName: 'stone mining' },
      { techName: 'gold shaft mining' },
      { techName: 'stone shaft mining' },
    ],
    age: 'dark age',
  },
  { buildingName: 'outpost', units: [], techs: [], age: 'dark age' },
  { buildingName: 'palisade gate', units: [], techs: [], age: 'dark age' },
  { buildingName: 'feitoria', units: [], techs: [], age: 'imperial age' },
  {
    buildingName: 'harbor',
    units: [
      { unitName: 'fishing ship' },
      { unitName: 'transport ship' },
      { unitName: 'fire galley' },
      { unitName: 'trade cog' },
      { unitName: 'demolition raft' },
      { unitName: 'galley' },
      { unitName: 'fire ship' },
      { unitName: 'demolition ship' },
      { unitName: 'war galley' },
      { unitName: 'fast fire ship' },
      { unitName: 'cannon galleon' },
      { unitName: 'galleon' },
      { unitName: 'elite cannon galleon' },
    ],
    techs: [
      { techName: 'gillnets' },
      { techName: 'careening' },
      { techName: 'dry dock' },
      { techName: 'shipwright' },
    ],
    age: 'castle age',
  },
  {
    buildingName: 'krepost',
    units: [{ unitName: 'konnik' }, { unitName: 'elite konnik' }],
    techs: [],
    age: 'castle age',
  },
  {
    buildingName: 'donjon',
    units: [
      { unitName: 'serjeant' },
      { unitName: 'spearman' },
      { unitName: 'pikeman' },
      { unitName: 'elite serjeant' },
      { unitName: 'halberdier' },
    ],
    techs: [],
    age: 'feudal age',
  },
  {
    buildingName: 'folwark',
    units: [],
    techs: [
      { techName: 'horse collar' },
      { techName: 'heavy plow' },
      { techName: 'crop rotation' },
    ],
    age: 'dark age',
  },
  { buildingName: 'caravanserai', units: [], techs: [], age: 'imperial age' },
  {
    buildingName: 'fortified church',
    units: [{ unitName: 'monk' }, { unitName: 'warrior priest' }],
    techs: [
      { techName: 'redemption' },
      { techName: 'atonement' },
      { techName: 'herbal medicine' },
      { techName: 'heresy' },
      { techName: 'sanctity' },
      { techName: 'fervor' },
      { techName: 'devotion' },
      { techName: 'faith' },
      { techName: 'illumination' },
      { techName: 'block printing' },
      { techName: 'theocracy' },
    ],
    age: 'castle age',
  },
  {
    buildingName: 'mule cart',
    units: [],
    techs: [
      { techName: 'double-bit axe' },
      { techName: 'bow saw' },
      { techName: 'two-man saw' },
      { techName: 'gold mining' },
      { techName: 'stone mining' },
      { techName: 'gold shaft mining' },
      { techName: 'stone shaft mining' },
    ],
    age: 'dark age',
  },
];
