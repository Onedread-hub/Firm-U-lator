/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DiplomacyMapView.tsx
 * Strategic tactical map of Leicester Highfields (1980-2010).
 * Features classic Diplomacy order assignment (Hold, Move, Support, Broadcast),
 * territory control, tension heatmaps, support connection lines, and simultaneous order execution.
 */

import React, { useState } from 'react';
import {
  HighfieldsSector,
  SubcultureFaction,
  SectorOrder,
  DiplomacyOrderType,
  DiplomacyTreaty
} from '../types/diplomacy';
import { FirmMemberSprite } from './FirmMemberSprite';
import { sound } from '../services/sound';
import {
  Shield,
  Radio,
  ArrowRight,
  Flame,
  Volume2,
  AlertTriangle,
  Siren,
  Play,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';

interface DiplomacyMapViewProps {
  sectors: HighfieldsSector[];
  factions: SubcultureFaction[];
  playerFactionId: string;
  currentYear: number;
  currentSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  orders: Record<string, SectorOrder>;
  treaties: DiplomacyTreaty[];
  onSetOrder: (sectorId: string, order: SectorOrder) => void;
  onExecuteOrders: () => void;
  onLaunchClash: (sectorId: string, rivalFactionId: string) => void;
}

export const DiplomacyMapView: React.FC<DiplomacyMapViewProps> = ({
  sectors,
  factions,
  playerFactionId,
  currentYear,
  currentSeason,
  orders,
  treaties,
  onSetOrder,
  onExecuteOrders,
  onLaunchClash
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(
    sectors.find(s => s.controlledByFactionId === playerFactionId)?.id || sectors[0].id
  );

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const playerFaction = factions.find(f => f.id === playerFactionId) || factions[0];
  const sectorOwnerFaction = factions.find(f => f.id === selectedSector.controlledByFactionId);
  const isPlayerSector = selectedSector.controlledByFactionId === playerFactionId;

  // Active order for selected sector
  const currentOrder = orders[selectedSectorId];

  // Adjacency for moves
  const adjacentSectors = sectors.filter(s => selectedSector.adjacentSectorIds.includes(s.id));

  // Count player orders assigned
  const playerControlledSectors = sectors.filter(s => s.controlledByFactionId === playerFactionId);
  const assignedOrdersCount = playerControlledSectors.filter(s => !!orders[s.id]).length;

  // Police tension average
  const avgPoliceHeat = Math.round(
    sectors.reduce((sum, s) => sum + s.policeHeat, 0) / sectors.length
  );

  const activeTreaties = treaties.filter(
    t => t.status === 'active' && (t.factionAId === playerFactionId || t.factionBId === playerFactionId)
  );

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Top War Cabinet Header */}
      <div className="bg-[#0b121b] border border-[#203247] p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-lg shadow shrink-0"
            style={{ backgroundColor: playerFaction.primaryColor, color: playerFaction.secondaryColor }}
          >
            {playerFaction.avatarIcon}
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>LEICESTER HIGHFIELDS DIPLOMACY</span>
              <span>·</span>
              <span className="text-white bg-[#192636] px-2 py-0.5 rounded border border-[#2c3f56]">
                {currentSeason.toUpperCase()} {currentYear}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white font-sans mt-0.5">
              {playerFaction.name} <span className="text-xs font-mono font-normal text-slate-400">({playerFaction.leaderTitle}: {playerFaction.leaderName})</span>
            </h2>
          </div>
        </div>

        {/* Global Tension & Order Status */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {/* Police Tension */}
          <div className="bg-[#121c29] px-3 py-1.5 rounded border border-[#22354a] flex items-center gap-2">
            <Siren className={`w-4 h-4 ${avgPoliceHeat > 65 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Police Heat</div>
              <div className={`font-bold ${avgPoliceHeat > 65 ? 'text-rose-400' : 'text-amber-400'}`}>
                {avgPoliceHeat}% Riot Risk
              </div>
            </div>
          </div>

          {/* Orders Assigned Gauge */}
          <div className="bg-[#121c29] px-3 py-1.5 rounded border border-[#22354a] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Diplomacy Orders</div>
              <div className="font-bold text-emerald-400">
                {assignedOrdersCount} / {playerControlledSectors.length} Ready
              </div>
            </div>
          </div>

          {/* Execute Turn Button */}
          <button
            type="button"
            onClick={() => {
              sound.playWhistle();
              onExecuteOrders();
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Execute Season Orders &gt;&gt;</span>
          </button>
        </div>
      </div>

      {/* Main Map + Order Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Highfields Street Map */}
        <div className="lg:col-span-8 bg-[#080d14] border-2 border-[#1e2f44] rounded-lg p-3 shadow-xl relative overflow-hidden">
          {/* Map Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2b3d] text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <span>HIGHFIELDS SECTOR TACTICAL GRID</span>
              <span className="text-[10px] text-slate-500">(10 Street Zones)</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> You
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Subcultures
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" /> Police SPG
              </span>
            </div>
          </div>

          {/* Interactive SVG Street Map Canvas */}
          <div className="relative w-full h-[460px] bg-gradient-to-b from-[#0c141e] via-[#091018] to-[#070b12] rounded border border-[#1b2b3d] overflow-hidden">
            {/* Street Grid Lines (London Rd, Melbourne Rd, Sparkenhoe St) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162334" strokeWidth="0.6" strokeDasharray="3,3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streetGrid)" />

              {/* Major Roads / Thoroughfares */}
              <line x1="28%" y1="10%" x2="28%" y2="90%" stroke="#1f334a" strokeWidth="6" opacity="0.6" />
              <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="#1f334a" strokeWidth="7" opacity="0.6" />
              <line x1="30%" y1="35%" x2="80%" y2="80%" stroke="#1a2b3e" strokeWidth="4" opacity="0.5" />

              {/* Sector Connections (Diplomacy Adjacency Lines) */}
              {sectors.map(sec =>
                sec.adjacentSectorIds.map(adjId => {
                  const target = sectors.find(s => s.id === adjId);
                  if (!target || target.id < sec.id) return null; // Avoid duplicate lines
                  return (
                    <line
                      key={`${sec.id}_${target.id}`}
                      x1={`${sec.x}%`}
                      y1={`${sec.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke="#273d57"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      opacity="0.7"
                    />
                  );
                })
              )}

              {/* Order Arrows (Move / Support visualizations!) */}
              {Object.entries(orders).map(([secId, ord]) => {
                const source = sectors.find(s => s.id === secId);
                if (!source) return null;

                if (ord.orderType === 'MOVE' && ord.targetSectorId) {
                  const target = sectors.find(s => s.id === ord.targetSectorId);
                  if (!target) return null;
                  return (
                    <g key={`order_${secId}`}>
                      <line
                        x1={`${source.x}%`}
                        y1={`${source.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="6,4"
                      />
                      <circle cx={`${target.x}%`} cy={`${target.y}%`} r="5" fill="#f59e0b" />
                    </g>
                  );
                }

                if (ord.orderType === 'SUPPORT' && ord.supportedSectorId) {
                  const target = sectors.find(s => s.id === ord.supportedSectorId);
                  if (!target) return null;
                  return (
                    <g key={`support_${secId}`}>
                      <line
                        x1={`${source.x}%`}
                        y1={`${source.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="2,3"
                      />
                      <polygon
                        points={`${target.x},${target.y - 4} ${target.x + 4},${target.y + 4} ${target.x - 4},${target.y + 4}`}
                        fill="#38bdf8"
                      />
                    </g>
                  );
                }

                return null;
              })}
            </svg>

            {/* Sector Territory Nodes */}
            {sectors.map(sec => {
              const isSelected = sec.id === selectedSectorId;
              const isPlayer = sec.controlledByFactionId === playerFactionId;
              const isPolice = sec.controlledByFactionId === 'police';
              const owner = factions.find(f => f.id === sec.controlledByFactionId);
              const secOrder = orders[sec.id];

              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSectorId(sec.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group flex flex-col items-center ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                  }`}
                  style={{ left: `${sec.x}%`, top: `${sec.y}%` }}
                >
                  {/* Sector Node Shield / Circle */}
                  <div
                    className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-lg transition-all border-2 ${
                      isSelected
                        ? 'ring-4 ring-amber-400/80 border-amber-300 shadow-amber-500/30'
                        : isPlayer
                        ? 'border-emerald-400 bg-[#0f2316]'
                        : isPolice
                        ? 'border-rose-600 bg-rose-950/80'
                        : 'border-[#304863] bg-[#0d1825]'
                    }`}
                    style={
                      owner && !isPlayer && !isPolice
                        ? { borderColor: owner.primaryColor, backgroundColor: `${owner.primaryColor}25` }
                        : {}
                    }
                  >
                    {/* Subculture Icon / Sprite */}
                    <span className="text-sm">
                      {isPolice ? '🚔' : owner ? owner.avatarIcon : '🏚️'}
                    </span>

                    {/* Barricade / Defense Level Badges */}
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(3, sec.barricadeLevel) }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1 bg-amber-400 rounded-xs inline-block" />
                      ))}
                    </div>

                    {/* High Police Heat Pulse Warning */}
                    {sec.policeHeat > 60 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping" />
                    )}
                  </div>

                  {/* Sector Name & Order Label */}
                  <div className="mt-1 px-1.5 py-0.5 rounded bg-black/85 border border-white/20 text-[9px] font-bold text-white whitespace-nowrap shadow flex items-center gap-1">
                    <span>{sec.shortName}</span>
                    {secOrder && (
                      <span className="text-amber-400 text-[8px] font-mono font-black">
                        [{secOrder.orderType}]
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Treaties Ticker */}
          <div className="mt-2 p-2 bg-[#0d141e] rounded border border-[#1e2f42] flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE SOLIDARITY PACTS:</span>
            </div>
            {activeTreaties.length === 0 ? (
              <span className="text-[10px] text-slate-500 italic">
                No diplomatic pacts active. Visit the Diplomacy Desk to propose Anti-Police or Non-Aggression treaties.
              </span>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {activeTreaties.map(t => {
                  const partnerId = t.factionAId === playerFactionId ? t.factionBId : t.factionAId;
                  const partner = factions.find(f => f.id === partnerId);
                  return (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 rounded bg-[#162334] border border-[#2b425d] text-[10px] text-sky-300 font-bold"
                    >
                      🤝 {partner?.name}: {t.type.replace(/_/g, ' ').toUpperCase()} ({t.turnsRemaining} Seasons)
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sector Dossier & Diplomacy Order Dispatcher */}
        <div className="lg:col-span-4 bg-[#0a0f17] border border-[#1e2f44] rounded-lg p-4 space-y-4 shadow-xl">
          {/* Selected Sector Header */}
          <div className="border-b border-[#1b2b3d] pb-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
              <span>Sector Dossier</span>
              <span
                className={`px-2 py-0.5 rounded font-black ${
                  isPlayerSector
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-[#152232] text-slate-300 border border-[#24374c]'
                }`}
              >
                {isPlayerSector ? 'YOU CONTROL' : sectorOwnerFaction ? sectorOwnerFaction.name : 'NEUTRAL'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-sans mt-1">
              {selectedSector.name}
            </h3>
            <div className="text-xs text-amber-400 mt-0.5 font-sans">
              Landmark: {selectedSector.landmark}
            </div>
            <p className="text-[11px] text-[#8fa6be] leading-relaxed mt-1">
              {selectedSector.historicalContext}
            </p>
          </div>

          {/* Sector Stats & Sound System Power */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#0e1622] p-2.5 rounded border border-[#1e2f42]">
            <div>
              <span className="text-[10px] text-slate-400">Sound System</span>
              <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{selectedSector.soundSystemPower} dB Bass</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Barricades</span>
              <div className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Level {selectedSector.barricadeLevel} / 5</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Police Heat</span>
              <div className="font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>{selectedSector.policeHeat}% Heat</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Weekly Community Take</span>
              <div className="font-bold text-sky-400 mt-0.5">
                £{selectedSector.revenueWeekly}
              </div>
            </div>
          </div>

          {/* DIPLOMACY ORDER DISPATCH BOX (Only available on sectors controlled by player) */}
          {isPlayerSector ? (
            <div className="space-y-3 pt-2 border-t border-[#1b2b3d]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase flex items-center gap-1">
                  <span>Issue Diplomacy Order</span>
                </span>
                {currentOrder && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Order: {currentOrder.orderType}
                  </span>
                )}
              </div>

              {/* Order Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* HOLD */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSetOrder(selectedSector.id, {
                      sectorId: selectedSector.id,
                      factionId: playerFactionId,
                      orderType: 'HOLD'
                    });
                  }}
                  className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                    currentOrder?.orderType === 'HOLD'
                      ? 'bg-[#1e3a5f] border-amber-400 text-white shadow ring-1 ring-amber-400'
                      : 'bg-[#121c29] border-[#22354a] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>HOLD / DEFEND</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Fortify barricades against police raids and rivals.
                  </div>
                </button>

                {/* BROADCAST */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSetOrder(selectedSector.id, {
                      sectorId: selectedSector.id,
                      factionId: playerFactionId,
                      orderType: 'BROADCAST'
                    });
                  }}
                  className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                    currentOrder?.orderType === 'BROADCAST'
                      ? 'bg-[#1e3a5f] border-amber-400 text-white shadow ring-1 ring-amber-400'
                      : 'bg-[#121c29] border-[#22354a] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                    <span>PIRATE BROADCAST</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Pump bass and radio signals to reduce police heat (-15%).
                  </div>
                </button>
              </div>

              {/* MOVE / MARCH ORDER */}
              <div className="space-y-1.5 bg-[#0e1622] p-2.5 rounded border border-[#1e2f42]">
                <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>MOVE / MARCH TO ADJACENT SECTOR:</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {adjacentSectors.map(adj => {
                    const isTarget = currentOrder?.orderType === 'MOVE' && currentOrder?.targetSectorId === adj.id;
                    return (
                      <button
                        key={adj.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onSetOrder(selectedSector.id, {
                            sectorId: selectedSector.id,
                            factionId: playerFactionId,
                            orderType: 'MOVE',
                            targetSectorId: adj.id
                          });
                        }}
                        className={`px-2.5 py-1.5 rounded text-left text-xs transition-all flex items-center justify-between border cursor-pointer ${
                          isTarget
                            ? 'bg-amber-400 text-black font-bold border-amber-500 shadow'
                            : 'bg-[#162334] text-slate-300 hover:text-white border-[#243a52]'
                        }`}
                      >
                        <span>March to {adj.shortName}</span>
                        <span className="text-[10px] opacity-75">
                          {adj.controlledByFactionId === playerFactionId
                            ? '(Yours)'
                            : adj.controlledByFactionId === 'police'
                            ? '(Police HQ)'
                            : '(Occupied)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUPPORT ORDER (Classic Diplomacy mechanic!) */}
              <div className="space-y-1.5 bg-[#0e1622] p-2.5 rounded border border-[#1e2f42]">
                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>SUPPORT ALLIED SECTOR (Diplomacy):</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  Provide defensive or offensive support to an adjacent ally so their crew wins against police or rivals!
                </div>
                <div className="grid grid-cols-1 gap-1.5 mt-1">
                  {adjacentSectors.map(adj => {
                    const isSupportTarget = currentOrder?.orderType === 'SUPPORT' && currentOrder?.supportedSectorId === adj.id;
                    const adjOwner = factions.find(f => f.id === adj.controlledByFactionId);
                    return (
                      <button
                        key={adj.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onSetOrder(selectedSector.id, {
                            sectorId: selectedSector.id,
                            factionId: playerFactionId,
                            orderType: 'SUPPORT',
                            supportedSectorId: adj.id,
                            supportedFactionId: adj.controlledByFactionId
                          });
                        }}
                        className={`px-2.5 py-1.5 rounded text-left text-xs transition-all flex items-center justify-between border cursor-pointer ${
                          isSupportTarget
                            ? 'bg-sky-500 text-black font-bold border-sky-400 shadow'
                            : 'bg-[#162334] text-slate-300 hover:text-white border-[#243a52]'
                        }`}
                      >
                        <span>Support {adj.shortName}</span>
                        <span className="text-[10px] opacity-75">
                          {adjOwner ? adjOwner.name.split(' ')[0] : 'Neutral'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Foreign Sector Options: Challenge or Stage Street Clash */
            <div className="space-y-3 pt-2 border-t border-[#1b2b3d]">
              <div className="text-xs text-slate-300">
                Controlled by:{' '}
                <strong className="text-white">
                  {sectorOwnerFaction ? sectorOwnerFaction.name : 'Neutral / Unclaimed'}
                </strong>
              </div>

              {selectedSector.controlledByFactionId === 'police' ? (
                <div className="p-3 bg-rose-950/40 border border-rose-700/80 rounded space-y-2">
                  <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                    <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Special Patrol Group Garrison</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Heavy riot presence, detention vans, and roadblock units. Marching into Charles Street requires overwhelming subculture support!
                  </p>
                  <button
                    type="button"
                    onClick={() => onLaunchClash(selectedSector.id, 'police')}
                    className="w-full py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Stage Anti-Police Barricade Riot &gt;&gt;</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">
                    To claim this sector peacefully, negotiate an alliance at the Diplomacy Desk. To take it by force, stage a turf skirmish or sound clash!
                  </p>
                  {sectorOwnerFaction && (
                    <button
                      type="button"
                      onClick={() => onLaunchClash(selectedSector.id, sectorOwnerFaction.id)}
                      className="w-full py-2 bg-[#1a2b3e] hover:bg-[#253d58] border border-[#2d4b6e] text-amber-300 font-bold text-xs uppercase tracking-wider rounded transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Stage Street Skirmish vs {sectorOwnerFaction.name} &gt;&gt;</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
