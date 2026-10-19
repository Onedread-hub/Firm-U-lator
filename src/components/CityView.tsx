/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CityView.tsx - The City & Districts Hub
 * Visualizes urban districts, clubs, pubs, restaurants, housing estates, and posh areas.
 * Dynamically grows as the SFS football club wins matches and achieves success.
 */

import React, { useState } from 'react';
import { CityState, CityVenue, DistrictCategory } from '../types/city';
import { Lad, Firm } from '../types/game';
import { Venue, Territory, TerritoryWarCampaign } from '../types/territoryWars';
import { DoorSecurityView } from './DoorSecurityView';
import { TerritoryWarsView } from './TerritoryWarsView';
import { sound } from '../services/sound';
import {
  Building2,
  Beer,
  Music,
  Utensils,
  Home,
  Shield,
  Coins,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  MapPin,
  Lock,
  CheckCircle2,
  Users,
  Footprints,
  Eye,
  Coffee,
  Crown,
  ShieldCheck,
  Swords
} from 'lucide-react';

interface CityViewProps {
  cityState: CityState;
  treasury: number;
  policeHeat: number;
  respect: number;
  loyaltyIndex: number;
  venues: Venue[];
  territories: Territory[];
  lads: Lad[];
  firms: Firm[];
  playerFirm: Firm;
  activeCampaign: TerritoryWarCampaign | null;
  onExecuteVenueAction: (
    venueId: string,
    actionId: string,
    action: CityVenue['actions'][0]
  ) => void;
  onRecruitFromEstate: (role: 'runner' | 'minder' | 'nutter') => void;
  onAssignMinder: (venueId: string, ladId: string) => void;
  onRemoveMinder: (venueId: string, ladId: string) => void;
  onTakeoverVenue: (venueId: string, method: 'hostile' | 'bribe' | 'intimidate') => void;
  onTriggerDoorEvent: (venueId: string) => void;
  onDeclareWar: (territoryId: string, targetFirmId: string, committedLadIds: string[]) => void;
  onResolveDayBattle: (won: boolean, scoreSummary: string) => void;
  onAbandonCampaign: () => void;
}

