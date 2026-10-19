/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Trading Catalog & Travel Events Data for Firm U-Lator
 */

import { TradingItem, TravelRoute, TravelEvent, CargoManifest } from '../types/trading';

export const TRADING_CATALOG: TradingItem[] = [
  // BOOTLEG
  {
    id: 'bootleg_fanzines',
    name: 'Pirate Derby Fanzines & Tapes',
    description: 'Unlicensed underground cassette tapes and xeroxed terrace fanzines.',
    type: 'Bootleg',
    quantity: 0,
    buyPrice: 12,
    sellPrice: 28,
    heat: 4,
    capacityPerUnit: 1
  },
  {
    id: 'bootleg_scarves',
    name: 'Bootleg Silk Bar Scarves',
    description: 'Knitted terrace scarves with unapproved retro crests and colors.',
    type: 'Bootleg',
    quantity: 0,
    buyPrice: 16,
    sellPrice: 38,
    heat: 5,
    capacityPerUnit: 1
  },
  {
    id: 'pirate_vinyl',
    name: 'Imported White-Label Anthems',
    description: 'Pressed 12-inch vinyl records of cult European terrace chants.',
    type: 'Bootleg',
    quantity: 0,
    buyPrice: 22,
    sellPrice: 50,
    heat: 6,
    capacityPerUnit: 1
  },

  // CONTRABAND
  {
    id: 'vintage_tracktops',
    name: 'Vintage Italian Tracktops',
    description: 'Smuggled Sergio Tacchini & Fila zip-ups sourced from Milan markets.',
    type: 'Contraband',
    quantity: 0,
    buyPrice: 38,
    sellPrice: 90,
    heat: 12,
    capacityPerUnit: 1
  },
  {
    id: 'smuggled_crates',
    name: 'Smuggled Belgian Trappist Crates',
    description: 'Heavy wooden crates of high-proof continental lager.',
    type: 'Contraband',
    quantity: 0,
    buyPrice: 48,
    sellPrice: 115,
    heat: 14,
    capacityPerUnit: 1
  },
  {
    id: 'marine_flares_crate',
    name: 'Surplus Purple Marine Smoke Cans',
    description: 'Industrial high-density smoke canisters smuggled out of naval dockyards.',
    type: 'Contraband',
    quantity: 0,
    buyPrice: 32,
    sellPrice: 80,
    heat: 16,
    capacityPerUnit: 1
  },

  // PREMIUM
  {
    id: 'designer_coats',
    name: 'Deadstock 1988 Designer Jackets',
    description: 'Mint-condition Stone Island & CP Company ice coats with original badges.',
    type: 'Premium',
    quantity: 0,
    buyPrice: 95,
    sellPrice: 245,
    heat: 22,
    capacityPerUnit: 1
  },
  {
    id: 'swiss_chronographs',
    name: 'Imported Chronograph Watches',
    description: 'High-end Swiss street tickers popular among elite Top Boys.',
    type: 'Premium',
    quantity: 0,
    buyPrice: 145,
    sellPrice: 380,
    heat: 28,
    capacityPerUnit: 1
  },
  {
    id: 'gold_sovereigns',
    name: 'Gold Sovereign Terrace Rings',
    description: 'Heavy gold sovereign rings and sovereign pendants traded in cash pubs.',
    type: 'Premium',
    quantity: 0,
    buyPrice: 190,
    sellPrice: 480,
    heat: 32,
    capacityPerUnit: 1
  }
];

export const TRAVEL_EVENTS: Record<TravelRoute, TravelEvent[]> = {
  motorway: [
    {
      id: 'mway_clear',
      title: 'Clear Motorway Fast Run',
      description: 'Traffic was light across the M1/M6 corridors. The transport convoy slipped through toll gates without drawing highway patrol attention.',
      route: 'motorway',
      heatDelta: 0,
      cargoLostQuantity: 0,
      treasuryDelta: 0,
      outcomeType: 'smooth_run'
    },
    {
      id: 'mway_service_check',
      title: 'Service Station Sniffer Dog Sweep',
      description: 'Police vehicles surrounded the motorway services. The lads managed to stash bulk crates behind the recycling dumpsters, but patrol heat has spiked.',
      route: 'motorway',
      heatDelta: 16,
      cargoLostQuantity: 3,
      treasuryDelta: -40,
      outcomeType: 'police_search'
    },
    {
      id: 'mway_hard_shoulder_stop',
      title: 'Traffic Division Hard Shoulder Inspection',
      description: 'An unmarked police car flagged the convoy onto the hard shoulder. The retained solicitor talked down the officers, but spotter heat escalated.',
      route: 'motorway',
      heatDelta: 22,
      cargoLostQuantity: 0,
      treasuryDelta: -80,
      outcomeType: 'bribe_paid'
    }
  ],
  a_roads: [
    {
      id: 'aroad_quiet',
      title: 'Scenic Country Lane Infiltration',
      description: 'Navigating winding country lanes and backroads completely bypassed police motorway cordons. Arrived without a single officer sighting.',
      route: 'a_roads',
      heatDelta: 2,
      cargoLostQuantity: 0,
      treasuryDelta: 0,
      outcomeType: 'smooth_run'
    },
    {
      id: 'aroad_pothole',
      title: 'Rural Speed Trap & Pothole Damage',
      description: 'A county constabulary radar gun caught the lead car. Lads quickly hid designer coats under the spare tyre, paying a speeding fine.',
      route: 'a_roads',
      heatDelta: 10,
      cargoLostQuantity: 0,
      treasuryDelta: -60,
      outcomeType: 'police_search'
    },
    {
      id: 'aroad_barn_stash',
      title: 'Remote Farmyard Stash & Switch',
      description: 'A friendly landlord permitted the lads to switch transport plates behind an old barn, throwing tailing spotters off the scent.',
      route: 'a_roads',
      heatDelta: -5,
      cargoLostQuantity: 0,
      treasuryDelta: -25,
      outcomeType: 'clean'
    }
  ],
  train: [
    {
      id: 'train_singing',
      title: 'Raucous Train Special Corridor',
      description: 'Eighty lads singing terrace anthems filled three carriages. The luggage racks remained untouched by ticket collectors.',
      route: 'train',
      heatDelta: 12,
      cargoLostQuantity: 0,
      treasuryDelta: 0,
      outcomeType: 'smooth_run'
    },
    {
      id: 'train_btp_cordon',
      title: 'British Transport Police Concourse Cordon',
      description: 'BTP officers with riot dogs formed a tight reception at the station barriers. Several duffel bags of contraband had to be abandoned on the luggage rack.',
      route: 'train',
      heatDelta: 28,
      cargoLostQuantity: 6,
      treasuryDelta: 0,
      outcomeType: 'cargo_seized'
    },
    {
      id: 'train_track_jump',
      title: 'Emergency Cord Pulled Ahead of Station',
      description: 'A runner pulled the communication cord half a mile before the station. The firm jumped onto the track embankment, slipping past the terminal trap!',
      route: 'train',
      heatDelta: 18,
      cargoLostQuantity: 2,
      treasuryDelta: 0,
      outcomeType: 'police_search'
    }
  ]
};

export function createDefaultCargoManifest(): CargoManifest {
  return {
    items: TRADING_CATALOG.map(item => ({ ...item, quantity: 0 })),
    totalUnits: 0,
    maxCapacity: 50,
    route: 'motorway',
    awayCityHeat: 0,
    travelEventTriggered: false
  };
}
