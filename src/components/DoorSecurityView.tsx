/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DoorSecurityView.tsx - The Night Job
 * Manage door minders across controlled nightclubs and pubs.
 * Generate weekly income, pay wages (£150/lad/week), risk police heat,
 * and handle street takeovers through intimidation, bribes, or clashes.
 */

import React, { useState } from 'react';
import { Venue, DoorEvent } from '../types/territoryWars';
import { Lad, Firm } from '../types/game';
import { sound } from '../services/sound';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  AlertTriangle,
  Flame,
  Beer,
  Crown,
  Key,
  Skull,
  UserPlus,
  UserMinus,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';

interface DoorSecurityViewProps {
  venues: Venue[];
  lads: Lad[];
  playerFirm: Firm;
  treasury: number;
  respect: number;
  policeHeat: number;
  onAssignMinder: (venueId: string, ladId: string) => void;
  onRemoveMinder: (venueId: string, ladId: string) => void;
  onTakeoverVenue: (venueId: string, method: 'hostile' | 'bribe' | 'intimidate') => void;
  onTriggerDoorEvent: (venueId: string) => void;
}

export const DoorSecurityView: React.FC<DoorSecurityViewProps> = ({
  venues,
  lads,
  playerFirm,
  treasury,
  respect,
  policeHeat,
  onAssignMinder,
  onRemoveMinder,
  onTakeoverVenue,
  onTriggerDoorEvent
}) => {
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || '');
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];

  const controlledVenues = venues.filter(v => v.ownerFirmId === playerFirm.id);
  const totalWeeklyDoorGross = controlledVenues.reduce((sum, v) => sum + v.weeklyTake, 0);
  const totalMindersCount = controlledVenues.reduce((sum, v) => sum + v.doorStaffIds.length, 0);
  const totalWages = totalMindersCount * 150;
  const netWeeklyDoorProfit = totalWeeklyDoorGross - totalWages;

  // Lads working doors anywhere
  const allAssignedLadIds = new Set(venues.flatMap(v => v.doorStaffIds));
  const availableLads = lads.filter(
    l => !allAssignedLadIds.has(l.id) && l.status === 'active'
  );

  const assignedLadsForSelectedVenue = lads.filter(l =>
    selectedVenue?.doorStaffIds.includes(l.id)
  );

  const handleOpenAssignModal = () => {
    sound.playClick();
    setAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#0e1622] p-3 rounded border border-[#213247] shadow-sm">
          <div className="text-[10px] text-[#7188a1] uppercase font-bold">Doors Controlled</div>
          <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{controlledVenues.length} / {venues.length}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Venues under firm protection</div>
        </div>

        <div className="bg-[#0e1622] p-3 rounded border border-[#213247] shadow-sm">
          <div className="text-[10px] text-[#7188a1] uppercase font-bold">Door Minders Active</div>
          <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{totalMindersCount} Lads</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Wages: £150 / lad / wk (£{totalWages})</div>
        </div>

        <div className="bg-[#0e1622] p-3 rounded border border-[#213247] shadow-sm">
          <div className="text-[10px] text-[#7188a1] uppercase font-bold">Gross Door Take</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>£{totalWeeklyDoorGross}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Collected every Saturday round</div>
        </div>

        <div className="bg-[#0e1622] p-3 rounded border border-[#213247] shadow-sm">
          <div className="text-[10px] text-[#7188a1] uppercase font-bold">Net Weekly Profit</div>
          <div className={`text-xl font-bold flex items-center gap-1.5 mt-0.5 ${
            netWeeklyDoorProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            <span>£{netWeeklyDoorProfit}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">After minder wages deducted</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Venue Roster List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0d1520] p-3 rounded-t border-b border-[#24374b] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-2">
              <Beer className="w-4 h-4 text-amber-400" />
              <span>City Nightlife Doors</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{venues.length} venues mapped</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {venues.map(ven => {
              const isSelected = ven.id === selectedVenue?.id;
              const isMine = ven.ownerFirmId === playerFirm.id;
              const isContested = ven.status === 'contested';

              return (
                <div
                  key={ven.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedVenueId(ven.id);
                  }}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#152335] border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-[#0c131c] border-[#1e2f42] hover:bg-[#111a26] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-sans">{ven.name}</span>
                        {isMine ? (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            RUNNING DOOR
                          </span>
                        ) : isContested ? (
                          <span className="bg-rose-950 text-rose-400 border border-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono animate-pulse">
                            CONTESTED
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            UNCONTROLLED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {ven.district} · {ven.musicGenre}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-emerald-400 font-bold">£{ven.weeklyTake}/wk</div>
                      <div className="text-[10px] text-slate-400">
                        {ven.doorStaffIds.length} Minders
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Venue Control Panel */}
        <div className="lg:col-span-7">
          {selectedVenue && (
            <div className="bg-[#0b121b] border border-[#233549] rounded-lg p-5 space-y-5">
              {/* Venue Header */}
              <div className="border-b border-[#203247] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                    {selectedVenue.district} · Capacity {selectedVenue.capacity}
                  </div>
                  <h2 className="text-xl font-extrabold text-white font-sans mt-0.5">
                    {selectedVenue.name}
                  </h2>
                  <div className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-3">
                    <span>Entry: {selectedVenue.entryFee ? `£${selectedVenue.entryFee}` : 'Free'}</span>
                    <span>·</span>
                    <span>Music: {selectedVenue.musicGenre}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <Flame className="w-3 h-3" /> Heat: {selectedVenue.policeHeat}%
                    </span>
                  </div>
                </div>

                <div className="bg-[#121c29] p-3 rounded border border-[#25394f] text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Weekly Door Cut</span>
                  <div className="text-lg font-bold text-emerald-400">£{selectedVenue.weeklyTake}</div>
                </div>
              </div>

              {/* Status & Takeover Options if not controlled */}
              {selectedVenue.ownerFirmId !== playerFirm.id ? (
                <div className="bg-[#101824] border border-[#2b3e55] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>This door is not under your firm's protection!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To claim the door cut (£{selectedVenue.weeklyTake}/week) and station your minders here, you must take control through muscle, bribery, or sheer street intimidation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    {/* Hostile Takeover */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playWhistle();
                        onTakeoverVenue(selectedVenue.id, 'hostile');
                      }}
                      className="p-2.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700 rounded text-left transition-all"
                    >
                      <div className="font-bold text-xs text-rose-200 flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5 text-rose-400" />
                        <span>Hostile Takeover</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Stage a door scrap. Triggers an instant street clash.
                      </div>
                    </button>

                    {/* Bribe Owner */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onTakeoverVenue(selectedVenue.id, 'bribe');
                      }}
                      className="p-2.5 bg-[#142335] hover:bg-[#1a2d45] border border-[#2d496a] rounded text-left transition-all"
                    >
                      <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bribe Owner (£450)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Slip brown envelope to licensee. Instant peaceful takeover.
                      </div>
                    </button>

                    {/* Intimidate Owner */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPunch();
                        onTakeoverVenue(selectedVenue.id, 'intimidate');
                      }}
                      className="p-2.5 bg-[#121c2a] hover:bg-[#172538] border border-[#283e58] rounded text-left transition-all"
                    >
                      <div className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-sky-400" />
                        <span>Intimidate Owner</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Requires &gt;= 500 Respect. Current: {respect} pts.
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* Controlled Venue Staffing & Operations */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Door Minders on Duty ({assignedLadsForSelectedVenue.length} Lads)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Minders protect door cash, intimidate troublemakers, and resolve door events.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAssignModal}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded transition-all flex items-center gap-1 shadow"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Minder</span>
                    </button>
                  </div>

                  {/* Assigned Minders Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedLadsForSelectedVenue.length === 0 ? (
                      <div className="col-span-2 p-6 text-center border border-dashed border-[#233549] rounded-lg bg-[#0e1520] text-slate-400 text-xs font-mono">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <p className="font-bold text-slate-300">No door minders assigned to this venue!</p>
                        <p className="text-[11px] mt-1 text-slate-500">
                          Unmanned doors risk instant takeover from rival firms and full theft of door revenue.
                        </p>
                      </div>
                    ) : (
                      assignedLadsForSelectedVenue.map(lad => (
                        <div
                          key={lad.id}
                          className="bg-[#0f1724] border border-[#21354d] rounded p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-sm text-white">
                              {lad.name}{' '}
                              <span className="text-[11px] text-amber-400 font-mono">("{lad.nickname}")</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono capitalize">
                              Role: {lad.role} · Wage: £150/wk
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-mono mt-1">
                              <span className="text-emerald-400">STR: {lad.hardness}</span>
                              <span className="text-amber-400">Bottle: {lad.bottle}</span>
                              <span className="text-slate-300">HP: {lad.health}%</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              onRemoveMinder(selectedVenue.id, lad.id);
                            }}
                            className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                            title="Remove from door"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Manual Simulation: Trigger Door Incident */}
                  <div className="pt-2 border-t border-[#1e2f42] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Simulate Nightlife Confrontation</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Test your minders against unruly punters, police visits, or rival Top Boys.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onTriggerDoorEvent(selectedVenue.id);
                      }}
                      className="px-3 py-1.5 bg-[#172738] hover:bg-[#20344d] border border-[#2b4463] text-amber-300 font-bold text-xs rounded transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trigger Event</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assign Minder Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
          <div className="w-full max-w-lg bg-[#0d141e] border-2 border-[#2b3e55] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#142333] p-4 border-b border-[#2b3e55] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">
                  Select Door Minder for {selectedVenue?.name}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Minders require high Strength and Bottle to handle door heat.
                </div>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#101924]"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 bg-[#090e15]">
              {availableLads.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  All active lads are already assigned to doors or on other duties.
                </div>
              ) : (
                availableLads.map(lad => (
                  <div
                    key={lad.id}
                    onClick={() => {
                      sound.playClick();
                      onAssignMinder(selectedVenue.id, lad.id);
                      setAssignModalOpen(false);
                    }}
                    className="p-2.5 rounded border border-[#203145] bg-[#0f1722] hover:bg-[#162334] hover:border-amber-400 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100">
                        {lad.name}{' '}
                        <span className="text-[11px] text-amber-400">("{lad.nickname}")</span>
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        Role: {lad.role} · Matches: {lad.matchesFought} · Victories: {lad.victories}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-bold">STR: {lad.hardness}</span>
                      <span className="text-amber-400 font-bold">Bottle: {lad.bottle}</span>
                      <span className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] rounded">
                        Assign
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
