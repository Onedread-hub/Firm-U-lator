/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AsciiClashViewport.tsx
 * Interactive 3D ASCII Viewport component embedding the SFS asciiLibRenderer
 * directly into Firm U-Lator's matchday clash screen via ClashRendererAdapter.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  ClashRendererAdapter,
  ClashLadInput,
  resolveGroundTexture
} from '../services/clashRendererAdapter';
import { CameraMode, GroundTexture, AsciiCell } from '../renderers/asciiLibRenderer';
import { Firm, Lad, AwayTravelPlan, Tactics } from '../types/game';
import { Camera, Eye, MapPin, ShieldAlert } from 'lucide-react';

interface FighterToken {
  id: string;
  name: string;
  isPlayer: boolean;
  role: string;
  x: number;
  y: number;
  rating: number;
  hp: number;
  maxHp: number;
  bottle: number;
  isPanicking: boolean;
}

interface AsciiClashViewportProps {
  playerFirm: Firm;
  rivalFirm: Firm;
  tactics: Tactics;
  awayPlan: AwayTravelPlan;
  lads: Lad[];
  smokeActive: boolean;
  policeDistance: number;
  minute: number;
  tokens?: FighterToken[];
}

export const AsciiClashViewport: React.FC<AsciiClashViewportProps> = ({
  playerFirm,
  rivalFirm,
  tactics,
  awayPlan,
  lads,
  smokeActive,
  policeDistance,
  minute,
  tokens = []
}) => {
  const [cameraMode, setCameraMode] = useState<CameraMode>('hero');
  const [venueType, setVenueType] = useState<GroundTexture>(() => resolveGroundTexture(awayPlan));

  const [frameCells, setFrameCells] = useState<AsciiCell[][]>([]);
  const [heroTag, setHeroTag] = useState<string>('');
  const adapterRef = useRef<ClashRendererAdapter | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Selected lads for the clash
  const selectedLads = useMemo(() => {
    return lads.filter(l => tactics.selectedLadIds.includes(l.id)).slice(0, 10);
  }, [lads, tactics.selectedLadIds]);

  // Identify Top Boy / Hero
  const topBoyLad = useMemo(() => {
    return selectedLads.find(l => l.role === 'top_boy') || selectedLads[0];
  }, [selectedLads]);

  useEffect(() => {
    if (topBoyLad) {
      setHeroTag(topBoyLad.name);
    }
  }, [topBoyLad]);

  // Initialize or re-create adapter when dimensions or venue change
  useEffect(() => {
    const adapter = new ClashRendererAdapter(84, 26, cameraMode);
    adapterRef.current = adapter;

    return () => {
      adapterRef.current = null;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Update camera mode in adapter
  useEffect(() => {
    if (adapterRef.current) {
      adapterRef.current.setCameraMode(cameraMode);
    }
  }, [cameraMode]);

  // Continuous 60fps render loop driven by requestAnimationFrame
  useEffect(() => {
    const renderLoop = () => {
      if (!adapterRef.current) return;

      // Construct ClashLadInput array from live tokens or fallback to squad layout
      let ladInputs: ClashLadInput[] = [];

      if (tokens && tokens.length > 0) {
        ladInputs = tokens.map(tok => ({
          id: tok.id,
          name: tok.name,
          isPlayer: tok.isPlayer,
          role: tok.role,
          xPercent: tok.x,
          yPercent: tok.y,
          hp: tok.hp,
          maxHp: tok.maxHp,
          bottle: tok.bottle,
          isPanicking: tok.isPanicking
        }));
      } else {
        // Fallback initial squad placement if tokens haven't spawned yet
        selectedLads.forEach((lad, i) => {
          ladInputs.push({
            id: lad.id,
            name: lad.name,
            isPlayer: true,
            role: lad.role,
            xPercent: 30 + (i % 4) * 12,
            yPercent: 35 + Math.floor(i / 4) * 10,
            hp: 100,
            maxHp: 100,
            bottle: 85,
            isPanicking: false
          });
        });

        for (let r = 0; r < 7; r++) {
          ladInputs.push({
            id: `rival_${r}`,
            name: `Rival Casual #${r + 1}`,
            isPlayer: false,
            role: r === 0 ? 'top_boy' : r < 3 ? 'minder' : 'runner',
            xPercent: 35 + (r % 4) * 12,
            yPercent: 65 + Math.floor(r / 4) * 10,
            hp: 100,
            maxHp: 100,
            bottle: 80,
            isPanicking: false
          });
        }
      }

      const frame = adapterRef.current.renderFrame({
        lads: ladInputs,
        venueType,
        cameraMode,
        smokeActive,
        policeDistance,
        minute,
        playerFirm,
        rivalFirm,
        heroLadId: topBoyLad?.id
      });

      setFrameCells(frame.cells);

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [tokens, venueType, cameraMode, smokeActive, policeDistance, minute, playerFirm, rivalFirm, topBoyLad, selectedLads]);

  return (
    <div className="fm-panel rounded-lg overflow-hidden border border-[#1e2f42] bg-[#070b12] text-xs">
      {/* Top 3D Viewport Controls Bar (Preserved HUD) */}
      <div className="bg-[#0b121b] border-b border-[#1e2f42] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>SFS ASCII 3D RENDERER</span>
          </span>
          <span className="text-[#475569]">·</span>
          <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
            60 FPS PINHOLE
          </span>
        </div>

        {/* Camera Selector */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Eye className="w-3 h-3" /> Cam:
          </span>
          <button
            type="button"
            onClick={() => setCameraMode('hero')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              cameraMode === 'hero'
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-[#141e2e] text-slate-300 border-[#233549] hover:bg-[#1a283e]'
            }`}
          >
            Hero (Top Boy)
          </button>
          <button
            type="button"
            onClick={() => setCameraMode('broadcast')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              cameraMode === 'broadcast'
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-[#141e2e] text-slate-300 border-[#233549] hover:bg-[#1a283e]'
            }`}
          >
            Broadcast
          </button>
          <button
            type="button"
            onClick={() => setCameraMode('follow')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              cameraMode === 'follow'
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-[#141e2e] text-slate-300 border-[#233549] hover:bg-[#1a283e]'
            }`}
          >
            Follow
          </button>
        </div>

        {/* Venue Surface Selector */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3" /> Venue:
          </span>
          <select
            value={venueType}
            onChange={(e) => setVenueType(e.target.value as GroundTexture)}
            className="bg-[#141e2e] text-amber-300 border border-[#233549] rounded px-1.5 py-0.5 text-[10px]"
          >
            <option value="cobblestone">High Street Cobbles</option>
            <option value="railway_station">Station Platform & Rails</option>
            <option value="pub_carpet">Sticky Pub Carpet</option>
            <option value="pitch">Match Pitch Slab</option>
          </select>
        </div>
      </div>

      {/* The 3D ASCII Viewport Canvas */}
      <div className="relative p-2 bg-[#04070d] overflow-x-auto">
        {/* Smoke Screen Overlay */}
        {smokeActive && (
          <div className="absolute inset-2 bg-purple-950/50 backdrop-blur-xs flex items-center justify-center pointer-events-none z-10">
            <span className="text-purple-200 text-xs font-bold tracking-widest bg-black/85 px-3 py-1 rounded border border-purple-500 animate-pulse">
              PURPLE MARINE FLARE SMOKE DEPLOYED
            </span>
          </div>
        )}

        {/* Police Vanguard Warning Banner */}
        {policeDistance < 40 && (
          <div className="absolute top-4 right-4 bg-rose-950/85 border border-rose-500 text-rose-200 px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 shadow-lg z-10 animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>MET POLICE TACTICAL RIOT SQUAD AT END OF ALLEY</span>
          </div>
        )}

        {/* ASCII Cell Grid View */}
        <pre className="font-mono text-[9px] sm:text-[10px] leading-[9px] sm:leading-[10px] select-none tracking-normal font-bold whitespace-pre m-0 p-1 bg-[#03060a] rounded border border-[#172333]">
          {frameCells.map((row, rIdx) => (
            <div key={`row_${rIdx}`} className="whitespace-pre">
              {row.map((cell, cIdx) => (
                <span
                  key={`c_${rIdx}_${cIdx}`}
                  style={{
                    color: cell.fg,
                    backgroundColor: cell.bg !== '#090d14' ? cell.bg : undefined
                  }}
                >
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </pre>

        {/* HUD Sub-Bar (Preserved) */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
          <div className="flex items-center gap-3">
            <span>
              <span className="text-amber-400 font-bold">Pinhole Camera:</span> {cameraMode.toUpperCase()}
            </span>
            <span>·</span>
            <span>
              <span className="text-blue-400 font-bold">Hero Focus:</span> {heroTag || 'Top Boy'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Raycast Plane: Y=0</span>
            <span className="text-[#475569]">|</span>
            <span className="text-emerald-400 font-bold">Capsule LOD: 3-Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
