import React, { useState } from 'react';
import { Firm, Fixture } from '../types/game';
import { Trophy, Calendar } from 'lucide-react';
import { sound } from '../services/sound';

interface LeagueViewProps {
  firms: Firm[];
  fixtures: Fixture[];
  playerFirmId: string;
}

export const LeagueView: React.FC<LeagueViewProps> = ({
  firms,
  fixtures,
  playerFirmId
}) => {
  const [selectedFirmId, setSelectedFirmId] = useState<string>(playerFirmId);
  const [activeTab, setActiveTab] = useState<'table' | 'fixtures'>('table');

  const sortedFirms = [...firms].sort((a, b) => b.respect - a.respect);
  const selectedFirm = firms.find(f => f.id === selectedFirmId) || firms[0];

  return (
    <div className="space-y-4 font-mono">
      {/* FM 2010 Competition Header */}
      <div className="bg-[#0d1520] p-3 rounded-t-lg border-b border-[#25394f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#7188a1]">
            Competitions &gt; The Casuals Division &gt; Standings
          </div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white font-sans flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Casuals Division 1 Table</span>
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#121c29] p-1 rounded border border-[#233549] text-xs">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded transition-all font-medium ${
              activeTab === 'table'
                ? 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white font-bold border border-[#60a5fa] shadow'
                : 'text-[#8fa6be] hover:text-white hover:bg-[#1a293b]'
            }`}
          >
            League Table
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`px-3 py-1 rounded transition-all font-medium ${
              activeTab === 'fixtures'
                ? 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white font-bold border border-[#60a5fa] shadow'
                : 'text-[#8fa6be] hover:text-white hover:bg-[#1a293b]'
            }`}
          >
            Season Fixtures
          </button>
        </div>
      </div>

      {activeTab === 'table' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main FM 2010 League Table */}
          <div className="lg:col-span-8 fm-panel rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="fm-table-th">
                    <th className="py-2.5 px-3 w-8 text-center">Pos</th>
                    <th className="py-2.5 px-3">Club &amp; Firm</th>
                    <th className="py-2.5 px-2 text-center">Reg</th>
                    <th className="py-2.5 px-2 text-center">Loyalty</th>
                    <th className="py-2.5 px-2 text-center">Hubs</th>
                    <th className="py-2.5 px-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f3044]/60">
                  {sortedFirms.map((firm, index) => {
                    const isPlayer = firm.id === playerFirmId;
                    const isSelected = firm.id === selectedFirmId;

                    return (
                      <tr
                        key={firm.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedFirmId(firm.id);
                        }}
                        className={`cursor-pointer transition-colors fm-table-row ${
                          isSelected ? 'bg-[#294261]! text-white ring-1 ring-[#60a5fa]' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-bold">
                          <span
                            className={`inline-block w-5 h-5 rounded leading-5 text-center text-xs ${
                              index === 0
                                ? 'bg-amber-400 text-black font-black'
                                : index < 3
                                ? 'bg-[#1e344d] text-sky-300 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 font-sans">
                              {firm.name}
                            </span>
                            {isPlayer && (
                              <span className="text-[9px] bg-amber-400 text-black font-black px-1 py-0.2 rounded uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8fa6be]">
                            {firm.footballClub} · {firm.city}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-400">
                          {firm.region}
                        </td>
                        <td className="py-2.5 px-2 text-center text-emerald-400 font-bold tabular-nums">
                          {firm.loyaltyIndex}%
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-300 font-bold tabular-nums">
                          {firm.territoryPoints}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-sm font-black text-amber-400 tabular-nums">
                            {firm.respect}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Selected Firm Dossier Card */}
          {selectedFirm && (
            <div className="lg:col-span-4 fm-panel rounded-lg overflow-hidden sticky top-20 text-xs">
              <div className="fm-panel-header px-4 py-2 flex items-center justify-between">
                <span>Club Intelligence Dossier</span>
                <span className="text-[10px] text-amber-400">{selectedFirm.leagueTier.split(' ')[0]}</span>
              </div>

              <div className="p-4 space-y-3 bg-[#0c141e]">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {selectedFirm.name}
                  </h3>
                  <div className="text-xs text-amber-400 mt-0.5">
                    Supporting {selectedFirm.footballClub} ({selectedFirm.region})
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] pt-2 border-t border-[#1f3044]">
                  <div className="flex justify-between">
                    <span className="text-[#8fa6be]">Stronghold Pub:</span>
                    <strong className="text-slate-200">{selectedFirm.pubStronghold}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa6be]">Home Stadium:</span>
                    <strong className="text-slate-200">{selectedFirm.stadium}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa6be]">Street Respect:</span>
                    <strong className="text-amber-400 tabular-nums">{selectedFirm.respect} pts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa6be]">Estimated Strength:</span>
                    <strong className="text-slate-200 tabular-nums">{selectedFirm.memberCount} lads</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0e1724] rounded border border-[#1f3044] space-y-1 text-[11px]">
                  <div className="font-bold text-slate-200">Terrace Fighting Style:</div>
                  <p className="text-[#8fa6be] leading-relaxed">
                    {selectedFirm.tacticsProfile.firmStyle}
                  </p>
                  <div className="pt-1.5 text-[10px] text-[#64748b] flex justify-between border-t border-[#1a2838]">
                    <span>Line: <strong className="text-slate-300 uppercase">{selectedFirm.tacticsProfile.favoredFormation.replace('_', ' ')}</strong></span>
                    <span>Hardness: <strong className="text-slate-300">{selectedFirm.tacticsProfile.baseHardness}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Fixtures Calendar */
        <div className="fm-panel rounded-lg overflow-hidden text-xs">
          <div className="fm-panel-header px-4 py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Season Fixtures Schedule</span>
          </div>

          <div className="p-3 divide-y divide-[#1f3044]/60 bg-[#0c141e]">
            {fixtures.map(fix => {
              const home = firms.find(f => f.id === fix.homeFirmId);
              const away = firms.find(f => f.id === fix.awayFirmId);
              const isPlayerMatch = fix.homeFirmId === playerFirmId || fix.awayFirmId === playerFirmId;

              return (
                <div
                  key={fix.id}
                  className={`py-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isPlayerMatch ? 'bg-[#1a293b]/50 border-l-2 border-amber-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-14 text-[10px] font-bold text-[#64748b] uppercase">
                      Rnd {fix.round}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">
                        {home?.name} <span className="text-slate-500 font-normal">v</span> {away?.name}
                      </div>
                      <div className="text-[10px] text-[#8fa6be]">
                        {fix.venueName} ({fix.location})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {fix.clashPlayed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Concluded
                      </span>
                    ) : (
                      <span className="text-[#64748b] text-[10px]">Upcoming</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
