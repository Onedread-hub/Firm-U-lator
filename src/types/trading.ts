/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firm U-Lator: Black Market Trading & Cargo Subsystem
 * High-risk, high-reward economic transport and contraband trading mechanics.
 */

export type GoodsType = 'Bootleg' | 'Contraband' | 'Premium';

export interface TradingItem {
  id: string;
  name: string;
  description: string;
  type: GoodsType;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  heat: number;
  capacityPerUnit: number;
}

export type TravelRoute = 'motorway' | 'a_roads' | 'train';

export interface TravelEvent {
  id: string;
  title: string;
  description: string;
  route: TravelRoute;
  heatDelta: number;
  cargoLostQuantity: number;
  treasuryDelta: number;
  outcomeType: 'clean' | 'police_search' | 'cargo_seized' | 'bribe_paid' | 'smooth_run';
}

export interface CargoManifest {
  items: TradingItem[];
  totalUnits: number;
  maxCapacity: number; // 50 units
  route: TravelRoute;
  awayCityHeat: number; // Accumulates from trading and transit stops
  travelEventTriggered: boolean;
  lastTravelEvent?: TravelEvent;
}
