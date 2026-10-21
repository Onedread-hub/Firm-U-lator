/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * highfieldsData.ts
 * Authentic historical data for Leicester Highfields (1980-2010).
 * Features 7 vibrant counter-culture subcultural factions, the Leicestershire Police
 * Special Patrol Group / Tactical Unit as the systemic enemy, 10 detailed Highfields sectors,
 * and 30-year historical events leading through riots and community resistance.
 */

import { HighfieldsSector, SubcultureFaction, HistoricEvent } from '../types/diplomacy';

export const HIGHFIELDS_SECTORS: HighfieldsSector[] = [
  {
    id: 'sec_melbourne',
    name: 'Melbourne Road (The Frontline)',
    shortName: 'Melbourne Rd',
    historicalContext: 'The pulsating spine of Highfields black and Caribbean culture. Home to legendary blues parties, West Indian barbers, and sound system yards.',
    x: 48,
    y: 50,
    adjacentSectorIds: ['sec_st_peters', 'sec_conduit', 'sec_sparkenhoe', 'sec_berners'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_rastas',
    barricadeLevel: 3,
    soundSystemPower: 92,
    policeHeat: 65,
    revenueWeekly: 520,
    landmark: 'Frontline Dub Sound HQ & Marcus Garvey Centre'
  },
  {
    id: 'sec_conduit',
    name: 'Conduit Street (The Mega-Squat)',
    shortName: 'Conduit St',
    historicalContext: 'Cavernous squatted Victorian villas, anarcho-punk zine presses, and radical art studios right behind London Road railway line.',
    x: 32,
    y: 42,
    adjacentSectorIds: ['sec_melbourne', 'sec_station', 'sec_moat', 'sec_charles_st'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_punks',
    barricadeLevel: 4,
    soundSystemPower: 78,
    policeHeat: 58,
    revenueWeekly: 340,
    landmark: 'The Black Dog Squat & Anti-Fascist Print Collective'
  },
  {
    id: 'sec_victoria_park',
    name: 'Victoria Park (Peace Camps & Carnival)',
    shortName: 'Victoria Park',
    historicalContext: 'Vast grassy commons hosting free festivals, Anti-Nazi League carnivals, traveller bus encampments, and peace vigils.',
    x: 65,
    y: 78,
    adjacentSectorIds: ['sec_station', 'sec_berners', 'sec_st_peters'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_hippies',
    barricadeLevel: 1,
    soundSystemPower: 80,
    policeHeat: 25,
    revenueWeekly: 280,
    landmark: 'War Memorial Peace Circle & Carnival Stage'
  },
  {
    id: 'sec_station',
    name: 'London Road Station Concourse',
    shortName: 'Station Approach',
    historicalContext: 'Key Victorian transit hub connecting Leicester to Nottingham and London. Battleground for away fans, casuals, and police spotters.',
    x: 28,
    y: 65,
    adjacentSectorIds: ['sec_conduit', 'sec_victoria_park', 'sec_charles_st'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_casuals',
    barricadeLevel: 2,
    soundSystemPower: 45,
    policeHeat: 75,
    revenueWeekly: 490,
    landmark: 'The Hind Hotel & Railway Concourse'
  },
  {
    id: 'sec_st_peters',
    name: 'St Peters High-Rise Estate',
    shortName: 'St Peters',
    historicalContext: '1970s brutalist concrete towers and high-level pedestrian walkways. Natural vantage point overlooking Highfields with tight-knit solidarity.',
    x: 58,
    y: 35,
    adjacentSectorIds: ['sec_melbourne', 'sec_spinney', 'sec_sparkenhoe', 'sec_victoria_park'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_artists',
    barricadeLevel: 4,
    soundSystemPower: 65,
    policeHeat: 45,
    revenueWeekly: 410,
    landmark: 'Goscote House Walkway & Pirate Radio Mast'
  },
  {
    id: 'sec_spinney',
    name: 'Spinney Hill Park (The Convoy)',
    shortName: 'Spinney Hill',
    historicalContext: 'Lush elevated park commanding views across east Leicester. Base for New Age traveller buses, open-air sound systems, and bonfire gatherings.',
    x: 75,
    y: 28,
    adjacentSectorIds: ['sec_st_peters', 'sec_sparkenhoe'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_travellers',
    barricadeLevel: 2,
    soundSystemPower: 84,
    policeHeat: 40,
    revenueWeekly: 310,
    landmark: 'Spinney Hills Convoy Encampment'
  },
  {
    id: 'sec_sparkenhoe',
    name: 'Sparkenhoe Street Commercial Line',
    shortName: 'Sparkenhoe St',
    historicalContext: 'Buzzing commercial artery lined with Asian grocers, reggae record shops, sari houses, and community newsagents.',
    x: 62,
    y: 52,
    adjacentSectorIds: ['sec_melbourne', 'sec_spinney', 'sec_st_peters', 'sec_berners'],
    isSupplyCenter: true,
    controlledByFactionId: 'neutral',
    barricadeLevel: 2,
    soundSystemPower: 50,
    policeHeat: 50,
    revenueWeekly: 580,
    landmark: 'Imperial Record Mart & Sweet Centres'
  },
  {
    id: 'sec_berners',
    name: 'Berners Street & Blues Basement',
    shortName: 'Berners St',
    historicalContext: 'Row of industrial garages and underground cellar clubs where choppers rev and illegal late-night blues parties shake the brickwork.',
    x: 54,
    y: 68,
    adjacentSectorIds: ['sec_melbourne', 'sec_victoria_park', 'sec_sparkenhoe'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_bikers',
    barricadeLevel: 3,
    soundSystemPower: 70,
    policeHeat: 60,
    revenueWeekly: 450,
    landmark: 'Midland Iron Choppers Yard & Underground Blues'
  },
  {
    id: 'sec_moat',
    name: 'Moat College & Community Centre',
    shortName: 'Moat Centre',
    historicalContext: 'Education and agitation center where activists, artists, and community defense committees organize anti-racist actions and youth clubs.',
    x: 38,
    y: 28,
    adjacentSectorIds: ['sec_conduit', 'sec_charles_st', 'sec_st_peters'],
    isSupplyCenter: true,
    controlledByFactionId: 'fac_artists',
    barricadeLevel: 2,
    soundSystemPower: 60,
    policeHeat: 35,
    revenueWeekly: 360,
    landmark: 'Highfields Community Workshop & Legal Defense Desk'
  },
  {
    id: 'sec_charles_st',
    name: 'Charles Street Police Station & Gateway',
    shortName: 'Charles St HQ',
    historicalContext: 'Fortified central police divisional headquarters. Base for the Special Patrol Group (SPG), riot vans, surveillance, and curfew operations.',
    x: 18,
    y: 35,
    adjacentSectorIds: ['sec_conduit', 'sec_station', 'sec_moat'],
    isSupplyCenter: false,
    controlledByFactionId: 'police',
    barricadeLevel: 5,
    soundSystemPower: 10,
    policeHeat: 90,
    revenueWeekly: 0,
    landmark: 'Leicestershire Constabulary SPG Depot'
  }
];

export const SUBCULTURE_FACTIONS: SubcultureFaction[] = [
  {
    id: 'fac_rastas',
    name: 'Frontline Dub Sound System',
    subculture: 'rasta',
    leaderName: 'Ras Irie',
    leaderTitle: 'Sound Controller & Elder',
    tagline: 'Bass-weight resistance and community solidarity on Melbourne Road.',
    ethos: 'Defend the youth against "sus" laws and racist harassment through roots reggae and united community defense.',
    primaryColor: '#15803d', // Green
    secondaryColor: '#facc15', // Gold
    headquartersSectorId: 'sec_melbourne',
    respect: 680,
    streetCred: 90,
    treasury: 620,
    policeHeat: 45,
    personality: 'defiant',
    aiTrustInPlayer: 70,
    crewCount: 16,
    favoredMusic: 'Roots Reggae & Heavyweight Dub',
    avatarIcon: '🇯🇲'
  },
  {
    id: 'fac_punks',
    name: 'Highfields Squat Punks',
    subculture: 'punk',
    leaderName: 'Spike Rotten',
    leaderTitle: 'Squat Spokesperson & Drummer',
    tagline: 'Anarchy, anti-fascist direct action, and squatted DIY autonomy.',
    ethos: 'No landlords, no National Front in our streets, no surrender to the police riot squad. Barricade every door.',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#000000', // Black
    headquartersSectorId: 'sec_conduit',
    respect: 610,
    streetCred: 85,
    treasury: 380,
    policeHeat: 60,
    personality: 'radical',
    aiTrustInPlayer: 60,
    crewCount: 14,
    favoredMusic: 'Anarcho-Punk & Hardcore',
    avatarIcon: '⚡'
  },
  {
    id: 'fac_travellers',
    name: 'Peace Convoy Travellers',
    subculture: 'traveller',
    leaderName: 'Willow',
    leaderTitle: 'Convoy Mechanic & Navigator',
    tagline: 'Freedom of movement, painted Bedford buses, and off-grid generator power.',
    ethos: 'Living on common land, sharing soup, and resisting the Criminal Justice Act clampdowns on free festivals.',
    primaryColor: '#854d0e', // Earthy brown/amber
    secondaryColor: '#10b981', // Emerald
    headquartersSectorId: 'sec_spinney',
    respect: 540,
    streetCred: 75,
    treasury: 420,
    policeHeat: 35,
    personality: 'peaceful',
    aiTrustInPlayer: 65,
    crewCount: 12,
    favoredMusic: 'Festival Folk, Dub & Psychedelic Rock',
    avatarIcon: '🚐'
  },
  {
    id: 'fac_hippies',
    name: 'Victoria Park Free Spirits',
    subculture: 'hippie',
    leaderName: 'Skye',
    leaderTitle: 'Peace Camp Facilitator',
    tagline: 'Peace, open greens, acoustic circles, and passive resistance.',
    ethos: 'Make Highfields a haven of love and culture. Oppose police aggression with sit-ins and non-violent solidarity.',
    primaryColor: '#9333ea', // Purple
    secondaryColor: '#f472b6', // Pink
    headquartersSectorId: 'sec_victoria_park',
    respect: 500,
    streetCred: 70,
    treasury: 350,
    policeHeat: 20,
    personality: 'peaceful',
    aiTrustInPlayer: 75,
    crewCount: 10,
    favoredMusic: 'Psychedelic Rock & Acoustic Anthems',
    avatarIcon: '☮️'
  },
  {
    id: 'fac_artists',
    name: 'Bohemian Artists & Pirate Radio',
    subculture: 'artist',
    leaderName: 'Maya Vane',
    leaderTitle: 'Pirate Radio Operator & Printer',
    tagline: 'Agitprop screenprinting, underground radio broadcasts, and counter-culture murals.',
    ethos: 'Information is our weapon. Broadcast police movements, print legal rights cards, and expose police brutality.',
    primaryColor: '#0284c7', // Sky blue
    secondaryColor: '#f97316', // Orange
    headquartersSectorId: 'sec_moat',
    respect: 570,
    streetCred: 80,
    treasury: 480,
    policeHeat: 40,
    personality: 'militant',
    aiTrustInPlayer: 80,
    crewCount: 11,
    favoredMusic: 'Post-Punk, Experimental & Electronic',
    avatarIcon: '📻'
  },
  {
    id: 'fac_bikers',
    name: 'Midland Iron Biker Brotherhood',
    subculture: 'biker',
    leaderName: 'Big Mac',
    leaderTitle: 'Chapter President',
    tagline: 'Triumph engines, leather cuts, heavy spanners, and territorial respect.',
    ethos: 'Nobody messes with our garages or our brothers. If the cops step onto Berners Street, they get a wrench in the radiator.',
    primaryColor: '#475569', // Iron slate
    secondaryColor: '#f59e0b', // Chrome amber
    headquartersSectorId: 'sec_berners',
    respect: 630,
    streetCred: 78,
    treasury: 550,
    policeHeat: 55,
    personality: 'dogmatic',
    aiTrustInPlayer: 55,
    crewCount: 15,
    favoredMusic: 'Heavy Metal & Hard Rock',
    avatarIcon: '🏍️'
  },
  {
    id: 'fac_casuals',
    name: 'London Road Casuals (Baby Squad)',
    subculture: 'casual',
    leaderName: 'Gazza',
    leaderTitle: 'Station Concourse General',
    tagline: 'Designer terrace tracktops, white trainers, rapid footwork, and street swagger.',
    ethos: 'Control the train station approaches. Take on visiting away mobs and outrun police snatch squads.',
    primaryColor: '#1e3a8a', // Casual navy
    secondaryColor: '#e2e8f0', // Stone white
    headquartersSectorId: 'sec_station',
    respect: 640,
    streetCred: 82,
    treasury: 510,
    policeHeat: 70,
    personality: 'opportunist',
    aiTrustInPlayer: 50,
    crewCount: 18,
    favoredMusic: 'Indie, Acid House & Terrace Chants',
    avatarIcon: '👟'
  }
];

export const HISTORIC_TIMELINE: HistoricEvent[] = [
  {
    year: 1980,
    season: 'Autumn',
    title: 'The Tensions Gather on Melbourne Road',
    headline: 'Highfields Youth Committee warns of Police "Sus" Law Harassment',
    description: 'Special Patrol Group vans flood Melbourne Road and Conduit Street. Local youth unite across subcultures to defend their streets.',
    policeEscalationDelta: 15
  },
  {
    year: 1981,
    season: 'Summer',
    title: 'THE 1981 HIGHFIELDS RIOTS BREAK OUT!',
    headline: 'Hundreds clash with Riot Police along Melbourne Road and St Peters!',
    description: 'Following a heavy-handed police raid on an afternoon blues gathering, the street erupts into historic resistance. Cobblestones fly, barricades rise, and subcultures stand shoulder to shoulder against the riot squads.',
    policeEscalationDelta: 45,
    isRiotYear: true
  },
  {
    year: 1983,
    season: 'Spring',
    title: 'Conduit Street Squat Defense Alliance',
    headline: 'Punks, Artists and Rastas barricade Victorian terraces against Bailiffs',
    description: 'A concerted effort to demolish the Conduit Street squatted community center is rebuffed by an unprecedented coalition of punks, travellers, and sound crews.',
    policeEscalationDelta: 10
  },
  {
    year: 1985,
    season: 'Summer',
    title: 'Victoria Park Rock Against Racism Carnival',
    headline: '25,000 gather for free music and anti-apartheid solidarity',
    description: 'Rastas, Hippies, and Punks organize the largest multicultural free festival in the East Midlands. Police heat drops as community power peaks.',
    policeEscalationDelta: -20
  },
  {
    year: 1988,
    season: 'Autumn',
    title: 'Acid House & Sound System Fusion',
    headline: 'Casuals and Travellers link up at secret warehouse parties',
    description: 'Underground warehouse raves break down barriers between terrace casuals and traveller convoy sound systems.',
    policeEscalationDelta: 25
  },
  {
    year: 1994,
    season: 'Summer',
    title: 'Criminal Justice Act Standoff',
    headline: 'Massive Resistance against Repetitive Beats & Squat Bans',
    description: 'Government passes the 1994 Criminal Justice Act targeting free parties and travellers. Highfields becomes a national sanctuary of resistance.',
    policeEscalationDelta: 35,
    isRiotYear: true
  },
  {
    year: 1999,
    season: 'Winter',
    title: 'Pirate Radio Masts over St Peters High-Rise',
    headline: 'D&B and Roots Pirate Radio transmitters defy DTI raids',
    description: 'Highfields artist and sound collectives install rooftop transmitters across Goscote House to broadcast 24/7 community music.',
    policeEscalationDelta: 15
  },
  {
    year: 2001,
    season: 'Summer',
    title: 'Summer 2001 Anti-Racist Defense Standoff',
    headline: 'Highfields streets sealed off as Far-Right march is repelled',
    description: 'Bikers, Casuals, Punks, and Frontline crews form human barricades at London Road station to repel far-right instigators while police kettle the area.',
    policeEscalationDelta: 40,
    isRiotYear: true
  },
  {
    year: 2005,
    season: 'Spring',
    title: 'The Battle for Highfields Community Centre',
    headline: 'Council regeneration schemes met with defiant occupation',
    description: 'Artists and local families occupy the community halls to prevent private redevelopment.',
    policeEscalationDelta: 20
  },
  {
    year: 2010,
    season: 'Autumn',
    title: 'The 30-Year Highfields Legacy Finale',
    headline: 'Three decades of counter-culture solidarity crowned in Highfields history',
    description: 'From 1980 to 2010, the subcultures of Highfields proved that community defense, diverse music, and unity can withstand every police crackdown.',
    policeEscalationDelta: 0
  }
];
