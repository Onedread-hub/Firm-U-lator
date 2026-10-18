/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SFS v0.1 Base Engine <-> Firm U-Lator Shared Data Contracts
 * Unification interfaces and bridge event contracts.
 */

import { SfsRegion } from './game';

/**
 * State stored directly inside each SFS v0.1 Team record
 * to persist terrace firm dynamics alongside the main game save.
 */
export interface FirmIntegrationState {
  clubId: string;
  firmLoyalty: number; // 0-100: Current terrace loyalty to the club
  territoryControl: number; // 0-100: % of local metro/stadium territory controlled
  knownRivals: string[]; // Club IDs of historical and derby rivals
  treasury: number; // £: Liquid cash for travel, bails, and gear
}

/**
 * Match result event payload emitted by the SFS v0.1 match engine.
 * Listened to by Firm U-Lator to modulate firm loyalty and mood.
 */
export interface MatchResultEvent {
  matchId: string;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
  result: 'home_win' | 'away_win' | 'draw';
}

/**
 * Firm clash event payload emitted by Firm U-Lator upon clash resolution.
 * Listened to by SFS v0.1 to modulate fan mood, board confidence, and club reputation.
 */
export interface FirmClashEvent {
  clashId: string;
  clubId: string;
  opponentFirmId: string;
  outcome: 'win' | 'loss' | 'draw';
  casualties: number;
  bailsCost: number;
}

/**
 * SFS v0.1 Team interface extended with firm integration data.
 */
export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: SfsRegion;
  leagueTier: 'Big Time League' | 'Up and Comers';
  clubBand: 'Elite' | 'Mid' | 'Underdog';
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  reputation: number; // 1-100
  fanMood: number; // 0-100
  boardConfidence: number; // 0-100
  clubReputation?: number;
  fanMoodModifier?: number;
  firmIntegration?: FirmIntegrationState;
  players?: any[];
}

export type SfsTeam = Team;
