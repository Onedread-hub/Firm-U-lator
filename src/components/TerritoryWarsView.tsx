/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TerritoryWarsView.tsx - The Map & Multi-Day Campaigns
 * Visualizes urban territory dominance (The Docks, High Street, Station Approach,
 * Council Estate, Stadium Quarter). Declare territorial wars (Cost: 100 Police Heat),
 * commit up to 20 lads, and execute 3-day campaigns (1v1 streets, 8v8 industrial brawl,
 * and primary pub raid).
 */

import React, { useState } from 'react';
import { Territory, Venue, TerritoryWarCampaign, WarBattleDay } from '../types/territoryWars';
import { Firm, Lad } from '../types/game';
import { sound } from '../services/sound';
import {
  MapPin,
  Shield,
  ShieldAlert,
  Flame,
  Swords,
  Trophy,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Skull
} from 'lucide-react';

interface TerritoryWarsViewProps {
  territories: Territory[];
  venues: Venue[];
  firms: Firm[];
  playerFirm: Firm;
  lads: Lad[];
  policeHeat: number;
  respect: number;
  treasury: number;
  activeCampaign: TerritoryWarCampaign | null;
  onDeclareWar: (territoryId: string, targetFirmId: string, committedLadIds: string[]) => void;
  onResolveDayBattle: (won: boolean, scoreSummary: string) => void;
  onAbandonCampaign: () => void;
}

