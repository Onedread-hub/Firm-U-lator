import React, { useEffect } from 'react';
import { ClashOutcome, Firm } from '../types/game';
import { triggerConfetti } from '../utils/confetti';
import { Award, AlertTriangle, ShieldCheck, DollarSign, Users, ChevronRight, FileText } from 'lucide-react';
import { sound } from '../services/sound';

interface PostClashReportProps {
  outcome: ClashOutcome;
  playerFirm: Firm;
  onReturnToOffice: () => void;
}

export const PostClashReport: React.FC<PostClashReportProps> = ({
  outcome,
  playerFirm,
  onReturnToOffice
}) => {
  const isVictorious = outcome.winnerId === playerFirm.id;
  const isDraw = outcome.winnerId === 'draw';
  const isDispersed = outcome.winnerId === 'police_dispersed';

  useEffect(() => {
    if (isVictorious) {
      triggerConfetti();
    }
  }, [isVictorious]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Newspaper Style Container */}
      <div className="border border-zinc-700 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
        {/* Newspaper Masthead */}
        <div className="border-b-2 border-zinc-700 bg-zinc-950 p-6 text-center space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase border-b border-zinc-800 pb-2">
            <span>Special Sunday Matchday Edition</span>
            <span>Terrace Gazette & Casuals Dispatch</span>
            <span>Price: 50p</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-100 font-mono py-2">
            THE TERRACE CHRONICLE
          </h1>
          <div className="text-xs font-mono text-amber-400">
            OFFICIAL CLASH REPORT · {outcome.playerFirmName} vs {outcome.rivalFirmName}
          </div>
        </div>

        {/* Headline Banner */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded ${
                isVictorious
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                  : isDraw
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-700'
              }`}
            >
              {isVictorious
                ? 'DECISIVE TERRACE VICTORY'
                : isDraw
                ? 'HONORS EVEN STALEMATE'
                : isDispersed
                ? 'RIOT POLICE INTERVENTION'
                : 'TACTICAL DISPERSAL'}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold uppercase font-mono text-white leading-tight">
              {outcome.headline}
            </h2>
            <p className="text-sm italic text-zinc-400 max-w-2xl mx-auto font-mono">
              {outcome.newspaperQuote}
            </p>
          </div>

          {/* Key Match Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">Street Respect</div>
              <div
                className={`text-xl font-bold mt-1 tabular-nums ${
                  outcome.respectDelta >= 0 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {outcome.respectDelta >= 0 ? `+${outcome.respectDelta}` : outcome.respectDelta} pts
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">Fan Loyalty Shift</div>
              <div
                className={`text-xl font-bold mt-1 tabular-nums ${
                  outcome.loyaltyDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {outcome.loyaltyDelta >= 0 ? `+${outcome.loyaltyDelta}%` : `${outcome.loyaltyDelta}%`}
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">Treasury / Bets</div>
              <div
                className={`text-xl font-bold mt-1 tabular-nums ${
                  outcome.treasuryDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {outcome.treasuryDelta >= 0 ? `+£${outcome.treasuryDelta}` : `-£${Math.abs(outcome.treasuryDelta)}`}
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">Clash Duration</div>
              <div className="text-xl font-bold mt-1 text-zinc-200 tabular-nums">
                {outcome.roundsFought} mins
              </div>
            </div>
          </div>

          {/* Casualties & Police Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Casualties */}
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-zinc-800 pb-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Casualties & Medical Report</span>
              </div>
              {outcome.playerInjuries.length > 0 ? (
                <div className="space-y-1 text-zinc-300">
                  <p className="text-zinc-400">The following lads sustained injuries in the clash:</p>
                  {outcome.playerInjuries.map((name, i) => (
                    <div key={i} className="text-rose-400 font-semibold">
                      • {name} (Requires private physio care)
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-400 font-semibold">
                  Zero critical casualties. Frontline remained intact with minor bruises.
                </p>
              )}
            </div>

            {/* Legal & Arrests */}
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-zinc-800 pb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Police Blotter & Legal Heat</span>
              </div>
              {outcome.arrests.length > 0 ? (
                <div className="space-y-1 text-zinc-300">
                  <p className="text-zinc-400">Met Police Section 60 arrests recorded:</p>
                  {outcome.arrests.map((name, i) => (
                    <div key={i} className="text-amber-400 font-semibold">
                      • {name} (Bailed until magistrate hearing)
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-400 font-semibold">
                  Clean getaway down back alleys. No lads detained by police!
                </p>
              )}
            </div>
          </div>

          {/* Tactical Commentary Log Summary */}
          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-400">
              Key Matchday Narrative Highlights
            </span>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs text-zinc-300">
              {outcome.matchNarrative.slice(0, 10).map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Return CTA */}
          <div className="pt-4 text-center">
            <button
              onClick={() => {
                sound.playClick();
                onReturnToOffice();
              }}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Return to Manager's Office & Advance Week</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
