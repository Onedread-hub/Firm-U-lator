/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DiplomacyDeskView.tsx
 * Subculture Diplomacy Desk for Leicester Highfields (1980-2010).
 * Negotiate Anti-Police Mutual Defense Pacts, Non-Aggression Treaties,
 * Sound Clash alliances, and coordinate joint moves and support orders.
 */

import React, { useState } from 'react';
import {
  SubcultureFaction,
  DiplomacyTreaty,
  TreatyType,
  HighfieldsSector
} from '../types/diplomacy';
import { sound } from '../services/sound';
import {
  Handshake,
  ShieldAlert,
  Radio,
  FileText,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Sparkles,
  Users,
  MessageSquare
} from 'lucide-react';

interface DiplomacyDeskViewProps {
  factions: SubcultureFaction[];
  playerFactionId: string;
  sectors: HighfieldsSector[];
  treaties: DiplomacyTreaty[];
  currentYear: number;
  currentSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  onProposeTreaty: (targetFactionId: string, type: TreatyType) => void;
  onBreakTreaty: (treatyId: string) => void;
}

export const DiplomacyDeskView: React.FC<DiplomacyDeskViewProps> = ({
  factions,
  playerFactionId,
  sectors,
  treaties,
  currentYear,
  currentSeason,
  onProposeTreaty,
  onBreakTreaty
}) => {
  const otherFactions = factions.filter(f => f.id !== playerFactionId);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(otherFactions[0]?.id || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const playerFaction = factions.find(f => f.id === playerFactionId) || factions[0];
  const targetFaction = factions.find(f => f.id === selectedTargetId) || otherFactions[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Find existing treaty with target
  const existingTreaty = treaties.find(
    t =>
      t.status === 'active' &&
      ((t.factionAId === playerFactionId && t.factionBId === selectedTargetId) ||
        (t.factionBId === playerFactionId && t.factionAId === selectedTargetId))
  );

  const controlledByTarget = sectors.filter(s => s.controlledByFactionId === selectedTargetId);

  // Diplomatic Dispatch letter text generator based on subculture
  const getLeaderDispatch = (faction: SubcultureFaction) => {
    switch (faction.subculture) {
      case 'rasta':
        return `"Greetings in unity, brethren. Melbourne Road stands strong. Babylon police are watching every sound box, but the youth stand firm. If we combine forces against the SPG vans, Highfields will never fall."`;
      case 'punk':
        return `"Oi! The bailiffs and riot pigs want our Conduit Street squats smashed to dust. We've got barricades, barbed wire, and 500 safety pins. Sign the mutual defense pact and we'll watch your back when the sirens wail."`;
      case 'traveller':
        return `"Peace and blessings. Our Bedford buses have rolled into Spinney Hills. We only want open skies and free gatherings. Don't let the authorities divide us with the new laws."`;
      case 'hippies':
        return `"Love and solidarity from Victoria Park. The police want to ban the carnivals, but our sound and spirit are unstoppable. We urge a peaceful non-aggression agreement."`;
      case 'artist':
        return `"Broadcast towers are locked and loaded over St Peters. We're printing 5,000 legal observer rights cards. Back our radio transmitter and we'll broadcast police raid warnings directly to your crew."`;
      case 'biker':
        return `"Listen here: Berners Street belongs to the Midland Iron Chapter. We don't take orders from city hall or chief constables. Give us respect, and when a fight breaks out, our wrenches hit hard."`;
      case 'casual':
        return `"London Road station is our manor on matchday. We spot the police snatch squads before they even turn down Granby Street. Keep out of our terrace lanes and we'll provide heavy street muscle."`;
      default:
        return `"We stand for Highfields autonomy. Let us talk diplomacy and resist the common threat."`;
    }
  };

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-16 right-5 z-50 bg-amber-400 text-black px-4 py-2 rounded shadow-2xl font-bold text-xs uppercase tracking-wider animate-in fade-in slide-in-from-top-3">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0b121b] border border-[#203247] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>HIGHFIELDS ALLIANCE CABINET</span>
            <span>·</span>
            <span>DIPLOMATIC TREATIES &amp; MUTUAL DEFENSE</span>
          </div>
          <h2 className="text-lg font-bold text-white font-sans mt-0.5 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-amber-400" />
            <span>Subculture Diplomacy Desk ({currentSeason} {currentYear})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Forge Anti-Police Pacts, coordinate joint military support, or execute daring backstabs in classic Diplomacy style.
          </p>
        </div>
        <div className="bg-[#121c29] px-3 py-2 rounded border border-[#22354a] text-xs">
          <span className="text-slate-400 text-[10px] uppercase">Active Treaties:</span>
          <div className="font-bold text-sky-400">{treaties.filter(t => t.status === 'active').length} in Effect</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Faction Dossier Selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0d1520] p-3 rounded-t border-b border-[#24374b] flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-white">Highfields Subculture Leaders</span>
            <span className="text-[10px] text-slate-400">{otherFactions.length} factions present</span>
          </div>

          <div className="space-y-2">
            {otherFactions.map(fac => {
              const isSelected = fac.id === selectedTargetId;
              const hasPact = treaties.some(
                t =>
                  t.status === 'active' &&
                  ((t.factionAId === playerFactionId && t.factionBId === fac.id) ||
                    (t.factionBId === playerFactionId && t.factionAId === fac.id))
              );

              return (
                <div
                  key={fac.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTargetId(fac.id);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#18283d] border-amber-400 ring-1 ring-amber-400 shadow-md'
                      : 'bg-[#0d141e] border-[#1e2f42] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: fac.primaryColor }}
                    >
                      {fac.avatarIcon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5 font-sans">
                        <span>{fac.name}</span>
                        {hasPact && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                            ALLIED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {fac.leaderTitle}: <strong className="text-slate-200">{fac.leaderName}</strong>
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                        Style: {fac.personality.toUpperCase()} · Trust: {fac.aiTrustInPlayer}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="text-slate-400 text-[10px]">Respect</div>
                    <div className="font-bold text-white tabular-nums">{fac.respect} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Negotiation & Treaty Drafting Board */}
        <div className="lg:col-span-7 bg-[#0a0f17] border border-[#1e2f44] rounded-lg p-4 space-y-4 shadow-xl">
          {/* Target Header */}
          <div className="flex items-start justify-between border-b border-[#1b2b3d] pb-3">
            <div>
              <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                Diplomatic Channel With
              </div>
              <h3 className="text-lg font-bold text-white font-sans mt-0.5 flex items-center gap-2">
                <span>{targetFaction.name}</span>
                <span className="text-xs text-slate-400 font-mono font-normal">({targetFaction.subculture.toUpperCase()})</span>
              </h3>
              <div className="text-xs text-slate-300 mt-0.5">
                Leader: <strong className="text-amber-300">{targetFaction.leaderName}</strong> · Ethos: {targetFaction.ethos}
              </div>
            </div>

            <div
              className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center text-2xl shadow"
              style={{ backgroundColor: targetFaction.primaryColor }}
            >
              {targetFaction.avatarIcon}
            </div>
          </div>

          {/* Leader Dispatch Quote */}
          <div className="bg-[#0e1622] p-3 rounded border border-[#1f3044] space-y-1">
            <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DISPATCH FROM {targetFaction.leaderName.toUpperCase()}:</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {getLeaderDispatch(targetFaction)}
            </p>
          </div>

          {/* Territory & Tactical Intelligence */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#0b121b] p-3 rounded border border-[#1b2b3d]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Controlled Sectors</span>
              <div className="font-bold text-white mt-1 space-y-0.5">
                {controlledByTarget.length === 0 ? (
                  <span className="text-slate-500 italic">No sectors held</span>
                ) : (
                  controlledByTarget.map(s => (
                    <div key={s.id} className="text-sky-300 text-[11px]">
                      • {s.name}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Street Cred:</span>
                <span className="font-bold text-emerald-400">{targetFaction.streetCred}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Crew:</span>
                <span className="font-bold text-white">{targetFaction.crewCount} heads</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Police Heat:</span>
                <span className="font-bold text-rose-400">{targetFaction.policeHeat}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Music Culture:</span>
                <span className="font-bold text-amber-300 text-[10px]">{targetFaction.favoredMusic}</span>
              </div>
            </div>
          </div>

          {/* Existing Treaty Status & Actions */}
          {existingTreaty ? (
            <div className="p-3.5 bg-[#0f2316] border border-emerald-600 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ACTIVE PACT: {existingTreaty.type.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-700">
                  {existingTreaty.turnsRemaining} Seasons Left
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                You and {targetFaction.name} are bound by mutual defense. If the Police SPG attempts a raid on either crew's sectors, both crews provide automatic Support!
              </p>

              {/* The Backstab Option (Authentic Diplomacy Game Flavor!) */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPunch();
                    onBreakTreaty(existingTreaty.id);
                    showToast(`TREATY BROKEN: You backstabbed ${targetFaction.name}! Trust shattered.`);
                  }}
                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span>Execute Backstab (Break Treaty)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Proposal Options */
            <div className="space-y-3 pt-2 border-t border-[#1b2b3d]">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Propose Highfields Alliance Treaty:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Anti-Police Defense Pact */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playCheer();
                    onProposeTreaty(targetFaction.id, 'anti_police_pact');
                    showToast(`ANTI-POLICE DEFENSE PACT SIGNED WITH ${targetFaction.name.toUpperCase()}!`);
                  }}
                  className="p-3 bg-[#132233] hover:bg-[#1a2f47] border border-[#264465] rounded text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Anti-Police Mutual Defense</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    If the SPG riot squad raids either crew, the other automatically commits street Support.
                  </div>
                </button>

                {/* 2. Non-Aggression Pact */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playCheer();
                    onProposeTreaty(targetFaction.id, 'non_aggression');
                    showToast(`NON-AGGRESSION TREATY SIGNED WITH ${targetFaction.name.toUpperCase()}!`);
                  }}
                  className="p-3 bg-[#132233] hover:bg-[#1a2f47] border border-[#264465] rounded text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                    <Handshake className="w-4 h-4 text-sky-400" />
                    <span>Non-Aggression Treaty (NAP)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Guarantees no attacks on adjacent sectors for 4 seasons (1 year).
                  </div>
                </button>

                {/* 3. Sound Clash / Free Festival Alliance */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playCheer();
                    onProposeTreaty(targetFaction.id, 'sound_clash_alliance');
                    showToast(`FREE CARNIVAL ALLIANCE RATIFIED WITH ${targetFaction.name.toUpperCase()}!`);
                  }}
                  className="p-3 bg-[#132233] hover:bg-[#1a2f47] border border-[#264465] rounded text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Free Carnival Alliance</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Co-host sound systems in Victoria Park. Drops police heat by 20% and boosts revenue.
                  </div>
                </button>

                {/* 4. Pirate Radio Intelligence */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playCheer();
                    onProposeTreaty(targetFaction.id, 'intelligence_sharing');
                    showToast(`PIRATE RADIO INTELLIGENCE PACT WITH ${targetFaction.name.toUpperCase()}!`);
                  }}
                  className="p-3 bg-[#132233] hover:bg-[#1a2f47] border border-[#264465] rounded text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-purple-400" />
                    <span>Pirate Radio Intelligence</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Share lookout spotters to detect police roadblock operations a turn in advance.
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
