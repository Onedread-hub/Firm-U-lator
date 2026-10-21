/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * diplomacy.ts
 * Types for the Leicester Highfields (1980-2010) Subculture Diplomacy Simulation.
 * Implements simultaneous turn-based Diplomacy orders (Hold, Move, Support, Broadcast),
 * subcultural factions, police tension, sector control, and riot escalation.
 */

export type SubcultureType =
  | 'rasta'
  | 'punk'
  | 'traveller'
  | 'hippie'
  | 'artist'
  | 'biker'
  | 'casual'
  | 'police';

export type DiplomacyOrderType = 'HOLD' | 'MOVE' | 'SUPPORT' | 'BROADCAST';

export type TreatyType =
  | 'anti_police_pact'     // Mutual defense against Police raids
  | 'non_aggression'       // Will not attack each other's sectors
  | 'sound_clash_alliance' // Joint free festival / sound system boosts morale
  | 'intelligence_sharing';// Reveal police patrol routes

export type TreatyStatus = 'proposed' | 'active' | 'rejected' | 'broken';

export interface DiplomacyTreaty {
  id: string;
  type: TreatyType;
  factionAId: string;
  factionBId: string;
  status: TreatyStatus;
  turnsRemaining: number;
  signedYear: number;
  signedSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}

export interface SectorOrder {
  sectorId: string;
  factionId: string;
  orderType: DiplomacyOrderType;
  targetSectorId?: string; // For MOVE
  supportedFactionId?: string; // For SUPPORT
  supportedSectorId?: string; // For SUPPORT
}

export interface HighfieldsSector {
  id: string;
  name: string;
  shortName: string;
  historicalContext: string;
  x: number; // % coordinates on map (0-100)
  y: number; // % coordinates on map (0-100)
  adjacentSectorIds: string[];
  isSupplyCenter: boolean;
  controlledByFactionId: string; // Faction ID or 'police' or 'neutral'
  barricadeLevel: number; // 0 to 5
  soundSystemPower: number; // 0 to 100
  policeHeat: number; // 0 to 100
  revenueWeekly: number; // £
  landmark: string;
}

export interface SubcultureFaction {
  id: string;
  name: string;
  subculture: SubcultureType;
  leaderName: string;
  leaderTitle: string;
  tagline: string;
  ethos: string;
  primaryColor: string;
  secondaryColor: string;
  headquartersSectorId: string;
  respect: number; // 0-1000
  streetCred: number; // 0-100
  treasury: number; // £
  policeHeat: number; // 0-100
  personality: 'defiant' | 'peaceful' | 'radical' | 'militant' | 'opportunist' | 'dogmatic';
  aiTrustInPlayer: number; // 0-100
  crewCount: number;
  favoredMusic: string;
  avatarIcon: string;
}

export interface HistoricEvent {
  year: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  title: string;
  headline: string;
  description: string;
  policeEscalationDelta: number;
  specialRules?: string;
  isRiotYear?: boolean;
}

export interface SeasonResolutionReport {
  year: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  ordersExecuted: {
    factionName: string;
    description: string;
    success: boolean;
    clashTriggered?: boolean;
    combatSectors?: string[];
  }[];
  policeAction: {
    actionType: 'raid' | 'curfew' | 'kettle' | 'surveillance' | 'none';
    targetSectorName: string;
    description: string;
  };
  riotTriggered: boolean;
  riotLocation?: string;
}
