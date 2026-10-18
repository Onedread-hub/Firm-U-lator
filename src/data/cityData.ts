/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Default City Venues and Districts Generator
 * Dynamically scales as the SFS football club wins matches and expands its prestige.
 */

import { CityState, CityVenue, DistrictCategory } from '../types/city';

export const INITIAL_CITY_VENUES: CityVenue[] = [
  // --- PUBS ---
  {
    id: 'venue_crown_anchor',
    name: 'The Crown & Anchor (High St)',
    district: 'pubs',
    description: 'Victorian red-brick corner pub with leaded stained windows. The spiritual headquarters of the old-school firm elders.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 90,
    weeklyRevenue: 85,
    atmosphereRating: 9,
    specialPerk: {
      title: 'Terrace Command Centre',
      description: 'Lads drinking here receive +5% Bottle aura before matchday clashes.',
      statBoost: '+5% Bottle Aura'
    },
    actions: [
      {
        id: 'pub_lockin',
        label: 'Order Firm Lock-In',
        cost: 60,
        description: 'Shutter the windows and buy rounds for the firm to elevate loyalty and camaraderie.',
        policeHeatDelta: 3,
        loyaltyDelta: 6,
        respectDelta: 5,
        type: 'party'
      },
      {
        id: 'pub_fortify',
        label: 'Reinforce Heavy Oak Doors',
        cost: 110,
        description: 'Install iron drop-bolts to hold off police raids or rival ambushes.',
        policeHeatDelta: 0,
        loyaltyDelta: 2,
        respectDelta: 8,
        type: 'protection_racket'
      }
    ]
  },
  {
    id: 'venue_station_vaults',
    name: 'Railway Station Vaults',
    district: 'pubs',
    description: 'A subterranean cavern pub right beneath the central rail platforms. Spotters keep watch on incoming football special trains.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 65,
    weeklyRevenue: 120,
    atmosphereRating: 8,
    specialPerk: {
      title: 'Train Spotter Early Warning',
      description: 'Gives 15 minutes early notice when rival firms disembark at the platform.',
      statBoost: '+20% Stealth vs Rivals'
    },
    actions: [
      {
        id: 'vaults_ambush_prep',
        label: 'Station Lookout Detail',
        cost: 40,
        description: 'Station scouts at the ticket barriers to identify plain-clothes police and rival colors.',
        policeHeatDelta: 5,
        loyaltyDelta: 3,
        respectDelta: 10,
        type: 'tag_territory'
      }
    ]
  },

  // --- NIGHTCLUBS & UNDERWORLD ---
  {
    id: 'venue_warehouse_vaults',
    name: 'The Warehouse Vaults (Club 92)',
    district: 'nightlife',
    description: 'Underground acid-house rave and late-night drinking den beneath the railway arches. The firm runs the door security.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 75,
    weeklyRevenue: 190,
    atmosphereRating: 9,
    specialPerk: {
      title: 'Bouncer Muscle Pipeline',
      description: 'Allows recruiting burly nightclub doormen directly into the Minder ranks.',
      statBoost: 'Minder Recruitment Available'
    },
    actions: [
      {
        id: 'recruit_bouncer',
        label: 'Recruit Head Doorman (£140)',
        cost: 140,
        description: 'Sign a 6ft 3in bouncer with an iron jaw to join your front line as a heavy Minder.',
        policeHeatDelta: 8,
        loyaltyDelta: 5,
        respectDelta: 15,
        type: 'recruit'
      },
      {
        id: 'sell_terrace_merch',
        label: 'Terrace Merch & Tickets',
        cost: 30,
        description: 'Distribute exclusive firm badges, silk scarves, and away tickets to fund the treasury.',
        policeHeatDelta: 2,
        loyaltyDelta: 4,
        respectDelta: 6,
        cashDelta: 95,
        type: 'party'
      }
    ]
  },
  {
    id: 'venue_club_elysium',
    name: 'Club Elysium (VIP Velvet Lounge)',
    district: 'nightlife',
    description: 'A glitzy multi-floor venue with neon waterfalls and bottle service. Unlocked as the football club attracts big-city wealth.',
    minProsperityTier: 3,
    isUnlocked: false,
    controlledByFirm: false,
    firmControlLevel: 0,
    weeklyRevenue: 320,
    atmosphereRating: 7,
    specialPerk: {
      title: 'High Roller Protection',
      description: 'Generates substantial weekly protection payments from wealthy owners.',
      statBoost: '+£150 Weekly Payout'
    },
    actions: [
      {
        id: 'extort_elysium',
        label: 'Offer "Terrace Security" Contract',
        cost: 80,
        description: 'Persuade management that having your firm on the door prevents visiting away fans from trashing the VIP lounge.',
        policeHeatDelta: 14,
        loyaltyDelta: 4,
        respectDelta: 25,
        type: 'protection_racket'
      }
    ]
  },

  // --- RESTAURANTS & CAFFS ---
  {
    id: 'venue_micks_caff',
    name: "Mick's Matchday All-Day Caff",
    district: 'restaurants',
    description: 'Greasy spoon with formica tables, steaming builder\'s tea, and black pudding fry-ups. The morning tactical gathering spot.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 100,
    weeklyRevenue: 45,
    atmosphereRating: 8,
    specialPerk: {
      title: 'Full English Stamina Boost',
      description: 'Restores +15 Stamina to all selected matchday lads before away journeys.',
      statBoost: '+15 Squad Stamina'
    },
    actions: [
      {
        id: 'feed_the_lads',
        label: 'Buy Morning Breakfasts (£50)',
        cost: 50,
        description: 'Treat the first 8 lads to double bacon, eggs, and fried bread before the matchday march.',
        policeHeatDelta: 0,
        loyaltyDelta: 7,
        respectDelta: 3,
        type: 'stamina_boost'
      }
    ]
  },
  {
    id: 'venue_golden_chippy',
    name: 'The Golden Anchor Chippy',
    district: 'restaurants',
    description: 'Steaming salt-and-vinegar shop located directly opposite the stadium north turnstiles. Famous for pickled eggs and cod.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 80,
    weeklyRevenue: 70,
    atmosphereRating: 8,
    specialPerk: {
      title: 'Turnstile Chokepoint',
      description: 'Perfect spot to ambush away fans lining up for match tickets.',
      statBoost: '+10% Intimidation'
    },
    actions: [
      {
        id: 'chippy_patrol',
        label: 'Post Lookouts Outside Chippy',
        cost: 25,
        description: 'Ensure away supporters keep their heads down when walking past the Northwood end.',
        policeHeatDelta: 4,
        loyaltyDelta: 4,
        respectDelta: 8,
        type: 'tag_territory'
      }
    ]
  },
  {
    id: 'venue_luigi_bistro',
    name: "Luigi's Ristorante Italiano",
    district: 'restaurants',
    description: 'An upscale trattoria with white linen tables, imported Chianti, and authentic pasta. Opened following the club\'s league climb.',
    minProsperityTier: 2,
    isUnlocked: true,
    controlledByFirm: false,
    firmControlLevel: 30,
    weeklyRevenue: 160,
    atmosphereRating: 6,
    specialPerk: {
      title: 'Face Negotiations Table',
      description: 'A discreet venue where the Top Boy and Face can meet rival firm leaders for peaceful parlays.',
      statBoost: 'Enables Firm Peace Talks'
    },
    actions: [
      {
        id: 'dine_luigis',
        label: 'Host Top Boy Summit (£90)',
        cost: 90,
        description: 'Wine and dine the firm leaders to discuss territory boundaries and reduce legal heat.',
        policeHeatDelta: -10,
        loyaltyDelta: 4,
        respectDelta: 12,
        type: 'stamina_boost'
      }
    ]
  },

  // --- COUNCIL HOUSING ESTATES ---
  {
    id: 'venue_harpers_fields',
    name: "Harper's Fields High-Rise Estate",
    district: 'housing_estates',
    description: 'Brutalist 1960s concrete tower blocks connected by windy walkways. Home to the fiercest young casuals and fearless runners.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 95,
    weeklyRevenue: 30,
    atmosphereRating: 10,
    specialPerk: {
      title: 'Estate Casuals Recruiting Pool',
      description: 'Enables scouting hungry young lads with high pace and natural hardness.',
      statBoost: 'Fast Runner & Nutter Recruits'
    },
    actions: [
      {
        id: 'scout_estate_youngster',
        label: 'Recruit Estate Casual (£80)',
        cost: 80,
        description: 'Bring a nimble 18-year-old runner who knows every alleyway and fire escape into the firm.',
        policeHeatDelta: 4,
        loyaltyDelta: 8,
        respectDelta: 12,
        type: 'recruit'
      },
      {
        id: 'spray_calling_cards',
        label: 'Paint Mural & Calling Cards',
        cost: 35,
        description: 'Spray 10-foot club crests and firm graffiti across the estate towers to declare total dominance.',
        policeHeatDelta: 6,
        loyaltyDelta: 5,
        respectDelta: 14,
        type: 'tag_territory'
      }
    ]
  },
  {
    id: 'venue_gower_estate',
    name: 'Gower Estate Redbrick Terraces',
    district: 'housing_estates',
    description: 'Endless rows of Victorian redbrick terraces with cobblestone back-alleys and washing lines. The firm’s defensive sanctuary.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 85,
    weeklyRevenue: 40,
    atmosphereRating: 9,
    specialPerk: {
      title: 'Back-Alley Maze',
      description: 'Lads escaping police sirens can vanish into familiar alleyways with 0% arrest risk.',
      statBoost: '+35% Police Evasion'
    },
    actions: [
      {
        id: 'safehouse_retain',
        label: 'Establish Safehouse Flat (£70)',
        cost: 70,
        description: 'Rent a top-floor flat to hide lads facing Section 60 warrants and stash contraband smoke flares.',
        policeHeatDelta: -15,
        loyaltyDelta: 5,
        respectDelta: 10,
        type: 'protection_racket'
      }
    ]
  },

  // --- POSH AREAS & AFFLUENT QUARTERS ---
  {
    id: 'venue_st_james_crescent',
    name: "St. James's Crescent & Victorian Villas",
    district: 'posh_quarter',
    description: 'Tree-lined avenue of gated limestone mansions where club directors, local magistrates, and wealthy industrialists live.',
    minProsperityTier: 2,
    isUnlocked: true,
    controlledByFirm: false,
    firmControlLevel: 25,
    weeklyRevenue: 240,
    atmosphereRating: 5,
    specialPerk: {
      title: 'Director Intimidation',
      description: 'Reminds the football club board that the terrace firm will not tolerate poor managerial appointments.',
      statBoost: '+10 Board Pressure'
    },
    actions: [
      {
        id: 'directors_demonstration',
        label: 'Stage Peaceful Protest Outside Villa',
        cost: 45,
        description: 'Unfurl protest banners outside the club chairman\'s residence demanding ambitious player signings.',
        policeHeatDelta: 12,
        loyaltyDelta: 8,
        respectDelta: 18,
        type: 'tag_territory'
      }
    ]
  },
  {
    id: 'venue_marina_lofts',
    name: 'The Marina Quayside Lofts',
    district: 'posh_quarter',
    description: 'Gentrified docks transformed into glass penthouse apartments and yacht moorings as the city rides the football boom.',
    minProsperityTier: 4,
    isUnlocked: false,
    controlledByFirm: false,
    firmControlLevel: 0,
    weeklyRevenue: 380,
    atmosphereRating: 6,
    specialPerk: {
      title: 'Luxury Waterfront Sponsorship',
      description: 'Generates massive commercial revenue when fully integrated.',
      statBoost: '+£250 Weekly Treasury'
    },
    actions: [
      {
        id: 'marina_patrol',
        label: 'Quayside Valet & Security Monopoly',
        cost: 120,
        description: 'Ensure luxury sports cars parked outside quayside bars remain completely untouched.',
        policeHeatDelta: 6,
        loyaltyDelta: 3,
        respectDelta: 20,
        type: 'protection_racket'
      }
    ]
  },

  // --- INDUSTRIAL ESTATES & RAILWAY SIDINGS ---
  {
    id: 'venue_gasworks_sidings',
    name: 'Oakhurst Gasworks & Freight Sidings',
    district: 'industrial',
    description: 'Derelict iron gasometer, rust-coated warehouses, and empty gravel car parks away from city CCTV. The venue for arranged scraps.',
    minProsperityTier: 1,
    isUnlocked: true,
    controlledByFirm: true,
    firmControlLevel: 90,
    weeklyRevenue: 50,
    atmosphereRating: 10,
    specialPerk: {
      title: 'Off-Grid Rumble Ground',
      description: 'Allows hosting clandestine 10v10 brawls with rival firms without drawing immediate riot police.',
      statBoost: 'Zero CCTV Surveillance'
    },
    actions: [
      {
        id: 'host_industrial_scrap',
        label: 'Arrange 8v8 Bare-Knuckle Bout (£60)',
        cost: 60,
        description: 'Call a rival firm out to the abandoned gravel yard on Tuesday evening to settle old scores.',
        policeHeatDelta: 10,
        loyaltyDelta: 10,
        respectDelta: 35,
        type: 'party'
      }
    ]
  }
];

