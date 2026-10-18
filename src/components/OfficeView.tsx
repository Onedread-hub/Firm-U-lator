import React from 'react';
import { Firm, Fixture, Lad, TerraceNews } from '../types/game';
import { Shield, Users, MapPin, Swords, Clock, AlertTriangle, Radio, Navigation, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface OfficeViewProps {
  playerFirm: Firm;
  nextFixture: Fixture | undefined;
  rivalFirm: Firm | undefined;
  lads: Lad[];
  news: TerraceNews[];
  loyaltyIndex: number;
  policeHeat: number;
  treasury: number;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenClash: () => void;
  onOpenClubModal?: () => void;
  onTriggerPhoneCall?: () => void;
}

export const OfficeView: React.FC<OfficeViewProps> = ({
  playerFirm,
  nextFixture,
  rivalFirm,
  lads,
  news,
  loyaltyIndex,
  policeHeat,
  setActiveTab,
  onOpenClash,
  onOpenClubModal,
  onTriggerPhoneCall
}) => {
  const activeLadsCount = lads.filter(l => l.status === 'active').length;
  const injuredLadsCount = lads.filter(l => l.status === 'injured' || l.status === 'hospitalised').length;
  const bailedLadsCount = lads.filter(l => l.status === 'bailed' || l.status === 'banned').length;

  return (
    <div className="space-y-4">
      {/* FM 2010 Club Profile & Matchday Header Bar */}
      <div className="fm-panel rounded-lg overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#172638] via-[#121c29] to-[#0c141e]">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center font-black text-xl shadow-md border-2 border-white/20 shrink-0"
              style={{ backgroundColor: playerFirm.primaryColor, color: playerFirm.secondaryColor }}
            >
              {playerFirm.shortName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span className="bg-[#1f3248] text-[#93c5fd] font-bold px-2 py-0.5 rounded border border-[#314c6d] text-[10px]">
                  {playerFirm.region} Region
                </span>
                <span>·</span>
                <span className="text-slate-300 font-semibold">{playerFirm.footballClub}</span>
                <span>·</span>
                <span className="text-slate-400">{playerFirm.leagueTier}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-sans mt-0.5">
                {playerFirm.name}
              </h1>
              <div className="text-xs text-[#9bb3cc] font-mono mt-0.5">
                Stronghold: <strong className="text-amber-300">{playerFirm.pubStronghold}</strong> · Stadium: <strong className="text-slate-200">{playerFirm.stadium}</strong>
              </div>
            </div>
          </div>

          {/* Quick FM Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenClubModal && (
              <button
                onClick={onOpenClubModal}
                className="px-3 py-1.5 text-xs font-mono font-semibold bg-[#1a2a3c] hover:bg-[#253a52] text-slate-200 border border-[#2e4766] rounded transition-all shadow-sm"
              >
                Switch SFS Club (26)
              </button>
            )}
            {onTriggerPhoneCall && (
              <button
                onClick={onTriggerPhoneCall}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-[#854d0e]/40 hover:bg-[#854d0e]/60 text-amber-300 border border-amber-600/60 rounded transition-all shadow-sm flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Wire</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('tactics')}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-[#1a2a3c] hover:bg-[#253a52] text-slate-200 border border-[#2e4766] rounded transition-all shadow-sm"
            >
              Tactics Board
            </button>
            <button
              onClick={() => setActiveTab('away_days')}
              className="px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded transition-all shadow-sm"
            >
              Away Logistics
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Next Fixture Dossier (Left) & Fan Loyalty / Police Threat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Next Matchday Confrontation Card */}
        <div className="lg:col-span-8 fm-panel rounded-lg overflow-hidden flex flex-col">
          <div className="fm-panel-header px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Next Matchday Confrontation</span>
            </div>
            {nextFixture?.isDerby && (
              <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 border border-rose-700 px-2 py-0.5 rounded">
                High Risk Local Derby
              </span>
            )}
          </div>

          <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            {nextFixture && rivalFirm ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0c141e] p-3.5 rounded border border-[#203247] items-center text-xs">
                  {/* Home Firm */}
                  <div className="text-center md:text-left space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">
                      {nextFixture.homeFirmId === playerFirm.id ? 'Your Firm (Home)' : 'Home Ground'}
                    </span>
                    <div className="text-base font-bold text-white font-sans">
                      {nextFixture.homeFirmId === playerFirm.id ? playerFirm.name : rivalFirm.name}
                    </div>
                    <div className="text-[11px] text-[#93c5fd] font-mono">
                      {nextFixture.homeFirmId === playerFirm.id ? playerFirm.footballClub : rivalFirm.footballClub}
                    </div>
                  </div>

                  {/* VS Emblem & Venue */}
                  <div className="text-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-[#1e2f42] space-y-1">
                    <span className="text-xs font-mono font-black text-amber-400 bg-[#162334] px-2.5 py-1 rounded border border-[#2c435f]">
                      VS
                    </span>
                    <div className="text-[11px] font-mono text-slate-300 mt-2 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{nextFixture.venueName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Round {nextFixture.round} · Saturday 15:00
                    </div>
                  </div>

                  {/* Away Firm */}
                  <div className="text-center md:text-right space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">
                      {nextFixture.awayFirmId === playerFirm.id ? 'Your Firm (Away)' : 'Visiting Opponent'}
                    </span>
                    <div className="text-base font-bold text-white font-sans">
                      {nextFixture.awayFirmId === playerFirm.id ? playerFirm.name : rivalFirm.name}
                    </div>
                    <div className="text-[11px] text-[#93c5fd] font-mono">
                      {nextFixture.awayFirmId === playerFirm.id ? playerFirm.footballClub : rivalFirm.footballClub}
                    </div>
                  </div>
                </div>

                {/* Rival Firm Scouting Intelligence */}
                <div className="bg-[#0e1724] p-3 rounded border border-[#1f3044] text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-[#8fa6be]">
                    <span className="font-bold text-white">Scouting Dossier: {rivalFirm.name}</span>
                    <span className="text-amber-400">Street Rep: {rivalFirm.respect} pts</span>
                  </div>
                  <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                    <strong className="text-slate-200">Style:</strong> {rivalFirm.tacticsProfile.firmStyle}
                  </p>
                  <div className="flex flex-wrap gap-3 text-[#64748b] text-[10px] pt-1 border-t border-[#1a2838]">
                    <span>Line: <strong className="text-slate-300 uppercase">{rivalFirm.tacticsProfile.favoredFormation.replace('_', ' ')}</strong></span>
                    <span>Hardness: <strong className="text-slate-300">{rivalFirm.tacticsProfile.baseHardness}</strong></span>
                    <span>Aggression: <strong className="text-slate-300">{rivalFirm.tacticsProfile.aggression}/5</strong></span>
                    <span>Pub: <strong className="text-slate-300">{rivalFirm.pubStronghold}</strong></span>
                  </div>
                </div>

                {/* Match Launch Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1f3044]">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Squad ready: <strong className="text-white">{activeLadsCount} fit</strong> for frontline</span>
                  </div>
                  
                  <button
                    onClick={onOpenClash}
                    className="fm-continue-btn px-5 py-2 text-xs font-extrabold uppercase tracking-wider rounded transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Play Matchday Clash &gt;&gt;</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-500 font-mono text-xs">
                All scheduled season fixtures completed!
              </div>
            )}
          </div>
        </div>

        {/* Fan Loyalty & Police Surveillance Gauges */}
        <div className="lg:col-span-4 fm-panel rounded-lg overflow-hidden flex flex-col justify-between">
          <div className="fm-panel-header px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Terrace Loyalty & Heat</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {loyaltyIndex}% Loyal
            </span>
          </div>

          <div className="p-4 space-y-4 text-xs font-mono">
            {/* Loyalty Bar */}
            <div>
              <div className="flex justify-between text-[#8fa6be] mb-1">
                <span>Fan Loyalty Index</span>
                <span className="font-bold text-white">{loyaltyIndex}/100</span>
              </div>
              <div className="w-full bg-[#0a1018] rounded h-2 overflow-hidden border border-[#1e2f42]">
                <div
                  className="bg-emerald-500 h-2 rounded transition-all duration-300"
                  style={{ width: `${loyaltyIndex}%` }}
                />
              </div>
            </div>

            {/* Loyalty Tiers */}
            <div className="space-y-1.5 pt-2 border-t border-[#1f3044] text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Diehards / Inner Circle</span>
                <span className="text-emerald-400 font-bold">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Away Day Veterans</span>
                <span className="text-amber-400 font-bold">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Weekend Casuals</span>
                <span className="text-slate-400 font-bold">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Youth Ultras</span>
                <span className="text-sky-400 font-bold">75%</span>
              </div>
            </div>

            {/* Police Heat Gauge */}
            <div className="pt-2 border-t border-[#1f3044]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#8fa6be]">Police Heat Radar</span>
                <span className={policeHeat > 60 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {policeHeat}%
                </span>
              </div>
              <div className="w-full bg-[#0a1018] rounded h-2 overflow-hidden border border-[#1e2f42]">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    policeHeat > 70 ? 'bg-rose-500' : policeHeat > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${policeHeat}%` }}
                />
              </div>
              <p className="text-[10px] text-[#64748b] mt-1 leading-tight">
                {policeHeat > 60
                  ? 'Heavy surveillance: Section 60 active around train stations.'
                  : 'Normal matchday policing.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#0d1622] border-t border-[#1f3044] text-[11px] font-mono text-[#8fa6be] flex justify-between items-center">
            <span>Active Roster: <strong className="text-white">{activeLadsCount}</strong></span>
            <span>Injured: <strong className="text-rose-400">{injuredLadsCount}</strong></span>
            <span>Bailed: <strong className="text-amber-400">{bailedLadsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Second Row: FM 2010 News Dispatches */}
      <div className="fm-panel rounded-lg overflow-hidden">
        <div className="fm-panel-header px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Terrace Gazette & Police Wire</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Live In-Game News Feed</span>
        </div>

        <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {news.map(item => (
            <div
              key={item.id}
              className="p-3 rounded bg-[#0c141e] border border-[#1f3044] hover:border-[#334e6e] transition-colors space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                <span className="text-amber-400 font-bold">{item.source}</span>
                <span>{item.timeAgo}</span>
              </div>
              <h3 className="font-bold text-slate-100 font-sans leading-snug">
                {item.headline}
              </h3>
              <p className="text-[#8fa6be] text-[11px] leading-relaxed line-clamp-2">
                {item.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
