/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Initial Territory & Venue Data for Nightlife Door Security and Territory Wars.
 */

import { Territory, Venue, DoorEvent, TerritoryWarCampaign } from '../types/territoryWars';

export const INITIAL_TERRITORIES: Territory[] = [
  {
    id: 'terr_stadium',
    name: 'The Stadium Quarter',
    description: 'The historic matchday epicenter. Traditional Victorian redbrick pubs, turnstiles, and away fan corridors.',
    iconName: 'Shield',
    controllingFirmId: 'firm_northwood',
    dominance: {
      firm_northwood: 68,
      firm_southwark: 20,
      firm_eastend: 12
    },
    venueIds: ['ven_the_corner_flag', 'ven_the_turnstile_arms', 'ven_red_lion_vaults'],
    strategicBonus: '+25% Fan loyalty & Home matchday advantage'
  },
  {
    id: 'terr_high_street',
    name: 'The High Street',
    description: 'Thriving retail and trendy nightlife strip. Commercial bars, heavy foot traffic, and police CCTV coverage.',
    iconName: 'Sparkles',
    controllingFirmId: null, // contested
    dominance: {
      firm_northwood: 45,
      firm_southwark: 35,
      firm_birmingham: 20
    },
    venueIds: ['ven_velvet_lounge', 'ven_neon_discotheque', 'ven_crown_and_anchor'],
    strategicBonus: '+£350 Weekly commercial door revenue'
  },
  {
    id: 'terr_station',
    name: 'The Station Approach',
    description: 'Gritty railway arches, taxi ranks, and transit bottlenecks. Crucial for intercepting rival away trains.',
    iconName: 'Train',
    controllingFirmId: 'firm_southwark',
    dominance: {
      firm_northwood: 30,
      firm_southwark: 55,
      firm_manchester: 15
    },
    venueIds: ['ven_locomotive_tap', 'ven_railway_arch_subway', 'ven_the_iron_horse'],
    strategicBonus: 'Spot away fan arrivals early (+20 Stealth on away days)'
  },
  {
    id: 'terr_docks',
    name: 'The Docks',
    description: 'Rough waterfront warehouses, cranes, and container yards. Unregulated black market exchanges and heavy scrap territory.',
    iconName: 'Anchor',
    controllingFirmId: 'firm_eastend',
    dominance: {
      firm_northwood: 25,
      firm_eastend: 60,
      firm_southwark: 15
    },
    venueIds: ['ven_the_wharfinger', 'ven_warehouse_seven', 'ven_dockers_rest'],
    strategicBonus: '+30% Black market contraband capacity & lower buy prices'
  },
  {
    id: 'terr_estate',
    name: 'The Council Estate',
    description: 'Brutalist concrete tower blocks and precinct alleys. Home turf for tough street kids and fearless casual recruits.',
    iconName: 'Home',
    controllingFirmId: 'firm_northwood',
    dominance: {
      firm_northwood: 72,
      firm_southwark: 18,
      firm_eastend: 10
    },
    venueIds: ['ven_estate_community_club', 'ven_the_concrete_tap', 'ven_highrise_snooker'],
    strategicBonus: '-30% Cost to recruit tough Minders and Nutters'
  }
];

