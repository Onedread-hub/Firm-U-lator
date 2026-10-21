/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SpriteMotionShowcaseModal.tsx
 * Interactive inspection lab & animation showcase for Firm Member Sprites.
 * Test and preview punching, kicking, running, idle, and knocked-down motions
 * across different casual roles, jacket colors, and frame rates.
 */

import React, { useState } from 'react';
import { FirmMemberSprite, SpriteMotion, SpriteFacing } from './FirmMemberSprite';
import { Firm } from '../types/game';
import { SubcultureType } from '../types/diplomacy';
import { X, Play, Pause, RotateCcw, Swords, Shield, Activity, User, Eye, Zap } from 'lucide-react';

interface SpriteMotionShowcaseModalProps {
  playerFirm: Firm;
  rivalFirm: Firm;
  onClose: () => void;
}

export const SpriteMotionShowcaseModal: React.FC<SpriteMotionShowcaseModalProps> = ({
  playerFirm,
  rivalFirm,
  onClose
}) => {
  const [selectedMotion, setSelectedMotion] = useState<SpriteMotion>('punching');
  const [selectedSubculture, setSelectedSubculture] = useState<SubcultureType>('rasta');
  const [selectedRole, setSelectedRole] = useState<'top_boy' | 'minder' | 'runner' | 'nutter' | 'face'>('top_boy');
  const [facing, setFacing] = useState<SpriteFacing>('right');
  const [teamSelect, setTeamSelect] = useState<'player' | 'rival'>('player');
  const [spriteSize, setSpriteSize] = useState<number>(100); // 100px large preview
  const [isManualFrame, setIsManualFrame] = useState<boolean>(false);
  const [manualFrameIndex, setManualFrameIndex] = useState<number>(1);

  const activeColor = teamSelect === 'player'
    ? (playerFirm.primaryColor || '#1e3a8a')
    : (rivalFirm.primaryColor || '#991b1b');

  const motions: { id: SpriteMotion; label: string; icon: string; desc: string }[] = [
    {
      id: 'punching',
      label: 'Devastating Right Cross',
      icon: '💥',
      desc: 'Explosive straight punch with bandaged knuckles and impact spark'
    },
    {
      id: 'kicking',
      label: 'Terrace Boot Kick',
      icon: '👟',
      desc: 'High front snap kick extending Adidas trainer with speed swoosh lines'
    },
    {
      id: 'running',
      label: 'Alleyway Sprint Stride',
      icon: '🏃',
      desc: 'Aggressive 4-frame forward sprint with pumping arms and dust clouds'
    },
    {
      id: 'idle',
      label: 'Bouncing Guard Stance',
      icon: '🥊',
      desc: 'Menacing terrace bob on the balls of white Adidas trainers, fists raised'
    },
    {
      id: 'knocked_down',
      label: 'Floored on Deck',
      icon: '💫',
      desc: 'Sprawled flat on wet cobblestones with swirling yellow stars'
    }
  ];

  const roles: { id: typeof selectedRole; label: string; trait: string }[] = [
    { id: 'top_boy', label: 'Top Boy (Leader)', trait: 'Flat cap / confident quiff, sovereign ring, trench jacket' },
    { id: 'minder', label: 'Minder (Enforcer)', trait: 'Heavyweight broad shoulders, leather bomber, bruiser' },
    { id: 'runner', label: 'Runner (Scout)', trait: 'Bucket hat, athletic windbreaker, speedy nimble footwork' },
    { id: 'nutter', label: 'Nutter (Berserker)', trait: 'Skinhead with facial scar, fearless reckless brawler' },
    { id: 'face', label: 'The Face (Diplomat)', trait: 'Designer Italian sunglasses, tailored terrace tracktop' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-3xl bg-[#090d14] border border-[#203247] rounded-xl shadow-2xl overflow-hidden font-mono text-zinc-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1e2f42] bg-[#0c141e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-400 text-black rounded font-black text-xs">
              SFS
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
                <Swords className="w-4 h-4 text-amber-400" />
                <span>Firm Member Animated Sprite Studio</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Pixel-art sprites with dedicated Punching, Kicking, and Running motions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#162334] text-slate-400 hover:text-white border border-[#263b54] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Big Interactive Sprite Stage */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            {/* The Canvas / Stage */}
            <div className="relative w-full h-64 sm:h-72 bg-radial from-[#131f2f] to-[#060a10] border-2 border-[#1f3248] rounded-xl flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Cobblestones Pavement Markings */}
              <div className="absolute inset-x-0 bottom-6 border-b border-white/10" />
              <div className="absolute inset-x-0 bottom-12 border-b border-dashed border-white/5" />

              {/* Club Colors Badge in Corner */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10 text-[10px]">
                <div
                  className="w-3.5 h-3.5 rounded-sm border border-white/40 shadow-xs"
                  style={{ backgroundColor: activeColor }}
                />
                <span className="font-bold text-slate-200">
                  {teamSelect === 'player' ? playerFirm.name : rivalFirm.name}
                </span>
              </div>

              {/* The Sprite Instance */}
              <div className="relative z-10 flex items-center justify-center">
                <FirmMemberSprite
                  motion={selectedMotion}
                  facing={facing}
                  role={selectedRole}
                  subculture={selectedSubculture}
                  jacketColor={activeColor}
                  size={spriteSize}
                  frameIndex={isManualFrame ? manualFrameIndex : undefined}
                  showShadow={true}
                  showHitEffect={selectedMotion === 'punching' && manualFrameIndex === 1}
                />
              </div>

              {/* Action Motion Tag */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center">
                <span className="px-3 py-1 bg-black/80 rounded-full border border-amber-500/50 text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Motion: {selectedMotion.toUpperCase()}</span>
                  <span>·</span>
                  <span>Frame: {isManualFrame ? `F${manualFrameIndex + 1}` : '60FPS LOOP'}</span>
                </span>
              </div>
            </div>

            {/* Quick Motion Switcher Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
              {motions.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMotion(m.id)}
                  className={`p-2 rounded border text-center transition-all ${
                    selectedMotion === m.id
                      ? 'bg-amber-400 text-black border-amber-300 font-black shadow-md'
                      : 'bg-[#101926] text-slate-300 border-[#203247] hover:bg-[#18263a]'
                  }`}
                >
                  <div className="text-base">{m.icon}</div>
                  <div className="text-[10px] font-bold mt-1 uppercase truncate">{m.id.replace('_', ' ')}</div>
                </button>
              ))}
            </div>

            {/* Playback Controls (Loop vs Step Frame) */}
            <div className="p-3 bg-[#0c141e] rounded-lg border border-[#1e2f42] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsManualFrame(prev => !prev)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold flex items-center gap-1 ${
                    !isManualFrame
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-[#162334] text-slate-300 border-[#293e58]'
                  }`}
                >
                  {!isManualFrame ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{isManualFrame ? 'Manual Step' : 'Live Animated'}</span>
                </button>

                {isManualFrame && (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map(fIdx => (
                      <button
                        key={fIdx}
                        onClick={() => setManualFrameIndex(fIdx)}
                        className={`w-6 h-6 rounded text-[10px] font-bold border ${
                          manualFrameIndex === fIdx
                            ? 'bg-amber-400 text-black border-amber-300'
                            : 'bg-[#142030] text-slate-300 border-[#25374d]'
                        }`}
                      >
                        {fIdx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Facing & Size Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFacing(f => f === 'left' ? 'right' : 'left')}
                  className="px-2 py-1 rounded bg-[#162334] text-slate-300 hover:text-white border border-[#293e58] text-[10px] font-bold"
                >
                  Flip ({facing.toUpperCase()})
                </button>
                <button
                  onClick={() => setSpriteSize(s => s === 100 ? 64 : 100)}
                  className="px-2 py-1 rounded bg-[#162334] text-slate-300 hover:text-white border border-[#293e58] text-[10px] font-bold"
                >
                  Scale: {spriteSize}px
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Subculture Selection */}
          <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
            {/* Highfields Subculture Model Selector */}
            <div className="p-3 bg-[#0c141e] rounded-lg border border-[#1e2f42] space-y-2 text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Highfields Subculture Model:</span>
              <div className="grid grid-cols-4 gap-1.5 font-mono">
                {[
                  { id: 'rasta', icon: '🇯🇲', label: 'Rasta' },
                  { id: 'punk', icon: '⚡', label: 'Punk' },
                  { id: 'traveller', icon: '🚐', label: 'Traveller' },
                  { id: 'hippie', icon: '☮️', label: 'Hippie' },
                  { id: 'artist', icon: '📻', label: 'Artist' },
                  { id: 'biker', icon: '🏍️', label: 'Biker' },
                  { id: 'casual', icon: '👟', label: 'Casual' },
                  { id: 'police', icon: '🚔', label: 'Police SPG' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubculture(sub.id as SubcultureType)}
                    className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                      selectedSubculture === sub.id
                        ? 'bg-amber-400 text-black font-bold border-amber-300 shadow'
                        : 'bg-[#101824] text-slate-300 border-[#1f3044] hover:bg-[#162334]'
                    }`}
                  >
                    <div className="text-sm">{sub.icon}</div>
                    <div className="text-[9px] mt-0.5 truncate">{sub.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Kit Selector */}
            <div className="p-3 bg-[#0c141e] rounded-lg border border-[#1e2f42] space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Faction Palette:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTeamSelect('player')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition-colors ${
                    teamSelect === 'player'
                      ? 'bg-[#18283d] text-white border-amber-400 ring-1 ring-amber-400/50'
                      : 'bg-[#0f1824] text-slate-400 border-[#1e2f42]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-sm border border-white/20 shrink-0"
                    style={{ backgroundColor: playerFirm.primaryColor || '#1e3a8a' }}
                  />
                  <div className="truncate">
                    <div className="font-bold text-[11px] truncate">{playerFirm.shortName}</div>
                    <div className="text-[9px] text-amber-400">Home Casuals</div>
                  </div>
                </button>

                <button
                  onClick={() => setTeamSelect('rival')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition-colors ${
                    teamSelect === 'rival'
                      ? 'bg-[#18283d] text-white border-amber-400 ring-1 ring-amber-400/50'
                      : 'bg-[#0f1824] text-slate-400 border-[#1e2f42]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-sm border border-white/20 shrink-0"
                    style={{ backgroundColor: rivalFirm.primaryColor || '#991b1b' }}
                  />
                  <div className="truncate">
                    <div className="font-bold text-[11px] truncate">{rivalFirm.shortName}</div>
                    <div className="text-[9px] text-rose-400">Away Rivals</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Casual Role Selection */}
            <div className="p-3 bg-[#0c141e] rounded-lg border border-[#1e2f42] space-y-2 text-xs flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Casual Role Attire:</span>
              <div className="space-y-1.5">
                {roles.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedRole === r.id
                        ? 'bg-[#17273b] border-amber-400 text-white'
                        : 'bg-[#0e1622] border-[#1d2d40] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-300">{r.label}</span>
                      {selectedRole === r.id && (
                        <span className="text-[9px] bg-amber-400 text-black px-1.5 rounded font-black">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {r.trait}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold uppercase tracking-wider text-xs rounded transition-colors shadow-lg cursor-pointer"
            >
              Close Sprite Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