export function generateInitialCityState(cityName: string, clubName: string, clubReputation: number = 75): CityState {
  // Determine prosperity tier based on club reputation
  let tier = 1;
  let growthStage: CityState['growthStage'] = 'Gritty Mill Town';
  if (clubReputation >= 90) {
    tier = 5;
    growthStage = 'Cosmopolitan Football Capital';
  } else if (clubReputation >= 80) {
    tier = 4;
    growthStage = 'Prosperous Metro';
  } else if (clubReputation >= 70) {
    tier = 3;
    growthStage = 'Booming Regional Centre';
  } else if (clubReputation >= 55) {
    tier = 2;
    growthStage = 'Developing Industrial Hub';
  }

  // Update venues unlocked state based on tier
  const venues = INITIAL_CITY_VENUES.map(v => ({
    ...v,
    isUnlocked: v.minProsperityTier <= tier
  }));

  return {
    cityName,
    clubName,
    prosperityTier: tier,
    growthStage,
    prosperityScore: clubReputation,
    terraceControlScore: 72,
    councilStanding: 'Wary',
    venues,
    cityDispatches: [
      {
        id: 'disp_1',
        timestamp: 'Matchday Eve',
        headline: `${cityName} Braces for Football Weekend`,
        body: `Local shopkeepers on High Street prepare plywood shutters as thousands of supporters descend upon the town. Council issues statement urging calm.`,
        category: 'culture'
      },
      {
        id: 'disp_2',
        timestamp: 'Earlier Today',
        headline: `New Developments Planned for ${cityName} River Quays`,
        body: `Buoyed by ${clubName}'s recent form, private investors have submitted plans for luxury residential developments and modern entertainment complexes.`,
        category: 'growth'
      }
    ]
  };
}
