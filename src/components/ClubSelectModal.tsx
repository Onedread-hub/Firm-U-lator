import React, { useState } from 'react';
import { Firm, SfsRegion } from '../types/game';
import { sound } from '../services/sound';
import { Shield, MapPin, X, Trophy } from 'lucide-react';

interface ClubSelectModalProps {
  firms: Firm[];
  currentFirmId: string;
  onSelectFirm: (firmId: string) => void;
  onClose: () => void;
}

export const ClubSelectModal: React.FC<ClubSelectModalProps> = ({
  firms,
  currentFirmId,
  onSelectFirm,
  onClose
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'Big Time League (Tier 1)' | 'Up and Comers (Tier 2)'>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | SfsRegion>('all');

  const filteredFirms = firms.filter(f => {
    if (tierFilter !== 'all' && f.leagueTier !== tierFilter) return false;
    if (regionFilter !== 'all' && f.region !== regionFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-zinc-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                Select Your SFS Football Club & Firm
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Choose from all 26 authentic clubs across the Big Time League and Up and Comers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tier filter */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 mr-1">Division:</span>
            {[
              { id: 'all', label: 'All 26 Clubs' },
              { id: 'Big Time League (Tier 1)', label: 'Big Time League (14)' },
              { id: 'Up and Comers (Tier 2)', label: 'Up and Comers (12)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTierFilter(tab.id as typeof tierFilter)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  tierFilter === tab.id
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Region filter */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 mr-1">Region:</span>
            {['all', 'Northern', 'Midlands', 'Coastal', 'Southern'].map(r => (
              <button
                key={r}
                onClick={() => setRegionFilter(r as typeof regionFilter)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  regionFilter === r
                    ? 'bg-zinc-200 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Club Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFirms.map(firm => {
            const isSelected = firm.id === currentFirmId;

            return (
              <div
                key={firm.id}
                onClick={() => {
                  sound.playCheer();
                  onSelectFirm(firm.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50 shadow-lg'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: firm.primaryColor, color: firm.secondaryColor }}
                    >
                      {firm.shortName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-100">
                          {firm.footballClub}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-400 font-semibold mt-0.5">
                        {firm.name}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded shrink-0">
                    {firm.region}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Stronghold:</span>
                    <strong className="text-zinc-200">{firm.pubStronghold}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Stadium:</span>
                    <strong className="text-zinc-300">{firm.stadium}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[10px] pt-0.5">
                    <span>League: {firm.leagueTier.split(' ')[0]}</span>
                    <span>Rep: {firm.respect} pts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
