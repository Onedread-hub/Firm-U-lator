import { CargoManifest } from './trading';

export type LadRole = 'top_boy' | 'face' | 'minder' | 'runner' | 'nutter' | 'bruiser' | 'veteran' | 'casual' | 'scout';
export type LadStatus = 'active' | 'injured' | 'bailed' | 'banned' | 'hospitalised';
export type SfsRegion = 'Northern' | 'Midlands' | 'Coastal' | 'Southern';

export interface LadTrait {
  name: string;
  description: string;
  statBonus?: {
    hardness?: number;
    bottle?: number;
    pace?: number;
    streetSmarts?: number;
    stamina?: number;
  };
}

export interface Lad {
  id: string;
  name: string;
  nickname: string;
  role: LadRole;
  hardness: number; // 1-100: Physical power, strike impact, block resistance
  bottle: number; // 1-100: Mental courage, panic threshold under pressure
  pace: number; // 1-100: Speed for flanking, chasing scouts, escaping police
  streetSmarts: number; // 1-100: Avoiding traps, detecting police vans, ambushes
  loyalty: number; // 1-100: Terrace loyalty to firm and Top Boy
  stamina: number; // 1-100: Endurance through rounds
  health: number; // Current HP 0-100
  maxHealth: number;
  legalHeat: number; // 0-100: Police watch score
  status: LadStatus;
  trait: LadTrait;
  matchesFought: number;
  victories: number;
  avatarSeed: string;
}

export type FormationType = 'the_wedge' | 'flat_phalanx' | 'pincer_flank' | 'box_retain' | 'alley_ambush';

export type WeaponDoctrine = 'strictly_fists' | 'bottles_and_pints' | 'smoke_and_flares' | 'scaffold_and_belts';

export type LineDepth = 'deep_hold' | 'mid_pavement' | 'high_press';

export interface Tactics {
  formation: FormationType;
  aggression: number; // 1 (Canny/Defensive) to 5 (Red Mist All-Out)
  lineDepth: LineDepth;
  weaponDoctrine: WeaponDoctrine;
  retreatThreshold: number; // % team health/morale before tactical retreat (10 to 60)
  priorityTarget: 'break_frontline' | 'isolate_top_boy' | 'pin_runners' | 'hold_the_door';
  selectedLadIds: string[]; // 8 active lads for the clash
}

export type TransportMode = 'train_special' | 'chartered_minibus' | 'official_coach' | 'unmarked_convoy';
export type PubStrategy = 'neutral_spoons' | 'enemy_local' | 'station_concourse' | 'lock_in_fortress';
export type ArrivalTiming = 'dawn_infiltrate' | 'midday_march' | 'post_whistle_rush';

export interface AwayTravelPlan {
  transportMode: TransportMode;
  pubStrategy: PubStrategy;
  arrivalTiming: ArrivalTiming;
  contrabandSupplies: {
    flares: number;
    firstAid: number;
    scoutsAhead: boolean;
    solicitorOnCall: boolean;
  };
  totalCost: number;
  stealthBonus: number;
  loyaltyImpact: number;
  policeHeatRisk: number;
  cargoManifest?: CargoManifest;
  awayCityHeat?: number;
}

export type LoyaltyTier = 'Diehards' | 'Away Veterans' | 'Weekend Casuals' | 'Youth Ultras';

export interface Firm {
  id: string;
  name: string;
  shortName: string;
  footballClub: string;
  leagueTier: string;
  city: string;
  region: SfsRegion;
  clubBand: 'Elite' | 'Mid' | 'Underdog';
  primaryColor: string;
  secondaryColor: string;
  pubStronghold: string;
  stadium: string;
  respect: number; // 0-1000
  memberCount: number;
  loyaltyTier: LoyaltyTier;
  loyaltyIndex: number; // 0-100
  territoryPoints: number;
  firmIntegration?: {
    clubId: string;
    firmLoyalty: number;
    territoryControl: number;
    knownRivals: string[];
  };
  tacticsProfile: {
    favoredFormation: FormationType;
    baseHardness: number;
    baseBottle: number;
    aggression: number;
    firmStyle: string;
  };
}

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
  firmIntegration?: {
    clubId: string;
    firmLoyalty: number; // 0-100
    territoryControl: number; // 0-100
    knownRivals: string[]; // club IDs
    treasury: number; // £
  };
  players?: any[];
}

export interface Fixture {
  id: string;
  round: number;
  homeFirmId: string;
  awayFirmId: string;
  venueName: string;
  location: string;
  footballFixture: string;
  clashPlayed: boolean;
  outcome?: ClashOutcome;
  isDerby?: boolean;
}

export interface ClashOutcome {
  winnerId: string | 'draw' | 'police_dispersed';
  playerFirmName: string;
  rivalFirmName: string;
  roundsFought: number;
  playerInjuries: string[];
  rivalInjuries: string[];
  arrests: string[];
  respectDelta: number;
  loyaltyDelta: number;
  treasuryDelta: number;
  headline: string;
  matchNarrative: string[];
  newspaperQuote: string;
}

export interface TerraceNews {
  id: string;
  headline: string;
  snippet: string;
  source: string;
  timeAgo: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TerritoryLocation {
  id: string;
  name: string;
  description: string;
  controlledBy: string; // firmId
  defenseLevel: number; // 1-5
  weeklyRevenue: number;
  strategicBonus: string;
}

export interface GameSaveState {
  playerFirmId: string;
  currentRound: number;
  treasury: number;
  policeHeat: number; // 0-100
  respect: number;
  loyaltyIndex: number;
  lads: Lad[];
  tactics: Tactics;
  awayTravelPlan: AwayTravelPlan;
  fixtures: Fixture[];
  territories: TerritoryLocation[];
  news: TerraceNews[];
  clashHistory: ClashOutcome[];
  cityState?: any;
  awayCityHeat?: number;
}
