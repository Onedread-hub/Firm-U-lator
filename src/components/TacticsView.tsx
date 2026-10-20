import React from 'react';
import { Lad, Tactics, FormationType, WeaponDoctrine, LineDepth } from '../types/game';
import { sound } from '../services/sound';
import { Shield, Flame, Crosshair, Users, Info } from 'lucide-react';
import { FirmMemberSprite } from './FirmMemberSprite';

interface TacticsViewProps {
  tactics: Tactics;
  lads: Lad[];
  onUpdateTactics: (tactics: Tactics) => void;
}

const FORMATIONS: {
  id: FormationType;
  name: string;
  tagline: string;
  description: string;
  positions: { role: string; x: number; y: number }[];
}[] = [
  {
    id: 'the_wedge',
    name: 'The Wedge',
    tagline: 'Aggressive Forward Spearhead',
    description: 'Concentrates your heaviest Minders into a razor-sharp point to shatter the enemy frontline center.',
    positions: [
      { role: 'Minder (Point)', x: 50, y: 25 },
      { role: 'Minder (Left Flank)', x: 38, y: 40 },
      { role: 'Minder (Right Flank)', x: 62, y: 40 },
      { role: 'Top Boy (Command)', x: 50, y: 55 },
      { role: 'Runner (Wing)', x: 26, y: 65 },
      { role: 'Runner (Wing)', x: 74, y: 65 },
      { role: 'Face (Core)', x: 42, y: 78 },
      { role: 'Nutter (Rear)', x: 58, y: 78 }
    ]
  },
  {
    id: 'flat_phalanx',
    name: 'Flat Phalanx',
    tagline: 'Disciplined Pavement Wall',
    description: 'A fortified line across the street width. High block chance and resilience against frontal charges.',
    positions: [
      { role: 'Minder', x: 20, y: 35 },
      { role: 'Minder', x: 40, y: 35 },
      { role: 'Minder', x: 60, y: 35 },
      { role: 'Minder', x: 80, y: 35 },
      { role: 'Runner', x: 15, y: 60 },
      { role: 'Top Boy', x: 50, y: 60 },
      { role: 'Runner', x: 85, y: 60 },
      { role: 'Face', x: 50, y: 80 }
    ]
  },
  {
    id: 'pincer_flank',
    name: 'Pincer Flank',
    tagline: 'Dual Flanking Sweep',
    description: 'Minders hold the center while rapid runners swing wide down side alleys to surround rival flanks.',
    positions: [
      { role: 'Minder', x: 40, y: 45 },
      { role: 'Top Boy', x: 50, y: 50 },
      { role: 'Minder', x: 60, y: 45 },
      { role: 'Runner (Flank)', x: 15, y: 25 },
      { role: 'Runner (Flank)', x: 85, y: 25 },
      { role: 'Nutter', x: 30, y: 70 },
      { role: 'Nutter', x: 70, y: 70 },
      { role: 'Face', x: 50, y: 85 }
    ]
  },
  {
    id: 'box_retain',
    name: 'Box Retain',
    tagline: 'Fortified Perimeter Box',
    description: 'Surrounds and shields injured lads and Top Boy. Highly resilient against police kettle attempts.',
    positions: [
      { role: 'Minder (Front)', x: 40, y: 30 },
      { role: 'Minder (Front)', x: 60, y: 30 },
      { role: 'Face (Left)', x: 25, y: 55 },
      { role: 'Top Boy (Protected)', x: 50, y: 55 },
      { role: 'Face (Right)', x: 75, y: 55 },
      { role: 'Runner (Back)', x: 35, y: 75 },
      { role: 'Nutter (Back)', x: 65, y: 75 },
      { role: 'Runner (Patrol)', x: 50, y: 85 }
    ]
  },
  {
    id: 'alley_ambush',
    name: 'Alley Ambush',
    tagline: 'Bait & Chokepoint Trap',
    description: 'Lures rival firm into narrow passages where your runners cut off their retreat from behind.',
    positions: [
      { role: 'Runner (Bait)', x: 50, y: 20 },
      { role: 'Minder (Choke)', x: 35, y: 45 },
      { role: 'Minder (Choke)', x: 65, y: 45 },
      { role: 'Top Boy', x: 50, y: 60 },
      { role: 'Face', x: 50, y: 75 },
      { role: 'Nutter (Rear Cut)', x: 20, y: 80 },
      { role: 'Nutter (Rear Cut)', x: 80, y: 80 },
      { role: 'Runner', x: 50, y: 90 }
    ]
  }
];

