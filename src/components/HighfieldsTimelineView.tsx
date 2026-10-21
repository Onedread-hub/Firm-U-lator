/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HighfieldsTimelineView.tsx
 * Historical Chronicle of Leicester Highfields (1980-2010).
 * Traces three decades of grassroots resistance, underground music culture,
 * historic riots, police escalations, and community defense.
 */

import React from 'react';
import { HistoricEvent } from '../types/diplomacy';
import { Calendar, Siren, Flame, Music, Shield, Trophy } from 'lucide-react';

interface HighfieldsTimelineViewProps {
  timeline: HistoricEvent[];
  currentYear: number;
  currentSeason: string;
  onJumpToRiotClash?: (year: number) => void;
}

export const HighfieldsTimelineView: React.FC<HighfieldsTimelineViewProps> = ({
  timeline,
  currentYear,
  currentSeason,
  onJumpToRiotClash
}) => {
  return (
    <div className="space-y-4 font-mono select-none">
      {/* Header */}
      <div className="bg-[#0b121b] border border-[#203247] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>LEICESTER ARCHIVAL RECORD (1980 - 2010)</span>
            <span>·</span>
            <span>HIGHFIELDS HISTORIC CHRONICLES</span>
          </div>
          <h2 className="text-lg font-bold text-white font-sans mt-0.5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Thirty Years of Highfields Street History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Current Era: <strong className="text-amber-300">{currentSeason} {currentYear}</strong>. Key historic flashpoints, community uprisings, and counter-culture landmarks.
          </p>
        </div>

        <div className="bg-[#121c29] px-3.5 py-2 rounded border border-[#22354a] text-xs flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Chronicle Progress</div>
            <div className="font-bold text-white">{currentYear} / 2010</div>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-[#1e3248]">
        {timeline.map((evt, idx) => {
          const isPastOrPresent = evt.year <= currentYear;
          const isCurrent = evt.year === currentYear;

          return (
            <div
              key={`${evt.year}_${evt.season}`}
              className={`relative pl-12 transition-all ${
                isPastOrPresent ? 'opacity-100' : 'opacity-40 grayscale'
              }`}
            >
              {/* Timeline Marker Dot */}
              <div
                className={`absolute left-4 top-4 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] z-10 ${
                  isCurrent
                    ? 'bg-amber-400 border-black text-black font-black ring-4 ring-amber-400/30'
                    : evt.isRiotYear
                    ? 'bg-rose-600 border-white text-white font-bold'
                    : 'bg-[#152232] border-slate-500 text-slate-300'
                }`}
              >
                {evt.isRiotYear ? '💥' : '•'}
              </div>

              {/* Event Card */}
              <div
                className={`p-4 rounded-lg border transition-all shadow-md ${
                  isCurrent
                    ? 'bg-[#121c2a] border-amber-400 ring-1 ring-amber-400'
                    : evt.isRiotYear
                    ? 'bg-gradient-to-r from-[#1f1013] to-[#121922] border-rose-800'
                    : 'bg-[#0d141e] border-[#1e2f42]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2b3d] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {evt.season.toUpperCase()} {evt.year}
                    </span>
                    {evt.isRiotYear && (
                      <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-700 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span>HISTORIC RIOT FLASHPOINT</span>
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] bg-amber-400 text-black font-black px-2 py-0.5 rounded">
                        CURRENT YEAR
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Police Tension Shift: <strong className={evt.policeEscalationDelta > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {evt.policeEscalationDelta > 0 ? `+${evt.policeEscalationDelta}%` : `${evt.policeEscalationDelta}%`}
                    </strong>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <h3 className="text-base font-bold text-white font-sans">
                    {evt.title}
                  </h3>
                  <div className="text-xs text-[#93c5fd] font-serif italic">
                    "{evt.headline}"
                  </div>
                  <p className="text-xs text-[#8fa6be] leading-relaxed pt-1">
                    {evt.description}
                  </p>
                </div>

                {evt.isRiotYear && onJumpToRiotClash && (
                  <div className="mt-3 pt-2 border-t border-[#1e2f42] flex justify-end">
                    <button
                      type="button"
                      onClick={() => onJumpToRiotClash(evt.year)}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Siren className="w-3.5 h-3.5" />
                      <span>Re-live {evt.year} Highfields Street Riot &gt;&gt;</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
