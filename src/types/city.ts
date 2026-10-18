/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * City & Urban Ecology Types for Firm U-Lator
 * Models city districts, venues, estates, posh quarters, and dynamic growth tied to SFS football success.
 */

export type DistrictCategory =
  | 'pubs'
  | 'nightlife'
  | 'restaurants'
  | 'housing_estates'
  | 'posh_quarter'
  | 'industrial';

export type CityGrowthStage =
  | 'Gritty Mill Town'
  | 'Developing Industrial Hub'
  | 'Booming Regional Centre'
  | 'Prosperous Metro'
  | 'Cosmopolitan Football Capital';

export interface CityVenue {
  id: string;
  name: string;
  district: DistrictCategory;
  description: string;
  minProsperityTier: number; // 1 to 5 - unlocks as club reputation/tier rises
  isUnlocked: boolean;
  controlledByFirm: boolean;
  firmControlLevel: number; // 0 to 100%
  weeklyRevenue: number;
  atmosphereRating: number; // 1-10
  specialPerk: {
    title: string;
    description: string;
    statBoost?: string;
  };
  actions: {
    id: string;
    label: string;
    cost: number;
    description: string;
    policeHeatDelta: number;
    loyaltyDelta: number;
    respectDelta: number;
    cashDelta?: number;
    type: 'recruit' | 'stamina_boost' | 'protection_racket' | 'party' | 'tag_territory';
  }[];
}

export interface CityState {
  cityName: string;
  clubName: string;
  prosperityTier: number; // 1 to 5
  growthStage: CityGrowthStage;
  prosperityScore: number; // 0 to 100 (driven by club league standing, wins, and fan mood)
  terraceControlScore: number; // 0 to 100% overall city grip
  councilStanding: 'Crackdown' | 'Wary' | 'Neutral' | 'Cooperative';
  venues: CityVenue[];
  cityDispatches: {
    id: string;
    timestamp: string;
    headline: string;
    body: string;
    category: 'growth' | 'clash' | 'police' | 'culture';
  }[];
}