export const CityView: React.FC<CityViewProps> = ({
  cityState,
  treasury,
  policeHeat,
  respect,
  loyaltyIndex,
  venues,
  territories,
  lads,
  firms,
  playerFirm,
  activeCampaign,
  onExecuteVenueAction,
  onRecruitFromEstate,
  onAssignMinder,
  onRemoveMinder,
  onTakeoverVenue,
  onTriggerDoorEvent,
  onDeclareWar,
  onResolveDayBattle,
  onAbandonCampaign
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'districts' | 'doors' | 'territories'>('districts');
  const [activeCategory, setActiveCategory] = useState<DistrictCategory | 'all'>('all');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(cityState.venues[0]?.id || '');

  const filteredVenues = cityState.venues.filter(v =>
    activeCategory === 'all' ? true : v.district === activeCategory
  );

  const selectedVenue = cityState.venues.find(v => v.id === selectedVenueId) || cityState.venues[0];

  const getDistrictIcon = (category: DistrictCategory) => {
    switch (category) {
      case 'pubs':
        return <Beer className="w-4 h-4 text-amber-400" />;
      case 'nightlife':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'restaurants':
        return <Utensils className="w-4 h-4 text-rose-400" />;
      case 'housing_estates':
        return <Home className="w-4 h-4 text-blue-400" />;
      case 'posh_quarter':
        return <Crown className="w-4 h-4 text-amber-300" />;
      case 'industrial':
        return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getDistrictBadgeStyle = (category: DistrictCategory) => {
    switch (category) {
      case 'pubs':
        return 'bg-amber-950/60 border-amber-800/60 text-amber-300';
      case 'nightlife':
        return 'bg-purple-950/60 border-purple-800/60 text-purple-300';
      case 'restaurants':
        return 'bg-rose-950/60 border-rose-800/60 text-rose-300';
      case 'housing_estates':
        return 'bg-blue-950/60 border-blue-800/60 text-blue-300';
      case 'posh_quarter':
        return 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300';
      case 'industrial':
        return 'bg-slate-800/60 border-slate-700/60 text-slate-300';
    }
  };

  const totalWeeklyRevenue = cityState.venues
    .filter(v => v.controlledByFirm && v.isUnlocked)
    .reduce((sum, v) => sum + v.weeklyRevenue, 0);

  const totalControlled = cityState.venues.filter(v => v.controlledByFirm && v.isUnlocked).length;

  return (
    <div className="space-y-5 pb-12">
      {/* Sub-Tabs: Districts vs Door Security vs Territory Wars */}
      <div className="flex items-center gap-2 border-b border-[#25394f] pb-1">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveSubTab('districts');
          }}
          className={`px-4 py-2 rounded-t font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'districts'
              ? 'bg-[#132030] text-amber-400 border-amber-400'
              : 'text-slate-400 hover:text-white border-transparent'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Districts & Urban Growth</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveSubTab('doors');
          }}
          className={`px-4 py-2 rounded-t font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'doors'
              ? 'bg-[#132030] text-amber-400 border-amber-400'
              : 'text-slate-400 hover:text-white border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Door Security (The Night Job)</span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {venues.filter(v => v.ownerFirmId === playerFirm.id).length} Doors
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveSubTab('territories');
          }}
          className={`px-4 py-2 rounded-t font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'territories'
              ? 'bg-[#132030] text-amber-400 border-amber-400'
              : 'text-slate-400 hover:text-white border-transparent'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Territory Wars (The Map)</span>
          {activeCampaign && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
              WAR ACTIVE
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'doors' ? (
        <DoorSecurityView
          venues={venues}
          lads={lads}
          playerFirm={playerFirm}
          treasury={treasury}
          respect={respect}
          policeHeat={policeHeat}
          onAssignMinder={onAssignMinder}
          onRemoveMinder={onRemoveMinder}
          onTakeoverVenue={onTakeoverVenue}
          onTriggerDoorEvent={onTriggerDoorEvent}
        />
      ) : activeSubTab === 'territories' ? (
        <TerritoryWarsView
          territories={territories}
          venues={venues}
          firms={firms}
          playerFirm={playerFirm}
          lads={lads}
          policeHeat={policeHeat}
          respect={respect}
          treasury={treasury}
          activeCampaign={activeCampaign}
          onDeclareWar={onDeclareWar}
          onResolveDayBattle={onResolveDayBattle}
          onAbandonCampaign={onAbandonCampaign}
        />
      ) : (
        <div className="space-y-5">
      {/* Top Banner: City Skyline & Prosperity Progress */}
      <div className="relative rounded-lg overflow-hidden border border-[#2b3e54] bg-[#0c131c] shadow-xl">
        {/* Gritty retro city pixel illustration background */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/city_districts_map_1792355212982.jpg"
            alt="City Districts Map"
            className="w-full h-full object-cover object-center filter saturate-75 contrast-125"
            onError={e => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c131c] via-[#0c131c]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                SFS Urban Ecology System
              </span>
              <span className="text-xs font-mono text-slate-400">
                {cityState.clubName} Home Turf
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>{cityState.cityName} Metropolitan</span>
              <span className="text-xs px-2.5 py-1 rounded bg-[#1e293b] border border-[#334155] font-mono text-cyan-400 font-semibold">
                Tier {cityState.prosperityTier} / 5
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As <strong>{cityState.clubName}</strong> wins matches and rises through SFS leagues, new money, restaurants, and entertainment arrive. The firm leverages the expanding urban sprawl to recruit lads, enforce territory, and pocket protection cash.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 font-mono">
            <div className="p-2.5 rounded bg-[#121c28]/90 border border-[#25394f]">
              <span className="text-[10px] uppercase text-slate-400 block">Growth Stage</span>
              <span className="text-xs font-bold text-amber-300 truncate block">
                {cityState.growthStage}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#121c28]/90 border border-[#25394f]">
              <span className="text-[10px] uppercase text-slate-400 block">Weekly Firm Dues</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Coins className="w-3 h-3" /> +£{totalWeeklyRevenue}/wk
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#121c28]/90 border border-[#25394f] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-slate-400 block">Terrace Grip</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> {totalControlled} / {cityState.venues.length} Venues
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic City Growth Meter */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#101924]/90 border-t border-[#233549] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Urban Prosperity Index:</span>
            <span className="font-mono font-bold text-white">{cityState.prosperityScore}/100</span>
          </div>

          <div className="flex-1 max-w-md h-2 bg-[#1e293b] rounded-full overflow-hidden border border-[#334155]/60">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, cityState.prosperityScore))}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Next unlock: <span className="text-amber-300 font-semibold">{cityState.prosperityTier < 5 ? 'High Street Designer Boutiques' : 'Maximum Sprawl'}</span>
          </div>
        </div>
      </div>

      {/* District Filter Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Districts', count: cityState.venues.length },
          { id: 'pubs', label: 'Pubs & Alehouses', count: cityState.venues.filter(v => v.district === 'pubs').length },
          { id: 'nightlife', label: 'Nightclubs & Raves', count: cityState.venues.filter(v => v.district === 'nightlife').length },
          { id: 'restaurants', label: 'Caffs & Bistros', count: cityState.venues.filter(v => v.district === 'restaurants').length },
          { id: 'housing_estates', label: 'Council Estates', count: cityState.venues.filter(v => v.district === 'housing_estates').length },
          { id: 'posh_quarter', label: 'Posh Quarters', count: cityState.venues.filter(v => v.district === 'posh_quarter').length },
          { id: 'industrial', label: 'Industrial Sidings', count: cityState.venues.filter(v => v.district === 'industrial').length }
        ].map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap font-medium flex items-center gap-1.5 border text-xs ${
                isActive
                  ? 'bg-[#1e3a5f] text-white border-blue-500 shadow-sm font-bold'
                  : 'bg-[#101924] text-slate-400 border-[#26374a] hover:text-white hover:bg-[#182535]'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono opacity-60">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Venues List on Left, Selected Venue Operations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Venue Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredVenues.map(venue => {
            const isSelected = selectedVenue?.id === venue.id;
            return (
              <div
                key={venue.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedVenueId(venue.id);
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#172535] to-[#121c28] border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-[#101924] border-[#223347] hover:border-[#3b5370] hover:bg-[#14202e]'
                } ${!venue.isUnlocked ? 'opacity-55' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#162333] border border-[#2e4359] flex items-center justify-center shrink-0 shadow-inner">
                      {getDistrictIcon(venue.district)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm tracking-tight">
                          {venue.name}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${getDistrictBadgeStyle(
                            venue.district
                          )}`}
                        >
                          {venue.district.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {venue.description}
                      </div>
                    </div>
                  </div>

                  {/* Status / Lock / Revenue */}
                  <div className="text-right shrink-0">
                    {venue.isUnlocked ? (
                      <div className="space-y-0.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block ${
                            venue.controlledByFirm
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800'
                              : 'bg-amber-950/70 text-amber-400 border-amber-800'
                          }`}
                        >
                          {venue.controlledByFirm ? 'Controlled' : 'Contested'}
                        </span>
                        <div className="text-[11px] font-mono text-emerald-400 font-bold">
                          +£{venue.weeklyRevenue}/wk
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-[#16202c] px-2 py-1 rounded border border-[#25374a]">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Tier {venue.minProsperityTier}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Perk Pill */}
                {venue.isUnlocked && (
                  <div className="mt-3 pt-2.5 border-t border-[#1e2f42] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300/90">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-medium text-[11px]">{venue.specialPerk.title}</span>
                      <span className="text-slate-500 text-[10px]">({venue.specialPerk.statBoost})</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      Firm Grip: <span className="text-white font-bold">{venue.firmControlLevel}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Venue Detail, Perk Operations & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedVenue && (
            <div className="rounded-lg border border-[#2b3e54] bg-[#0f1722] p-5 shadow-xl space-y-4 sticky top-20">
              {/* Header */}
              <div className="border-b border-[#233549] pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDistrictBadgeStyle(
                      selectedVenue.district
                    )}`}
                  >
                    {selectedVenue.district.replace('_', ' ').toUpperCase()}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Atmosphere: <strong className="text-amber-400">{selectedVenue.atmosphereRating}/10</strong>
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-white mt-1">
                  {selectedVenue.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedVenue.description}
                </p>
              </div>

              {/* Special District Perk Highlight */}
              <div className="p-3 rounded bg-[#162333] border border-[#2e4763] space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>{selectedVenue.specialPerk.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {selectedVenue.specialPerk.description}
                </p>
                {selectedVenue.specialPerk.statBoost && (
                  <div className="pt-1 text-[11px] font-mono text-emerald-400 font-semibold">
                    Terrace Bonus: {selectedVenue.specialPerk.statBoost}
                  </div>
                )}
              </div>

              {/* Locked Notice if Venue is Not Yet Available */}
              {!selectedVenue.isUnlocked ? (
                <div className="p-4 rounded bg-rose-950/30 border border-rose-800/40 text-center space-y-2">
                  <Lock className="w-6 h-6 text-rose-400 mx-auto" />
                  <div className="text-sm font-bold text-rose-200">
                    Venue Locked: Urban Growth Required
                  </div>
                  <p className="text-xs text-slate-300">
                    This venue unlocks when <strong>{cityState.clubName}</strong> reaches <strong>Tier {selectedVenue.minProsperityTier}</strong> in the SFS league.
                  </p>
                </div>
              ) : (
                /* Available Actions */
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                    <span>Terrace Operations</span>
                    <span>Bank: £{treasury.toLocaleString()}</span>
                  </h3>

                  <div className="space-y-2.5">
                    {selectedVenue.actions.map(action => {
                      const canAfford = treasury >= action.cost;
                      return (
                        <div
                          key={action.id}
                          className="p-3 rounded bg-[#131d2a] border border-[#233549] space-y-2 hover:border-[#3a5473] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs">
                                {action.label}
                              </div>
                              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                                {action.description}
                              </div>
                            </div>

                            <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                              £{action.cost}
                            </span>
                          </div>

                          {/* Deltas & Execute Button */}
                          <div className="flex items-center justify-between pt-1 border-t border-[#1e2f42] text-[10px] font-mono">
                            <div className="flex items-center gap-2">
                              {action.loyaltyDelta !== 0 && (
                                <span className="text-emerald-400">
                                  +{action.loyaltyDelta}% Loyalty
                                </span>
                              )}
                              {action.respectDelta !== 0 && (
                                <span className="text-amber-400">
                                  +{action.respectDelta} Respect
                                </span>
                              )}
                              {action.policeHeatDelta !== 0 && (
                                <span className={action.policeHeatDelta > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                                  {action.policeHeatDelta > 0 ? `+${action.policeHeatDelta}% Heat` : `${action.policeHeatDelta}% Heat`}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                if (canAfford) {
                                  onExecuteVenueAction(selectedVenue.id, action.id, action);
                                }
                              }}
                              disabled={!canAfford}
                              className={`px-3 py-1 rounded text-[11px] font-bold transition-all uppercase tracking-wide cursor-pointer ${
                                canAfford
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {canAfford ? 'Authorize' : 'Funds Low'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Council Housing Estate Recruitment Shortcut */}
              {selectedVenue.district === 'housing_estates' && selectedVenue.isUnlocked && (
                <div className="p-3 rounded bg-blue-950/40 border border-blue-800/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Estate Casuals Draft</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Scout young fighters directly from {selectedVenue.name} into your active squad:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => onRecruitFromEstate('runner')}
                      className="px-2 py-1 text-[10px] font-bold font-mono rounded bg-[#1c2c3e] border border-[#2d4663] text-cyan-300 hover:bg-[#25394f] transition-colors"
                    >
                      + Runner (£80)
                    </button>
                    <button
                      onClick={() => onRecruitFromEstate('minder')}
                      className="px-2 py-1 text-[10px] font-bold font-mono rounded bg-[#1c2c3e] border border-[#2d4663] text-amber-300 hover:bg-[#25394f] transition-colors"
                    >
                      + Minder (£110)
                    </button>
                    <button
                      onClick={() => onRecruitFromEstate('nutter')}
                      className="px-2 py-1 text-[10px] font-bold font-mono rounded bg-[#1c2c3e] border border-[#2d4663] text-rose-300 hover:bg-[#25394f] transition-colors"
                    >
                      + Nutter (£130)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
