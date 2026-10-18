import React, { useState } from 'react';
import { Lad, LadRole, LadStatus } from '../types/game';
import { Shield, Dumbbell, Zap, HeartPulse, Scale, Award, Sparkles, Activity, FileText } from 'lucide-react';
import { sound } from '../services/sound';

interface SquadViewProps {
  lads: Lad[];
  treasury: number;
  onUpdateLad: (lad: Lad) => void;
  onDeductTreasury: (amount: number, reason: string) => boolean;
}

export const SquadView: React.FC<SquadViewProps> = ({
  lads,
  treasury,
  onUpdateLad,
  onDeductTreasury
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedLadId, setSelectedLadId] = useState<string>(lads[0]?.id || '');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const selectedLad = lads.find(l => l.id === selectedLadId) || lads[0];

  const filteredLads = lads.filter(lad => {
    if (roleFilter === 'all') return true;
    return lad.role === roleFilter;
  });

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const getStatClass = (val: number) => {
    if (val >= 85) return 'fm-stat-elite font-bold';
    if (val >= 70) return 'fm-stat-good font-semibold';
    if (val >= 55) return 'fm-stat-avg font-medium';
    return 'fm-stat-low';
  };

  const handleTrainBoxing = (lad: Lad) => {
    if (lad.status !== 'active') {
      showToast(`${lad.name} cannot train while ${lad.status}!`);
      return;
    }
    sound.playHit();
    const updated = {
      ...lad,
      hardness: Math.min(99, lad.hardness + 2),
      stamina: Math.max(10, lad.stamina - 3)
    };
    onUpdateLad(updated);
    showToast(`${lad.name} sparred on heavy bags. Hardness +2, Stamina -3.`);
  };

  const handleTrainCardio = (lad: Lad) => {
    if (lad.status !== 'active') {
      showToast(`${lad.name} cannot train while ${lad.status}!`);
      return;
    }
    sound.playClick();
    const updated = {
      ...lad,
      pace: Math.min(99, lad.pace + 2),
      stamina: Math.min(99, lad.stamina + 3)
    };
    onUpdateLad(updated);
    showToast(`${lad.name} completed hill sprints. Pace +2, Stamina +3.`);
  };

  const handlePubBonding = (lad: Lad) => {
    const cost = 40;
    if (treasury < cost) {
      showToast(`Not enough funds (£${cost} needed for rounds).`);
      return;
    }
    if (!onDeductTreasury(cost, `Pub lock-in bonding for ${lad.name}`)) return;
    sound.playCheer();
    const updated = {
      ...lad,
      bottle: Math.min(99, lad.bottle + 3),
      loyalty: Math.min(99, lad.loyalty + 4)
    };
    onUpdateLad(updated);
    showToast(`${lad.name} bonded with the firm over pints. Bottle +3, Loyalty +4.`);
  };

  const handlePrivatePhysio = (lad: Lad) => {
    const cost = 90;
    if (lad.health >= lad.maxHealth && lad.status === 'active') {
      showToast(`${lad.name} is already in prime physical condition!`);
      return;
    }
    if (treasury < cost) {
      showToast(`Not enough funds (£${cost} needed for private physio).`);
      return;
    }
    if (!onDeductTreasury(cost, `Private clinic treatment for ${lad.name}`)) return;
    sound.playClick();
    const updated: Lad = {
      ...lad,
      health: lad.maxHealth,
      status: 'active'
    };
    onUpdateLad(updated);
    showToast(`${lad.name} was treated by private physio (no NHS police reports). 100% Fit!`);
  };

  const handleRetainSolicitor = (lad: Lad) => {
    const cost = 180;
    if (lad.legalHeat === 0 && lad.status !== 'bailed' && lad.status !== 'banned') {
      showToast(`${lad.name} has no police heat to clear!`);
      return;
    }
    if (treasury < cost) {
      showToast(`Not enough funds (£${cost} needed for legal defense).`);
      return;
    }
    if (!onDeductTreasury(cost, `Retained solicitor for ${lad.name}`)) return;
    sound.playClick();
    const updated: Lad = {
      ...lad,
      legalHeat: Math.max(0, lad.legalHeat - 40),
      status: 'active'
    };
    onUpdateLad(updated);
    showToast(`Solicitor argued technical bail violation. ${lad.name}'s restrictions dropped!`);
  };

  const handlePromoteTopBoy = (lad: Lad) => {
    if (lad.role === 'top_boy') return;
    sound.playCheer();
    const updated: Lad = {
      ...lad,
      role: 'top_boy',
      bottle: Math.min(99, lad.bottle + 5),
      loyalty: 100
    };
    onUpdateLad(updated);
    showToast(`${lad.name} was promoted to Top Boy leadership! Bottle +5, Loyalty 100%.`);
  };

  return (
    <div className="space-y-4">
      {/* FM 2010 Breadcrumb & View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#25394f] pb-3 bg-[#0d1520] p-3 rounded-t-lg">
        <div>
          <div className="text-[11px] text-[#7188a1] font-mono">
            Northwood United &gt; Senior Roster &gt; Player Attributes
          </div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white font-sans flex items-center gap-2">
            <span>First Team Squad</span>
            <span className="text-xs text-amber-400 font-mono font-normal">({lads.length} Lads)</span>
          </h2>
        </div>

        {/* FM 2010 Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#121c29] p-1 rounded border border-[#233549] overflow-x-auto">
          {[
            { id: 'all', label: 'All Lads' },
            { id: 'top_boy', label: 'Top Boys' },
            { id: 'face', label: 'Faces' },
            { id: 'minder', label: 'Minders' },
            { id: 'runner', label: 'Runners' },
            { id: 'nutter', label: 'Nutters' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-2.5 py-1 text-xs rounded transition-all whitespace-nowrap font-medium ${
                roleFilter === tab.id
                  ? 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white shadow-sm font-bold border border-[#60a5fa]'
                  : 'text-[#8fa6be] hover:text-white hover:bg-[#1a293b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-[#1e3a5f] border border-[#3b82f6] rounded text-xs text-blue-100 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Grid: FM 2010 Table on Left & Detailed Player Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: FM 2010 Tabular Player List */}
        <div className="lg:col-span-7 fm-panel rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="fm-table-th">
                  <th className="py-2 px-3 w-8">#</th>
                  <th className="py-2 px-3">Name & Role</th>
                  <th className="py-2 px-2 text-center">Hard</th>
                  <th className="py-2 px-2 text-center">Bot</th>
                  <th className="py-2 px-2 text-center">Pace</th>
                  <th className="py-2 px-2 text-center">Smarts</th>
                  <th className="py-2 px-2 text-center">Cnd</th>
                  <th className="py-2 px-2 text-center">Heat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#203247]/60">
                {filteredLads.map((lad, index) => {
                  const isSelected = lad.id === selectedLad?.id;
                  return (
                    <tr
                      key={lad.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedLadId(lad.id);
                      }}
                      className={`cursor-pointer transition-colors fm-table-row ${
                        isSelected ? 'bg-[#294261]! text-white ring-1 ring-[#60a5fa]' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{lad.name}</span>
                          <span className="text-amber-400 text-[11px] font-normal">"{lad.nickname}"</span>
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {lad.role.replace('_', ' ')} · {lad.status.toUpperCase()}
                        </div>
                      </td>
                      <td className={`py-2.5 px-2 text-center tabular-nums ${getStatClass(lad.hardness)}`}>
                        {lad.hardness}
                      </td>
                      <td className={`py-2.5 px-2 text-center tabular-nums ${getStatClass(lad.bottle)}`}>
                        {lad.bottle}
                      </td>
                      <td className={`py-2.5 px-2 text-center tabular-nums ${getStatClass(lad.pace)}`}>
                        {lad.pace}
                      </td>
                      <td className={`py-2.5 px-2 text-center tabular-nums ${getStatClass(lad.streetSmarts)}`}>
                        {lad.streetSmarts}
                      </td>
                      <td className="py-2.5 px-2 text-center tabular-nums">
                        <span
                          className={`font-bold ${
                            lad.health >= 85 ? 'text-emerald-400' : lad.health >= 50 ? 'text-amber-400' : 'text-rose-400'
                          }`}
                        >
                          {lad.health}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center tabular-nums">
                        <span className={lad.legalHeat > 60 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {lad.legalHeat}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: FM 2010 Detailed Player Card & Attributes Profile */}
        {selectedLad && (
          <div className="lg:col-span-5 fm-panel rounded-lg overflow-hidden sticky top-20 shadow-xl">
            {/* Player Header Banner */}
            <div className="fm-panel-header p-3.5 flex items-start justify-between">
              <div>
                <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                  Player Profile · {selectedLad.role.replace('_', ' ').toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                  {selectedLad.name} <span className="text-amber-400 font-mono font-normal">"{selectedLad.nickname}"</span>
                </h3>
                <div className="text-xs text-[#9bb3cc] font-mono mt-0.5">
                  Status: <strong className={selectedLad.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}>{selectedLad.status.toUpperCase()}</strong> · Fought: {selectedLad.matchesFought} ({selectedLad.victories}W)
                </div>
              </div>

              {selectedLad.role !== 'top_boy' && (
                <button
                  onClick={() => handlePromoteTopBoy(selectedLad)}
                  className="px-2 py-1 text-[10px] font-mono bg-[#1f3247] hover:bg-[#2b4461] text-amber-300 border border-[#3b597d] rounded transition-colors"
                >
                  Make Top Boy
                </button>
              )}
            </div>

            {/* FM 2010 Colored Attributes Grid */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono bg-[#0c141e] p-3 rounded border border-[#1f3044]">
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Hardness</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.hardness)}`}>{selectedLad.hardness}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Bottle</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.bottle)}`}>{selectedLad.bottle}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Pace</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.pace)}`}>{selectedLad.pace}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Street Smarts</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.streetSmarts)}`}>{selectedLad.streetSmarts}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Loyalty</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.loyalty)}`}>{selectedLad.loyalty}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b2b3d]">
                  <span className="text-[#94a3b8]">Stamina</span>
                  <span className={`tabular-nums text-sm ${getStatClass(selectedLad.stamina)}`}>{selectedLad.stamina}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#94a3b8]">Condition</span>
                  <span className="text-emerald-400 font-bold tabular-nums text-sm">{selectedLad.health}%</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#94a3b8]">Police Heat</span>
                  <span className="text-rose-400 font-bold tabular-nums text-sm">{selectedLad.legalHeat}%</span>
                </div>
              </div>

              {/* Trait Card */}
              <div className="p-3 bg-[#0d1622] rounded border border-[#203247] text-xs">
                <div className="font-bold text-amber-400 font-mono text-[11px] uppercase">
                  Trait: {selectedLad.trait.name}
                </div>
                <p className="text-[#94a3b8] text-[11px] leading-relaxed mt-0.5">
                  {selectedLad.trait.description}
                </p>
              </div>

              {/* Action Operations */}
              <div className="space-y-2 pt-2 border-t border-[#203247]">
                <div className="text-[10px] font-mono uppercase text-[#738ba4] font-bold">
                  Management Instructions
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => handleTrainBoxing(selectedLad)}
                    className="p-2 rounded bg-gradient-to-b from-[#1b2a3a] to-[#121c27] hover:from-[#24374c] hover:to-[#172433] border border-[#2d425b] text-left transition-all shadow-sm"
                  >
                    <div className="font-bold text-[#e2e8f0]">Heavy Bag Sparring</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">+2 Hardness, Free</div>
                  </button>

                  <button
                    onClick={() => handleTrainCardio(selectedLad)}
                    className="p-2 rounded bg-gradient-to-b from-[#1b2a3a] to-[#121c27] hover:from-[#24374c] hover:to-[#172433] border border-[#2d425b] text-left transition-all shadow-sm"
                  >
                    <div className="font-bold text-[#e2e8f0]">Hill Sprints</div>
                    <div className="text-[10px] text-sky-400 mt-0.5">+2 Pace, Free</div>
                  </button>

                  <button
                    onClick={() => handlePubBonding(selectedLad)}
                    className="p-2 rounded bg-gradient-to-b from-[#1b2a3a] to-[#121c27] hover:from-[#24374c] hover:to-[#172433] border border-[#2d425b] text-left transition-all shadow-sm"
                  >
                    <div className="font-bold text-[#e2e8f0]">Pub Lock-in</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">+3 Bottle, Cost £40</div>
                  </button>

                  <button
                    onClick={() => handlePrivatePhysio(selectedLad)}
                    className="p-2 rounded bg-gradient-to-b from-[#1b2a3a] to-[#121c27] hover:from-[#24374c] hover:to-[#172433] border border-[#2d425b] text-left transition-all shadow-sm"
                  >
                    <div className="font-bold text-emerald-400">Private Physio</div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">Heal 100%, Cost £90</div>
                  </button>
                </div>

                <button
                  onClick={() => handleRetainSolicitor(selectedLad)}
                  className="w-full p-2 rounded bg-gradient-to-b from-[#1b2a3a] to-[#121c27] hover:from-[#24374c] hover:to-[#172433] border border-[#2d425b] text-left transition-all font-mono text-xs flex items-center justify-between shadow-sm"
                >
                  <div>
                    <div className="font-bold text-amber-300">Retain Terrace Solicitor</div>
                    <div className="text-[10px] text-[#8fa6be]">Clear Bail Restrictions & -40% Heat</div>
                  </div>
                  <span className="font-bold text-amber-400 tabular-nums">£180</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
