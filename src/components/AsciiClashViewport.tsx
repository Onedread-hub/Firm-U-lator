/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AsciiClashViewport.tsx
 * Interactive 3D ASCII Viewport component embedding the SFS asciiLibRenderer
 * directly into Firm U-Lator's matchday clash screen.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ClashRendererEngine, ClashFrameData } from '../services/clashRenderer';
import { CameraMode, GroundTexture, AsciiCell } from '../renderers/asciiLibRenderer';
import { Firm, Lad, AwayTravelPlan, Tactics } from '../types/game';
import { Camera, Eye, MapPin, Sparkles, ShieldAlert } from 'lucide-react';

interface AsciiClashViewportProps {
  playerFirm: Firm;
  rivalFirm: Firm;
  tactics: Tactics;
  awayPlan: AwayTravelPlan;
  lads: Lad[];
  smokeActive: boolean;
  policeDistance: number;
  minute: number;
}

export const AsciiClashViewport: React.FC<AsciiClashViewportProps> = ({
  playerFirm,
  rivalFirm,
  tactics,
  awayPlan,
  lads,
  smokeActive,
  policeDistance,
  minute
}) => {
  const [cameraMode, setCameraMode] = useState<CameraMode>('hero');
  const [venueType, setVenueType] = useState<GroundTexture>(() => {
    if (awayPlan.transportMode === 'train_special') return 'railway_station';
    if (awayPlan.pubStrategy === 'enemy_local' || awayPlan.pubStrategy === 'lock_in_fortress') return 'pub_carpet';
    return 'cobblestone';
  });

  const [frameText, setFrameText] = useState<string>('');
  const [frameCells, setFrameCells] = useState<AsciiCell[][]>([]);
  const [heroTag, setHeroTag] = useState<string>('');
  const engineRef = useRef<ClashRendererEngine | null>(null);

  // Initialize 3D Engine on mount or when venue changes
  useEffect(() => {
    const engine = new ClashRendererEngine({
      venueType,
      cameraMode,
      terminalWidth: 84,
      terminalHeight: 26,
      playerPrimaryColor: playerFirm.primaryColor || '#3b82f6',
      rivalPrimaryColor: rivalFirm.primaryColor || '#ef4444'
    });

    // Spawn Player Lads
    const selectedLads = lads.filter(l => tactics.selectedLadIds.includes(l.id)).slice(0, 7);
    selectedLads.forEach((lad, i) => {
      const offsetX = -3.5 + (i % 4) * 2.2;
      const offsetZ = -3.0 + Math.floor(i / 4) * 2.5;
      engine.spawnCasual(
        lad.id,
        lad.name,
        true,
        lad.role as any,
        { x: offsetX, y: 0, z: offsetZ },
        playerFirm.primaryColor || '#1e3a8a',
        '#0f172a'
      );
    });

    // Spawn Rival Lads
    for (let r = 0; r < 7; r++) {
      const offsetX = -3.0 + (r % 4) * 2.0;
      const offsetZ = 3.5 + Math.floor(r / 4) * 2.2;
      engine.spawnCasual(
        `rival_${r}`,
        `Rival Casual #${r + 1}`,
        false,
        r === 0 ? 'top_boy' : r < 3 ? 'minder' : 'runner',
        { x: offsetX, y: 0, z: offsetZ },
        rivalFirm.primaryColor || '#991b1b',
        '#1e293b'
      );
    }

    // Set Top Boy hero focus
    const topBoy = selectedLads.find(l => l.role === 'top_boy') || selectedLads[0];
    if (topBoy) {
      engine.setHeroFocus(topBoy.id);
      setHeroTag(topBoy.name);
    }

    engineRef.current = engine;

    // Render initial frame
    const frame = engine.renderSingleFrame();
    setFrameText(frame.renderedText);
    setFrameCells(engine.blitter.getBuffer().map(row => [...row]));

    // Start 60 FPS animation loop
    engine.start();

    const unsubscribe = engine.subscribe((data: ClashFrameData) => {
      setFrameText(data.renderedText);
      setFrameCells(engine.blitter.getBuffer().map(row => [...row]));
    });

    return () => {
      unsubscribe();
      engine.stop();
      engineRef.current = null;
    };
  }, [venueType, playerFirm.id, rivalFirm.id]);

  // Sync camera mode changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCameraMode(cameraMode);
    }
  }, [cameraMode]);

  // Sync smoke flare deployment
  useEffect(() => {
    if (smokeActive && engineRef.current) {
      engineRef.current.deployPurpleFlare({ x: 0, y: 0, z: 0.5 });
    }
  }, [smokeActive]);

  // Sync police squad spawn when police ETA is low
  useEffect(() => {
    if (policeDistance < 35 && engineRef.current) {
      if (!engineRef.current.entities.some(e => e.isPolice)) {
        engineRef.current.spawnPoliceSquad(3, 16.0);
      }
    }
  }, [policeDistance]);

  return (
    <div className="fm-panel rounded-lg overflow-hidden border border-[#1e2f42] bg-[#070b12] text-xs">
      {/* Top 3D Viewport Controls Bar */}
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
        {policeDistance < 35 && (
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

        {/* HUD Sub-Bar */}
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