export const INITIAL_VENUES: Venue[] = [
  // Stadium Quarter
  {
    id: 'ven_the_corner_flag',
    name: 'The Corner Flag Pub',
    district: 'Stadium Quarter',
    territoryId: 'terr_stadium',
    ownerFirmId: 'firm_northwood',
    doorStaffIds: ['lad_gaz'],
    weeklyTake: 320,
    policeHeat: 25,
    status: 'controlled',
    capacity: 220,
    entryFee: 0,
    musicGenre: 'Terrace Anthems & Ska'
  },
  {
    id: 'ven_the_turnstile_arms',
    name: 'The Turnstile Arms',
    district: 'Stadium Quarter',
    territoryId: 'terr_stadium',
    ownerFirmId: 'firm_northwood',
    doorStaffIds: ['lad_big_dave'],
    weeklyTake: 410,
    policeHeat: 20,
    status: 'controlled',
    capacity: 350,
    entryFee: 2,
    musicGenre: 'Northern Soul & Oi!'
  },
  {
    id: 'ven_red_lion_vaults',
    name: 'Red Lion Vaults',
    district: 'Stadium Quarter',
    territoryId: 'terr_stadium',
    ownerFirmId: null,
    doorStaffIds: [],
    weeklyTake: 260,
    policeHeat: 15,
    status: 'uncontrolled',
    capacity: 180,
    entryFee: 0,
    musicGenre: 'Pub Rock'
  },

  // High Street
  {
    id: 'ven_velvet_lounge',
    name: 'The Velvet Lounge & Bar',
    district: 'The High Street',
    territoryId: 'terr_high_street',
    ownerFirmId: 'firm_southwark',
    doorStaffIds: [],
    weeklyTake: 580,
    policeHeat: 35,
    status: 'contested',
    capacity: 450,
    entryFee: 5,
    musicGenre: 'Euro House & Italo Disco'
  },
  {
    id: 'ven_neon_discotheque',
    name: 'Neon Empire Nightclub',
    district: 'The High Street',
    territoryId: 'terr_high_street',
    ownerFirmId: null,
    doorStaffIds: [],
    weeklyTake: 750,
    policeHeat: 45,
    status: 'uncontrolled',
    capacity: 800,
    entryFee: 8,
    musicGenre: 'Acid House & Hardcore'
  },
  {
    id: 'ven_crown_and_anchor',
    name: 'The Crown & Anchor',
    district: 'The High Street',
    territoryId: 'terr_high_street',
    ownerFirmId: 'firm_northwood',
    doorStaffIds: [],
    weeklyTake: 390,
    policeHeat: 20,
    status: 'controlled',
    capacity: 260,
    entryFee: 0,
    musicGenre: 'Classic Rock'
  },

  // Station Approach
  {
    id: 'ven_locomotive_tap',
    name: 'The Locomotive Tap',
    district: 'Station Approach',
    territoryId: 'terr_station',
    ownerFirmId: 'firm_southwark',
    doorStaffIds: [],
    weeklyTake: 340,
    policeHeat: 30,
    status: 'contested',
    capacity: 240,
    entryFee: 0,
    musicGenre: 'Bitter & Heavy Ale'
  },
  {
    id: 'ven_railway_arch_subway',
    name: 'Archway 4 Underground Rave',
    district: 'Station Approach',
    territoryId: 'terr_station',
    ownerFirmId: 'firm_southwark',
    doorStaffIds: [],
    weeklyTake: 680,
    policeHeat: 60,
    status: 'contested',
    capacity: 600,
    entryFee: 10,
    musicGenre: 'Jungle & Breakbeat'
  },
  {
    id: 'ven_the_iron_horse',
    name: 'The Iron Horse Tavern',
    district: 'Station Approach',
    territoryId: 'terr_station',
    ownerFirmId: null,
    doorStaffIds: [],
    weeklyTake: 290,
    policeHeat: 15,
    status: 'uncontrolled',
    capacity: 200,
    entryFee: 0,
    musicGenre: 'Rockabilly'
  },

  // The Docks
  {
    id: 'ven_the_wharfinger',
    name: 'The Old Wharfinger Pub',
    district: 'The Docks',
    territoryId: 'terr_docks',
    ownerFirmId: 'firm_eastend',
    doorStaffIds: [],
    weeklyTake: 310,
    policeHeat: 20,
    status: 'contested',
    capacity: 190,
    entryFee: 0,
    musicGenre: 'Folk & Shanty'
  },
  {
    id: 'ven_warehouse_seven',
    name: 'Warehouse 7 Underground Lock-In',
    district: 'The Docks',
    territoryId: 'terr_docks',
    ownerFirmId: 'firm_eastend',
    doorStaffIds: [],
    weeklyTake: 820,
    policeHeat: 50,
    status: 'contested',
    capacity: 900,
    entryFee: 12,
    musicGenre: 'Techno & Industrial'
  },
  {
    id: 'ven_dockers_rest',
    name: "The Docker's Rest",
    district: 'The Docks',
    territoryId: 'terr_docks',
    ownerFirmId: null,
    doorStaffIds: [],
    weeklyTake: 240,
    policeHeat: 10,
    status: 'uncontrolled',
    capacity: 160,
    entryFee: 0,
    musicGenre: 'Blues'
  },

  // Council Estate
  {
    id: 'ven_estate_community_club',
    name: 'St. Jude Estate Working Mens Club',
    district: 'The Council Estate',
    territoryId: 'terr_estate',
    ownerFirmId: 'firm_northwood',
    doorStaffIds: [],
    weeklyTake: 350,
    policeHeat: 15,
    status: 'controlled',
    capacity: 320,
    entryFee: 1,
    musicGenre: 'Bingo & 80s Pop'
  },
  {
    id: 'ven_the_concrete_tap',
    name: 'The Grey Falcon (The Concrete Tap)',
    district: 'The Council Estate',
    territoryId: 'terr_estate',
    ownerFirmId: 'firm_northwood',
    doorStaffIds: [],
    weeklyTake: 380,
    policeHeat: 25,
    status: 'controlled',
    capacity: 280,
    entryFee: 0,
    musicGenre: 'Punk & Reggae'
  },
  {
    id: 'ven_highrise_snooker',
    name: 'Apex Snooker & Pool Hall',
    district: 'The Council Estate',
    territoryId: 'terr_estate',
    ownerFirmId: null,
    doorStaffIds: [],
    weeklyTake: 420,
    policeHeat: 15,
    status: 'uncontrolled',
    capacity: 250,
    entryFee: 3,
    musicGenre: 'Easy Listening'
  }
];