export const TerritoryWarsView: React.FC<TerritoryWarsViewProps> = ({
  territories,
  venues,
  firms,
  playerFirm,
  lads,
  policeHeat,
  respect,
  treasury,
  activeCampaign,
  onDeclareWar,
  onResolveDayBattle,
  onAbandonCampaign
}) => {
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>(territories[0]?.id || '');
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState<boolean>(false);
  const [selectedLadIds, setSelectedLadIds] = useState<string[]>(() =>
    lads.filter(l => l.status === 'active').slice(0, 12).map(l => l.id)
  );

  const selectedTerritory = territories.find(t => t.id === selectedTerritoryId) || territories[0];
  const rivalFirms = firms.filter(f => f.id !== playerFirm.id);

  const targetFirmForSelected = rivalFirms.find(f => {
    if (selectedTerritory.controllingFirmId === f.id) return true;
    return (selectedTerritory.dominance[f.id] || 0) > 20;
  }) || rivalFirms[0];

  const playerDominance = selectedTerritory?.dominance[playerFirm.id] || 0;
  const isControlledByPlayer = selectedTerritory?.controllingFirmId === playerFirm.id;

  const handleToggleLad = (ladId: string) => {
    sound.playClick();
    if (selectedLadIds.includes(ladId)) {
      setSelectedLadIds(prev => prev.filter(id => id !== ladId));
    } else {
      if (selectedLadIds.length >= 20) {
        sound.playHit();
        return;
      }
      setSelectedLadIds(prev => [...prev, ladId]);
    }
  };

  const handleStartWar = () => {
    if (selectedLadIds.length === 0) return;
    sound.playWhistle();
    onDeclareWar(selectedTerritory.id, targetFirmForSelected.id, selectedLadIds);
    setIsDeclareModalOpen(false);
  };

  // Resolve current battle day simulation
  const handleSimulateBattleDay = (day: WarBattleDay) => {
    sound.playWhistle();
    // Calculate combat rating of committed lads
    const committedLads = lads.filter(l => activeCampaign?.committedLadIds.includes(l.id));
    const avgHardness = committedLads.length > 0
      ? committedLads.reduce((s, l) => s + l.hardness, 0) / committedLads.length
      : 50;
    const avgBottle = committedLads.length > 0
      ? committedLads.reduce((s, l) => s + l.bottle, 0) / committedLads.length
      : 50;

    const baseWinChance = (avgHardness * 0.45) + (avgBottle * 0.45) + (committedLads.length * 1.5);
    const won = Math.random() * 100 < Math.min(85, Math.max(25, baseWinChance));

    let scoreSummary = '';
    if (day.format === '1v1_street') {
      scoreSummary = won
        ? 'Tactical Victory: Your lads ambushed rival lookouts down the alleyways (4 out of 5 encounters won).'
        : 'Repulsed: Rival spotters drew your scouts into a police cordon.';
    } else if (day.format === '8v8_industrial') {
      scoreSummary = won
        ? 'Decisive Brawl: 8 firm minders routed the rival front line in the container yard.'
        : 'Bruising Reversal: Rival firm held the canal bridge and forced a withdrawal.';
    } else {
      scoreSummary = won
        ? 'Total Fortress Breached: Stormed their primary taproom, planted firm colors!'
        : 'Siege Broken: Rival reinforcements counter-attacked from the rear car park.';
    }

    if (won) {
      sound.playCheer();
    } else {
      sound.playHit();
    }

    onResolveDayBattle(won, scoreSummary);
  };

  return (
    <div className="space-y-6">
      {/* Active War Campaign Banner if active */}
      {activeCampaign && (
        <div className="bg-[#121822] border-2 border-rose-600 rounded-lg p-4 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-rose-950 border border-rose-600 text-rose-400">
                <Swords className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-rose-400 font-mono tracking-widest">
                  CAMPAIGN IN PROGRESS · DAY {activeCampaign.currentDay} OF 3
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  The Battle for {activeCampaign.territoryName} vs {activeCampaign.targetFirmName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-[#0b1017] px-3 py-1.5 rounded border border-[#202f42]">
                <span className="text-slate-400">Score: </span>
                <span className="text-emerald-400 font-bold">{activeCampaign.wins} W</span>
                <span className="text-slate-500"> - </span>
                <span className="text-rose-400 font-bold">{activeCampaign.losses} L</span>
              </div>

              <button
                type="button"
                onClick={onAbandonCampaign}
                className="px-2.5 py-1 text-slate-400 hover:text-rose-300 text-[11px] font-bold rounded bg-[#101824] border border-[#202e40] transition-colors"
              >
                Call Off Campaign
              </button>
            </div>
          </div>

          {/* 3-Day Steps Progression */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeCampaign.days.map((day, idx) => {
              const isCurrent = activeCampaign.currentDay === day.day && activeCampaign.status === 'active';
              const isPast = day.resolved;
              return (
                <div
                  key={day.day}
                  className={`p-3.5 rounded border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-[#182638] border-amber-400 shadow-lg ring-1 ring-amber-400/30'
                      : isPast
                      ? day.won
                        ? 'bg-emerald-950/40 border-emerald-800 text-slate-300'
                        : 'bg-rose-950/40 border-rose-800 text-slate-300'
                      : 'bg-[#0a0f17] border-[#1b2838] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold uppercase text-amber-400">Day {day.day}</span>
                      {isPast ? (
                        <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          day.won ? 'bg-emerald-800 text-white' : 'bg-rose-800 text-white'
                        }`}>
                          {day.won ? 'VICTORY' : 'DEFEAT'}
                        </span>
                      ) : isCurrent ? (
                        <span className="bg-amber-500 text-black font-bold px-1.5 py-0.2 rounded text-[10px] animate-pulse">
                          UP NEXT
                        </span>
                      ) : (
                        <span className="text-slate-500">LOCKED</span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white mt-1 font-sans">{day.title}</h4>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{day.location}</div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-tight">
                      {day.description}
                    </p>

                    {day.scoreSummary && (
                      <div className="mt-2.5 p-2 rounded bg-black/40 border border-slate-700/50 text-[10px] font-mono text-amber-200">
                        {day.scoreSummary}
                      </div>
                    )}
                  </div>

                  {isCurrent && (
                    <div className="pt-3 mt-3 border-t border-[#2a3c52]">
                      <button
                        type="button"
                        onClick={() => handleSimulateBattleDay(day)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Clash Day {day.day}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Map & Territories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Territories Roster Left */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0c141e] p-3 rounded-t border-b border-[#233549] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>City Territory Districts</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">5 Key Zones</span>
          </div>

          <div className="space-y-2">
            {territories.map(terr => {
              const isSelected = terr.id === selectedTerritory?.id;
              const isControlled = terr.controllingFirmId === playerFirm.id;
              const playerDom = terr.dominance[playerFirm.id] || 0;

              return (
                <div
                  key={terr.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTerritoryId(terr.id);
                  }}
                  className={`p-3.5 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#152335] border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-[#0c131c] border-[#1e2f42] hover:bg-[#111a26] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-sans">{terr.name}</span>
                        {isControlled ? (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            CONTROLLED ({playerDom}%)
                          </span>
                        ) : (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            RIVAL GRIP ({playerDom}%)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {terr.venueIds.length} Key Venues · {terr.strategicBonus}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Dominance Bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-[#111a24] h-2 rounded-full overflow-hidden flex border border-[#1e2c3c]">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${playerDom}%` }}
                        title={`Your Dominance: ${playerDom}%`}
                      />
                      <div
                        className="bg-rose-600 h-full transition-all"
                        style={{ width: `${100 - playerDom}%` }}
                        title={`Rival Dominance: ${100 - playerDom}%`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Territory Details & War Launch Right */}
        <div className="lg:col-span-7">
          {selectedTerritory && (
            <div className="bg-[#0b121b] border border-[#233549] rounded-lg p-5 space-y-5">
              <div className="border-b border-[#203247] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                    Territory Dossier
                  </div>
                  <h2 className="text-xl font-extrabold text-white font-sans mt-0.5">
                    {selectedTerritory.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    {selectedTerritory.description}
                  </p>
                </div>

                <div className="bg-[#121c29] p-3 rounded border border-[#25394f] text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Your Dominance</span>
                  <div className={`text-xl font-bold ${playerDominance > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {playerDominance}%
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {isControlledByPlayer ? 'Firm Territory' : 'Contested Turf'}
                  </span>
                </div>
              </div>

              {/* Strategic Bonus Box */}
              <div className="bg-[#101925] border border-[#22354a] rounded p-3 text-xs flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">Strategic Perk: </span>
                  <span className="text-slate-200">{selectedTerritory.strategicBonus}</span>
                </div>
              </div>

              {/* Venues Located in this Territory */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans mb-2">
                  Venues Under This Territory ({selectedTerritory.venueIds.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venues
                    .filter(v => selectedTerritory.venueIds.includes(v.id))
                    .map(ven => {
                      const isMine = ven.ownerFirmId === playerFirm.id;
                      return (
                        <div
                          key={ven.id}
                          className="bg-[#0f1724] border border-[#1f3147] rounded p-2.5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{ven.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Take: £{ven.weeklyTake}/wk · {ven.doorStaffIds.length} Minders
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            isMine ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isMine ? 'Protected' : 'Rival'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Declare War Section */}
              <div className="pt-3 border-t border-[#1e2f42] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-rose-500" />
                    <span>Launch Multi-Day Territorial War</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Cost: 100 Police Heat spike · Commit up to 20 Casuals · Win 2 of 3 clashes to seize territory
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(true)}
                  disabled={activeCampaign !== null}
                  className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow ${
                    activeCampaign !== null
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-700 hover:bg-rose-600 text-white cursor-pointer animate-pulse'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  <span>Declare War</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Declare War Modal: Commit Lads */}
      {isDeclareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-mono">
          <div className="w-full max-w-xl bg-[#0c121a] border-2 border-rose-600 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 p-4 border-b border-rose-700 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                  COUNCIL OF WAR · OPERATION TERRITORY SEIZURE
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  Target: {selectedTerritory?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDeclareModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#101924]"
              >
                Cancel
              </button>
            </div>

            {/* Warning details */}
            <div className="p-4 bg-rose-950/30 border-b border-rose-900/50 text-xs text-rose-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Declaration Consequence: Police Heat will increase by +100!</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Selected lads will be committed to a grueling 3-day street campaign. Casualties and bails will be handled by the firm treasury.
              </p>
            </div>

            {/* Select Lads */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 bg-[#090e15]">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex justify-between">
                <span>Select Lads to Commit:</span>
                <span className="text-amber-400">{selectedLadIds.length} / 20 Selected</span>
              </div>

              {lads
                .filter(l => l.status === 'active')
                .map(lad => {
                  const isSelected = selectedLadIds.includes(lad.id);
                  return (
                    <div
                      key={lad.id}
                      onClick={() => handleToggleLad(lad.id)}
                      className={`p-2.5 rounded border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#1a2d42] border-amber-400 text-white shadow-sm'
                          : 'bg-[#0f1722] border-[#1e2f42] text-slate-400 hover:bg-[#14202e]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-200">
                          {lad.name} <span className="text-amber-400">("{lad.nickname}")</span>
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          Role: {lad.role} · Matches: {lad.matchesFought} · Victories: {lad.victories}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-emerald-400">STR: {lad.hardness}</span>
                        <span className="text-amber-400">BTL: {lad.bottle}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 accent-amber-400 rounded"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#0a0f17] border-t border-[#1e2f42] flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-mono">
                Police Heat: <strong className="text-rose-400">{policeHeat} + 100</strong>
              </div>

              <button
                type="button"
                onClick={handleStartWar}
                disabled={selectedLadIds.length === 0}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase rounded transition-all flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>Begin Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
