import React from 'react';
import { Volume2, VolumeX, ShieldAlert, ChevronRight, ChevronLeft, Calendar, Shield } from 'lucide-react';

export type ActiveTab = 'office' | 'squad' | 'tactics' | 'away_days' | 'league' | 'pub_hq' | 'city';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  treasury: number;
  respect: number;
  policeHeat: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartClash: () => void;
  canClash: boolean;
  clubName?: string;
  onOpenClubModal?: () => void;
  currentRound?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  treasury,
  respect,
  policeHeat,
  isMuted,
  onToggleMute,
  onStartClash,
  canClash,
  clubName = 'Northwood United',
  onOpenClubModal,
  currentRound = 1
}) => {
  return (
    <header className="border-b border-[#2d425b] bg-[#0c131c] text-[#d6e2ed] sticky top-0 z-40 select-none shadow-md">
      {/* Top FM 2010 Title Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-3 sm:px-6 h-13 bg-gradient-to-b from-[#1c2c3e] to-[#121c28] border-b border-[#2b3e54]">
        {/* Left: FM Browser Navigation & Active Club Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <button className="w-6 h-6 rounded bg-[#101924] border border-[#26374a] flex items-center justify-center hover:text-white hover:bg-[#1a2738] transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-[#101924] border border-[#26374a] flex items-center justify-center hover:text-white hover:bg-[#1a2738] transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-[#26374a]" />

          {/* Club Info */}
          <div
            onClick={onOpenClubModal}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to Switch SFS Club"
          >
            <div className="w-7 h-7 rounded bg-[#1e3a5f] border border-[#3b82f6]/40 flex items-center justify-center text-amber-400 font-bold text-xs shadow-inner">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight drop-shadow-sm font-sans">
                  {clubName}
                </span>
                <span className="text-[10px] bg-[#1a293b] text-amber-400 border border-[#2d435f] px-1.5 py-0.2 rounded font-mono font-semibold">
                  Round {currentRound}
                </span>
              </div>
              <div className="text-[11px] text-[#8da3ba] font-mono leading-none">
                Firm U lator 2010 · SFS Hooligan Sim
              </div>
            </div>
          </div>
        </div>

        {/* Center: Current In-Game Calendar Stamp */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#8da3ba] bg-[#0c141e] px-3 py-1 rounded border border-[#1e2f42]">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Saturday 14:45 · Matchday</span>
        </div>

        {/* Right: Sound toggle and iconic FM 2010 "CONTINUE >>" Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-[#131d2a] border border-[#243548] text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Iconic FM 2010 Continue / Matchday Action Button */}
          <button
            onClick={onStartClash}
            disabled={!canClash}
            className={`px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide rounded transition-all flex items-center gap-1.5 whitespace-nowrap shadow ${
              canClash
                ? 'fm-continue-btn cursor-pointer animate-pulse'
                : 'bg-[#1b2633] text-slate-500 border border-[#293849] cursor-not-allowed'
            }`}
          >
            <span>{canClash ? 'Continue >>' : 'Match Concluded'}</span>
          </button>
        </div>
      </div>

      {/* FM 2010 Navigation Tab Strip */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 bg-gradient-to-b from-[#141e2b] to-[#0c131c] border-b border-[#233549]">
        <nav className="flex items-center gap-0.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'office', label: 'Overview' },
            { id: 'squad', label: 'The Lads' },
            { id: 'tactics', label: 'Tactics' },
            { id: 'away_days', label: 'Away Travel' },
            { id: 'city', label: 'The City' },
            { id: 'pub_hq', label: 'The Stronghold' },
            { id: 'league', label: 'Casuals League' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-3.5 py-2.5 transition-all whitespace-nowrap border-b-2 text-xs ${
                  isActive
                    ? 'bg-gradient-to-b from-[#25394f] to-[#172535] text-white border-amber-400 font-bold shadow-inner'
                    : 'text-[#8fa6be] hover:text-white hover:bg-[#182535] border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sub-bar Indicators: Treasury, Respect, Police Heat */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#8fa6be] py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748b]">Bank:</span>
            <span className="font-bold text-emerald-400 tabular-nums">£{treasury.toLocaleString()}</span>
          </div>
          <span className="text-[#2b3e54]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748b]">Respect:</span>
            <span className="font-bold text-amber-400 tabular-nums">{respect} pts</span>
          </div>
          <span className="text-[#2b3e54]">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[#64748b]">Police Heat:</span>
            <span
              className={`font-bold tabular-nums ${
                policeHeat > 70 ? 'text-rose-400' : policeHeat > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {policeHeat}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