export const TacticsView: React.FC<TacticsViewProps> = ({
  tactics,
  lads,
  onUpdateTactics
}) => {
  const currentFormation = FORMATIONS.find(f => f.id === tactics.formation) || FORMATIONS[0];
  const activeLads = lads.filter(l => l.status === 'active');

  const handleToggleSelectedLad = (ladId: string) => {
    sound.playClick();
    if (tactics.selectedLadIds.includes(ladId)) {
      if (tactics.selectedLadIds.length <= 4) return;
      onUpdateTactics({
        ...tactics,
        selectedLadIds: tactics.selectedLadIds.filter(id => id !== ladId)
      });
    } else {
      if (tactics.selectedLadIds.length >= 8) return;
      onUpdateTactics({
        ...tactics,
        selectedLadIds: [...tactics.selectedLadIds, ladId]
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* FM 2010 Tactics Breadcrumb Header */}
      <div className="bg-[#0d1520] p-3 rounded-t-lg border-b border-[#25394f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#7188a1] font-mono">
            Northwood United &gt; Tactics &gt; Formations &amp; Terrace Directives
          </div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white font-sans flex items-center gap-2">
            <span>Tactics Board</span>
            <span className="text-xs text-amber-400 font-mono font-normal">({currentFormation.name})</span>
          </h2>
        </div>

        {/* Formation Tabs */}
        <div className="flex items-center gap-1 bg-[#121c29] p-1 rounded border border-[#233549] overflow-x-auto">
          {FORMATIONS.map(form => (
            <button
              key={form.id}
              onClick={() => {
                sound.playClick();
                onUpdateTactics({ ...tactics, formation: form.id });
              }}
              className={`px-3 py-1 text-xs rounded transition-all whitespace-nowrap font-medium ${
                tactics.formation === form.id
                  ? 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white shadow-sm font-bold border border-[#60a5fa]'
                  : 'text-[#8fa6be] hover:text-white hover:bg-[#1a293b]'
              }`}
            >
              {form.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: The FM 2010 Pitch View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-white font-bold">{currentFormation.name}</span>
              <span className="text-amber-400 text-[11px] font-mono">{currentFormation.tagline}</span>
            </div>

            {/* FM 2010 Style Grass/Tactical Pitch */}
            <div className="p-3 bg-[#0a111a]">
              <div className="relative w-full h-80 sm:h-96 rounded border-2 border-[#1e4a2a] bg-gradient-to-b from-[#143d1f] via-[#1b4d27] to-[#143d1f] overflow-hidden shadow-inner">
                {/* Classic FM Pitch Markings */}
                <div className="absolute inset-x-0 top-0 h-16 border-b-2 border-white/20 w-48 mx-auto" />
                <div className="absolute inset-x-0 top-0 h-8 border-b-2 border-white/20 w-24 mx-auto" />
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20" />
                <div className="absolute inset-x-0 bottom-0 h-16 border-t-2 border-white/20 w-48 mx-auto" />
                <div className="absolute inset-x-0 bottom-0 h-8 border-t-2 border-white/20 w-24 mx-auto" />

                {/* Subtle Pitch Grass Striping */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_50%,transparent_50%)] bg-[length:100%_40px] pointer-events-none" />

                {/* Rival Axis Indicator */}
                <div className="absolute top-2 inset-x-0 text-center pointer-events-none z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    ▲ OPPOSING FIRM LINE ▲
                  </span>
                </div>

                {/* Player Tokens in FM 2010 Disc Style */}
                {currentFormation.positions.map((pos, idx) => {
                  const assignedLadId = tactics.selectedLadIds[idx];
                  const assignedLad = lads.find(l => l.id === assignedLadId);

                  return (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      {/* Animated Sprite in Formation */}
                      <div className="relative group-hover:scale-110 transition-transform flex flex-col items-center">
                        <FirmMemberSprite
                          motion="idle"
                          facing={pos.x < 50 ? 'right' : 'left'}
                          role={assignedLad?.role || 'minder'}
                          jacketColor="#1e3a8a"
                          size={36}
                          showShadow={true}
                        />
                        {/* Number badge */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center border border-black shadow">
                          {idx + 1}
                        </div>
                      </div>
                      {/* Name Tag */}
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-black/85 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap shadow drop-shadow-sm">
                        {assignedLad ? `${assignedLad.name.split(' ')[0]} ("${assignedLad.nickname}")` : pos.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-[#0d1622] border-t border-[#1f3044] text-[11px] font-mono text-[#8fa6be] leading-relaxed">
              {currentFormation.description}
            </div>
          </div>

          {/* Starting Lineup Selection Strip */}
          <div className="fm-panel rounded-lg overflow-hidden p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Selected Lineup ({tactics.selectedLadIds.length}/8 Lads)</span>
              </span>
              <span className="text-[#64748b]">Click lads to toggle on/off</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeLads.map(lad => {
                const isSelected = tactics.selectedLadIds.includes(lad.id);
                return (
                  <button
                    key={lad.id}
                    onClick={() => handleToggleSelectedLad(lad.id)}
                    className={`p-2 rounded text-left border transition-all text-xs font-mono ${
                      isSelected
                        ? 'bg-[#1e3a5f] border-[#3b82f6] text-white shadow ring-1 ring-[#60a5fa]'
                        : 'bg-[#0d141e] border-[#1e2e40] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold truncate text-slate-200">
                      {lad.name.split(' ')[0]} "{lad.nickname}"
                    </div>
                    <div className="text-[10px] text-[#64748b] capitalize mt-0.5">
                      {lad.role.replace('_', ' ')} · H:{lad.hardness}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: FM 2010 Tactical Sliders & Directives */}
        <div className="lg:col-span-5 fm-panel rounded-lg overflow-hidden">
          <div className="fm-panel-header px-4 py-2 text-xs font-bold text-white">
            Terrace Instructions &amp; Sliders
          </div>

          <div className="p-4 space-y-4 text-xs font-mono">
            {/* Aggression / Mentality Slider */}
            <div className="space-y-1.5 bg-[#0c141e] p-3 rounded border border-[#1f3044]">
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8] font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Team Aggression</span>
                </span>
                <span className="text-amber-400 font-bold">
                  {tactics.aggression === 1 && '1 - Canny & Defensive'}
                  {tactics.aggression === 2 && '2 - Disciplined'}
                  {tactics.aggression === 3 && '3 - Standard Terrace'}
                  {tactics.aggression === 4 && '4 - Fierce Pressure'}
                  {tactics.aggression === 5 && '5 - Red Mist All-Out'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={tactics.aggression}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateTactics({ ...tactics, aggression: parseInt(e.target.value) });
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-[#172535] rounded"
              />
              <div className="flex justify-between text-[10px] text-[#64748b]">
                <span>Contain</span>
                <span>Standard</span>
                <span>All-Out Clash</span>
              </div>
            </div>

            {/* Line Depth */}
            <div className="space-y-1.5 bg-[#0c141e] p-3 rounded border border-[#1f3044]">
              <div className="text-[#94a3b8] font-bold">Defensive Line Depth</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'deep_hold', label: 'Deep Hold', desc: 'Doorway' },
                    { id: 'mid_pavement', label: 'Pavement', desc: 'Mid Street' },
                    { id: 'high_press', label: 'High Press', desc: 'Enemy Pub' }
                  ] as { id: LineDepth; label: string; desc: string }[]
                ).map(depth => (
                  <button
                    key={depth.id}
                    onClick={() => {
                      sound.playClick();
                      onUpdateTactics({ ...tactics, lineDepth: depth.id });
                    }}
                    className={`p-2 rounded border text-left transition-all ${
                      tactics.lineDepth === depth.id
                        ? 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white font-bold border-[#60a5fa] shadow'
                        : 'bg-[#111c29] text-[#8fa6be] border-[#22354a] hover:text-white'
                    }`}
                  >
                    <div>{depth.label}</div>
                    <div className="text-[9px] opacity-75">{depth.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weapon & Flare Doctrine */}
            <div className="space-y-1.5 bg-[#0c141e] p-3 rounded border border-[#1f3044]">
              <div className="text-[#94a3b8] font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Weapon &amp; Flare Doctrine</span>
              </div>
              <div className="space-y-1">
                {(
                  [
                    { id: 'strictly_fists', name: 'Strictly Fists & Boots', desc: 'Honorable terrace scrap. Low legal heat.' },
                    { id: 'bottles_and_pints', name: 'Pint Glasses & Ashtrays', desc: 'Stuns frontline. Moderate heat.' },
                    { id: 'smoke_and_flares', name: 'Smoke Bombs & Marine Flares', desc: 'Disorients charge, smoke screen.' },
                    { id: 'scaffold_and_belts', name: 'Heavy Belts & Scaffolding', desc: 'Shock strike. Extreme riot alert.' }
                  ] as { id: WeaponDoctrine; name: string; desc: string }[]
                ).map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      sound.playClick();
                      onUpdateTactics({ ...tactics, weaponDoctrine: doc.id });
                    }}
                    className={`w-full p-2 rounded border text-left transition-all ${
                      tactics.weaponDoctrine === doc.id
                        ? 'bg-[#1e3a5f] border-[#3b82f6] text-white ring-1 ring-[#60a5fa]'
                        : 'bg-[#111c29] border-[#22354a] text-[#8fa6be] hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-slate-200">{doc.name}</div>
                    <div className="text-[10px] text-[#64748b] mt-0.5">{doc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Target */}
            <div className="space-y-1.5 bg-[#0c141e] p-3 rounded border border-[#1f3044]">
              <div className="text-[#94a3b8] font-bold flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-red-400" />
                <span>Tactical Focus</span>
              </div>
              <select
                value={tactics.priorityTarget}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateTactics({
                    ...tactics,
                    priorityTarget: e.target.value as Tactics['priorityTarget']
                  });
                }}
                className="w-full bg-[#111c29] border border-[#22354a] text-slate-200 text-xs font-mono p-2 rounded focus:border-[#3b82f6] focus:outline-none"
              >
                <option value="break_frontline">Break Enemy Frontline Center (Shatter their wall)</option>
                <option value="isolate_top_boy">Isolate Rival Top Boy (Break firm morale)</option>
                <option value="pin_runners">Pin & Neutralize Flank Runners (Prevent encirclement)</option>
                <option value="hold_the_door">Hold The Ground / Protect Territory Entrance</option>
              </select>
            </div>

            {/* Retreat Threshold */}
            <div className="space-y-1 bg-[#0c141e] p-3 rounded border border-[#1f3044]">
              <div className="flex justify-between">
                <span className="text-[#94a3b8] font-bold">Dispersal Threshold</span>
                <span className="text-amber-400 font-bold">{tactics.retreatThreshold}% Casualty Trigger</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={tactics.retreatThreshold}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateTactics({ ...tactics, retreatThreshold: parseInt(e.target.value) });
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-[#172535] rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