export const DOOR_EVENT_TEMPLATES = [
  {
    type: 'unruly_punter' as const,
    title: 'The Unruly Punter',
    descriptions: [
      'A heavily intoxicated lad wearing rival firm colors is shouting abuse and demanding entry through the ropes.',
      'A group of three rowdy lads from an away firm are trying to bypass the queue, kicking the fire exit door.',
      'A notorious local hardman who was barred six months ago is attempting to push past your door minders.'
    ],
    generateChoices: (venueName: string) => [
      {
        label: 'Turn him away firmly (Bottle Check)',
        description: 'Stand tall in front of the door. Requires Bottle >= 65.',
        treasuryDelta: 0,
        respectDelta: 15,
        heatDelta: 5,
        requiresStat: { stat: 'bottle' as const, minValue: 65 }
      },
      {
        label: 'Let him in quietly to avoid a scene',
        description: 'Avoid a street brawl, but patrons and rivals will perceive weakness.',
        treasuryDelta: 0,
        respectDelta: -20,
        heatDelta: 0
      },
      {
        label: 'Give him a lesson down the alleyway',
        description: 'Take him out of view and enforce firm respect with force.',
        treasuryDelta: 0,
        respectDelta: 30,
        heatDelta: 18,
        triggerClash: true
      }
    ]
  },
  {
    type: 'police_visit' as const,
    title: 'The Police Inspection',
    descriptions: [
      'The local licensing sergeant and two constables pull up in a panda car demanding an immediate door inspection.',
      'British Transport Police & Borough licensing officers have arrived to check the register of security staff.',
      'A vice squad detective enters the lobby, sniffing around for illicit contraband and black market ticket sales.'
    ],
    generateChoices: (venueName: string) => [
      {
        label: 'Bribe the Sergeant (£500)',
        description: 'Slip a fat brown envelope to grease the wheels and keep the venue off police radar.',
        treasuryDelta: -500,
        respectDelta: 5,
        heatDelta: -15
      },
      {
        label: 'Refuse entry without a warrant',
        description: 'Stand on legal rights. Pushes police heat up, but shows lads you do not bow down.',
        treasuryDelta: 0,
        respectDelta: 20,
        heatDelta: 20
      },
      {
        label: 'Cooperate politely and stall inspection',
        description: 'Offer tea and waste their time while lads clear any backroom contraband.',
        treasuryDelta: 0,
        respectDelta: -5,
        heatDelta: 5
      }
    ]
  },
  {
    type: 'rival_top_boy' as const,
    title: 'Rival Top Boy Confrontation',
    descriptions: [
      'A rival Top Boy arrives outside with 10 heavy lads in Burberry jackets demanding a 50% cut of the door.',
      'Rival firm lieutenants have arrived in three Ford Sierras, demanding your minders walk away from the door.',
      'The away firm has targeted this venue for a coordinated door takeover before Saturday matchday.'
    ],
    generateChoices: (venueName: string) => [
      {
        label: 'Stand ground and call the lads (Trigger Clash)',
        description: 'Ring your terrace crew and meet them head-on in front of the venue ropes!',
        treasuryDelta: 0,
        respectDelta: 40,
        heatDelta: 25,
        triggerClash: true
      },
      {
        label: 'Back down and abandon the door',
        description: 'Retreat for tonight. The venue becomes Contested or reverts to rival control.',
        treasuryDelta: 0,
        respectDelta: -35,
        heatDelta: -10
      },
      {
        label: 'Pay protection tribute (£400)',
        description: 'Temporarily pacify the rival firm with cash without losing the door.',
        treasuryDelta: -400,
        respectDelta: -15,
        heatDelta: -5
      }
    ]
  }
];

