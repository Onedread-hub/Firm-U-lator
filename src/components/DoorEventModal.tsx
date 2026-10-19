/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DoorEventModal.tsx
 * Interactive modal for weekly/spontaneous Door Security confrontations.
 * Unruly punters, police licensing inspections, and rival top boy standoffs.
 */

import React, { useState } from 'react';
import { DoorEvent, DoorChoice, Venue } from '../types/territoryWars';
import { Lad } from '../types/game';
import { sound } from '../services/sound';
import { ShieldAlert, AlertTriangle, Beer, Siren, Users, Check, ArrowRight, DollarSign } from 'lucide-react';

interface DoorEventModalProps {
  event: DoorEvent;
  venue: Venue | undefined;
  assignedLads: Lad[];
  treasury: number;
  onResolveChoice: (choice: DoorChoice, choiceIndex: number) => void;
  onClose: () => void;
}

export const DoorEventModal: React.FC<DoorEventModalProps> = ({
  event,
  venue,
  assignedLads,
  treasury,
  onResolveChoice,
  onClose
}) => {
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const bestBottle = assignedLads.length > 0 ? Math.max(...assignedLads.map(l => l.bottle)) : 40;
  const bestHardness = assignedLads.length > 0 ? Math.max(...assignedLads.map(l => l.hardness)) : 40;

  const handleSelect = (idx: number) => {
    sound.playClick();
    setSelectedChoiceIdx(idx);
  };

  const handleConfirm = () => {
    if (selectedChoiceIdx === null) return;
    const choice = event.choices[selectedChoiceIdx];

    // Check treasury cost
    if (choice.treasuryDelta < 0 && treasury < Math.abs(choice.treasuryDelta)) {
      sound.playHit();
      setResultMessage(`Insufficient funds! You need £${Math.abs(choice.treasuryDelta)} to authorize this action.`);
      return;
    }

    // Check stat requirements if any
    if (choice.requiresStat) {
      const userStat = choice.requiresStat.stat === 'bottle' ? bestBottle : bestHardness;
      if (userStat < choice.requiresStat.minValue) {
        sound.playHit();
        setResultMessage(
          `Your minders lacked the ${choice.requiresStat.stat.toUpperCase()} (Required: ${choice.requiresStat.minValue}, Best: ${userStat}). The confrontation escalated!`
        );
        setTimeout(() => {
          onResolveChoice({
            ...choice,
            respectDelta: choice.respectDelta - 15,
            heatDelta: choice.heatDelta + 10
          }, selectedChoiceIdx);
        }, 1500);
        return;
      }
    }

    if (choice.triggerClash) {
      sound.playWhistle();
    } else {
      sound.playCheer();
    }

    onResolveChoice(choice, selectedChoiceIdx);
  };

  const getEventBadge = () => {
    switch (event.type) {
      case 'unruly_punter':
        return {
          icon: <Beer className="w-5 h-5 text-amber-400" />,
          title: 'UNRULY PUNTER AT THE ROPES',
          style: 'border-amber-600 bg-amber-950/40 text-amber-300'
        };
      case 'police_visit':
        return {
          icon: <Siren className="w-5 h-5 text-rose-400 animate-pulse" />,
          title: 'POLICE LICENSING RAID & INSPECTION',
          style: 'border-rose-600 bg-rose-950/40 text-rose-300'
        };
      case 'rival_top_boy':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />,
          title: 'RIVAL FIRM HOSTILE DOOR CONFRONTATION',
          style: 'border-rose-600 bg-rose-950/50 text-rose-200'
        };
    }
  };

  const badge = getEventBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-mono">
      <div className="w-full max-w-xl bg-[#0c1219] border-2 border-[#2b3e55] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#142333] via-[#1c2e42] to-[#142333] p-4 border-b border-[#2b3e55] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded border ${badge.style}`}>
              {badge.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Nightlife Incident · {venue?.name || event.venueName}
              </div>
              <h3 className="text-base font-bold text-white font-sans">
                {badge.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Minders on Duty */}
        <div className="px-4 py-2 bg-[#101924] border-b border-[#1f2e40] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>
              Minders On Duty:{' '}
              <strong className="text-white">
                {assignedLads.length > 0 ? assignedLads.map(l => l.name).join(', ') : 'None (Unmanned door!)'}
              </strong>
            </span>
          </div>
          {assignedLads.length > 0 && (
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Bottle: <strong className="text-amber-400">{bestBottle}</strong></span>
              <span>STR: <strong className="text-emerald-400">{bestHardness}</strong></span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 space-y-4 text-xs bg-[#090e15]">
          <div className="bg-[#121c28] border border-[#233549] p-3 rounded text-slate-200 leading-relaxed">
            {event.description}
          </div>

          {resultMessage && (
            <div className="p-2.5 rounded bg-amber-950/60 border border-amber-600 text-amber-200 text-xs font-bold">
              {resultMessage}
            </div>
          )}

          {/* Choices */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#7e94ab]">
              Order Door Minders How To React:
            </div>

            {event.choices.map((choice, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#18293d] border-amber-400 text-white shadow-md'
                      : 'bg-[#0f1722] border-[#223347] text-slate-300 hover:bg-[#14202e] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${
                        isSelected ? 'border-amber-400 bg-amber-400 text-black font-bold' : 'border-slate-600 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      {choice.label}
                    </span>

                    {/* Stat / Cost Badges */}
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      {choice.treasuryDelta !== 0 && (
                        <span className={`px-1.5 py-0.5 rounded ${
                          choice.treasuryDelta < 0 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {choice.treasuryDelta < 0 ? `-£${Math.abs(choice.treasuryDelta)}` : `+£${choice.treasuryDelta}`}
                        </span>
                      )}
                      {choice.respectDelta !== 0 && (
                        <span className={`px-1.5 py-0.5 rounded ${
                          choice.respectDelta > 0 ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {choice.respectDelta > 0 ? `+${choice.respectDelta} Respect` : `${choice.respectDelta} Respect`}
                        </span>
                      )}
                      {choice.heatDelta !== 0 && (
                        <span className={`px-1.5 py-0.5 rounded ${
                          choice.heatDelta > 0 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {choice.heatDelta > 0 ? `+${choice.heatDelta} Heat` : `${choice.heatDelta} Heat`}
                        </span>
                      )}
                      {choice.triggerClash && (
                        <span className="bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] animate-pulse">
                          TRIGGERS CLASH
                        </span>
                      )}
                    </div>
                  </div>

                  {choice.description && (
                    <p className="text-[11px] text-[#8fa3ba] mt-1.5 ml-6">
                      {choice.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#0a0f17] border-t border-[#1e2f42] flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Treasury: <strong className="text-emerald-400">£{treasury}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedChoiceIdx === null}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedChoiceIdx !== null
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Confirm Reaction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
