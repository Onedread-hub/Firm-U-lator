/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firm U-Lator: Door Security & Territory Wars Data Contracts
 * Nightlife door minder operations, venue control, and multi-day territorial campaigns.
 */

export type VenueOwnerStatus = 'uncontrolled' | 'controlled' | 'contested';

export interface Venue {
  id: string;
  name: string;
  district: string;
  territoryId: string;
  ownerFirmId: string | null; // null = uncontrolled
  doorStaffIds: string[]; // which lads work the door
  weeklyTake: number; // £ weekly door cut
  policeHeat: number; // 0-100
  status: VenueOwnerStatus;
  capacity: number;
  entryFee: number;
  musicGenre: string;
}

export interface Territory {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  controllingFirmId: string | null;
  dominance: Record<string, number>; // firmId -> dominance % (0-100)
  venueIds: string[];
  strategicBonus?: string;
}

export type DoorEventType = 'unruly_punter' | 'police_visit' | 'rival_top_boy';

export interface DoorChoice {
  label: string;
  description?: string;
  treasuryDelta: number; // negative = cost
  respectDelta: number;
  heatDelta: number;
  triggerClash?: boolean;
  requiresStat?: {
    stat: 'bottle' | 'hardness';
    minValue: number;
  };
}

export interface DoorEvent {
  id: string;
  venueId: string;
  venueName: string;
  type: DoorEventType;
  description: string;
  choices: DoorChoice[];
  resolvedChoiceIndex?: number;
}

export interface WarBattleDay {
  day: number; // 1, 2, 3
  title: string;
  subtitle: string;
  format: '1v1_street' | '8v8_industrial' | 'pub_raid';
  location: string;
  description: string;
  resolved: boolean;
  won?: boolean;
  scoreSummary?: string;
}

export interface TerritoryWarCampaign {
  id: string;
  territoryId: string;
  territoryName: string;
  targetFirmId: string;
  targetFirmName: string;
  currentDay: number; // 1, 2, 3
  wins: number;
  losses: number;
  committedLadIds: string[];
  status: 'active' | 'won' | 'lost';
  history: string[];
  days: WarBattleDay[];
}