export function createDoorEventForVenue(venue: Venue): DoorEvent {
  const template = DOOR_EVENT_TEMPLATES[Math.floor(Math.random() * DOOR_EVENT_TEMPLATES.length)];
  const desc = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  return {
    id: `door_evt_${venue.id}_${Date.now()}`,
    venueId: venue.id,
    venueName: venue.name,
    type: template.type,
    description: desc,
    choices: template.generateChoices(venue.name)
  };
}

export function createWarCampaign(
  territory: Territory,
  targetFirmId: string,
  targetFirmName: string,
  committedLadIds: string[]
): TerritoryWarCampaign {
  return {
    id: `war_${territory.id}_${Date.now()}`,
    territoryId: territory.id,
    territoryName: territory.name,
    targetFirmId,
    targetFirmName,
    currentDay: 1,
    wins: 0,
    losses: 0,
    committedLadIds,
    status: 'active',
    history: [
      `War declared over ${territory.name} against ${targetFirmName}! Police heat has spiked across the borough.`
    ],
    days: [
      {
        day: 1,
        title: 'Day 1: Street Skirmishes',
        subtitle: '1v1 Street Duels & Corner Interceptions',
        format: '1v1_street',
        location: `${territory.name} Back Alleys`,
        description: 'Your scout lads hunt rival spotters across side streets. Fast-paced 1-on-1 scraps to break their perimeter.',
        resolved: false
      },
      {
        day: 2,
        title: 'Day 2: Industrial Brawl',
        subtitle: '8v8 Arranged Rumble',
        format: '8v8_industrial',
        location: `${territory.name} Industrial Estate & Canal Bank`,
        description: 'Heavy tactical formation clash away from police patrols. 8 firm lads face off in an intense territory brawl.',
        resolved: false
      },
      {
        day: 3,
        title: 'Day 3: Primary Pub Raid',
        subtitle: 'Territory Decider & Stronghold Siege',
        format: 'pub_raid',
        location: `${territory.name} Primary Venue`,
        description: 'A coordinated full-firm storm on the rival headquarters. Winner claims total dominance over the district.',
        resolved: false
      }
    ]
  };
}
