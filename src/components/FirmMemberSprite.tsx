/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FirmMemberSprite.tsx
 * Highfields (1980-2010) Subculture Animated Pixel-Art Sprite.
 * Renders authentic character models across 8 distinct factions:
 * - Rastas (dreadlocks, green/gold/red tam hat, roots denim vest)
 * - Punks (spiky mohawk, studded leather jacket, tartan trousers, Doc Martens)
 * - New Age Travellers (knit poncho, festival headband, patchwork trousers)
 * - Hippies (wavy hair, tie-dye peace shirt, circular glasses, flared jeans)
 * - Artists (beret, paint-splattered coat, megaphone/stencil)
 * - Bikers (skull bandana, heavy beard, leather cuts with chains, biker boots)
 * - Casuals (Stone Island / Fila tracktop, bucket hat, adidas trainers)
 * - Police (Riot helmet with visor, stab vest, round riot shield, truncheon)
 * 
 * Across 5 distinct motions:
 * - Idle / Guard / Dance
 * - Running / Charging
 * - Punching / Strike (with impact spark)
 * - Kicking / Boot Sweep (with speed swoosh)
 * - Knocked Down / Subdued (floored with stars)
 */

import React, { useState, useEffect } from 'react';
import { SubcultureType } from '../types/diplomacy';

export type SpriteMotion = 'idle' | 'running' | 'punching' | 'kicking' | 'knocked_down';
export type SpriteFacing = 'left' | 'right';

export interface FirmMemberSpriteProps {
  motion?: SpriteMotion;
  facing?: SpriteFacing;
  role?: string;
  subculture?: SubcultureType;
  jacketColor?: string;
  trousersColor?: string;
  skinTone?: string;
  hairColor?: string;
  isPlayer?: boolean;
  size?: number; // Height in px (e.g. 48, 64, 80)
  frameIndex?: number;
  showShadow?: boolean;
  showHitEffect?: boolean;
  className?: string;
}

export const FirmMemberSprite: React.FC<FirmMemberSpriteProps> = ({
  motion = 'idle',
  facing = 'right',
  role = 'minder',
  subculture = 'casual',
  jacketColor,
  trousersColor,
  skinTone = '#fed7aa',
  hairColor = '#78350f',
  size = 54,
  frameIndex: controlledFrame,
  showShadow = true,
  showHitEffect = false,
  className = ''
}) => {
  const [internalFrame, setInternalFrame] = useState<number>(0);

  // Automatic frame tick if not externally controlled
  useEffect(() => {
    if (controlledFrame !== undefined) return;

    let intervalMs = 180;
    if (motion === 'running') intervalMs = 120;
    if (motion === 'punching') intervalMs = 130;
    if (motion === 'kicking') intervalMs = 140;
    if (motion === 'idle') intervalMs = 350;

    const timer = setInterval(() => {
      setInternalFrame(prev => (prev + 1) % 4);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [motion, controlledFrame]);

  const frame = controlledFrame !== undefined ? controlledFrame : internalFrame;
  const isFlipped = facing === 'left';

  // Subculture defaults
  const isPolice = subculture === 'police';
  const isRasta = subculture === 'rasta';
  const isPunk = subculture === 'punk';
  const isTraveller = subculture === 'traveller';
  const isHippie = subculture === 'hippie';
  const isArtist = subculture === 'artist';
  const isBiker = subculture === 'biker';
  const isCasual = subculture === 'casual';

  // Dynamic colors based on subculture
  const resolvedJacket = jacketColor || (
    isPolice ? '#1e293b' :
    isRasta ? '#15803d' :
    isPunk ? '#18181b' :
    isTraveller ? '#854d0e' :
    isHippie ? '#9333ea' :
    isArtist ? '#0284c7' :
    isBiker ? '#334155' :
    '#1e3a8a'
  );

  const resolvedTrousers = trousersColor || (
    isPolice ? '#0f172a' :
    isRasta ? '#1e293b' :
    isPunk ? '#b91c1c' : // Red tartan
    isTraveller ? '#451a03' :
    isHippie ? '#1d4ed8' : // Bell bottom blue
    isArtist ? '#1e293b' :
    isBiker ? '#09090b' : // Leather black
    '#1e293b'
  );

  const resolvedSkin = isRasta ? '#78350f' : skinTone;

  // Proportions
  const scale = size / 54;
  const svgWidth = Math.round(50 * scale);
  const svgHeight = Math.round(54 * scale);

  // Subculture Headwear Component
  const renderHeadwear = (headX: number, headY: number) => {
    if (isPolice) {
      // Riot helmet with clear visor
      return (
        <g>
          {/* Helmet Dome */}
          <rect x={headX - 1} y={headY - 4} width="10" height="6" fill="#0f172a" />
          <rect x={headX} y={headY - 5} width="8" height="2" fill="#1e293b" />
          {/* Visor */}
          <rect x={headX + 4} y={headY - 1} width="6" height="6" fill="#38bdf8" opacity="0.6" />
          <line x1={headX + 5} y1={headY + 1} x2={headX + 9} y2={headY + 1} stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          {/* Chin strap */}
          <line x1={headX + 1} y1={headY + 6} x2={headX + 4} y2={headY + 8} stroke="#0f172a" strokeWidth="1" />
        </g>
      );
    }

    if (isRasta) {
      // Knitted Tam Hat (Green, Gold, Red) + Dreads
      return (
        <g>
          {/* Tam Hat */}
          <rect x={headX - 2} y={headY - 6} width="12" height="3" fill="#15803d" />
          <rect x={headX - 1} y={headY - 3} width="11" height="2" fill="#facc15" />
          <rect x={headX} y={headY - 1} width="10" height="2" fill="#dc2626" />
          {/* Dreads flowing behind neck */}
          <rect x={headX - 3} y={headY} width="3" height="10" fill="#18181b" />
          <rect x={headX - 2} y={headY + 3} width="2" height="9" fill="#18181b" />
        </g>
      );
    }

    if (isPunk) {
      // Tall neon spiked mohawk
      return (
        <g>
          <polygon points={`${headX + 2},${headY - 7} ${headX + 4},${headY - 1} ${headX},${headY - 1}`} fill="#ec4899" />
          <polygon points={`${headX + 5},${headY - 9} ${headX + 7},${headY - 1} ${headX + 3},${headY - 1}`} fill="#22c55e" />
          <polygon points={`${headX + 8},${headY - 6} ${headX + 10},${headY - 1} ${headX + 6},${headY - 1}`} fill="#ec4899" />
          {/* Shaved temple line */}
          <line x1={headX} y1={headY + 1} x2={headX + 3} y2={headY + 1} stroke="#000000" strokeWidth="1" />
        </g>
      );
    }

    if (isBiker) {
      // Skull bandana + bushy beard
      return (
        <g>
          {/* Bandana */}
          <rect x={headX - 1} y={headY - 2} width="10" height="4" fill="#18181b" />
          <circle cx={headX + 4} cy={headY} r="1" fill="#ffffff" />
          {/* Heavy Beard */}
          <rect x={headX + 2} y={headY + 5} width="6" height="5" fill="#451a03" />
        </g>
      );
    }

    if (isHippie) {
      // Long flowing hair + round glasses
      return (
        <g>
          <rect x={headX - 1} y={headY - 2} width="10" height="4" fill="#a16207" />
          <rect x={headX - 3} y={headY + 1} width="3" height="10" fill="#a16207" />
          <circle cx={headX + 5} cy={headY + 3} r="1.5" stroke="#facc15" strokeWidth="0.8" fill="none" />
        </g>
      );
    }

    if (isArtist) {
      // French black beret
      return (
        <g>
          <ellipse cx={headX + 4} cy={headY - 1} rx="6" ry="2.5" fill="#09090b" />
          <circle cx={headX + 4} cy={headY - 3} r="1" fill="#09090b" />
        </g>
      );
    }

    if (isTraveller) {
      // Festival headband & loose hair
      return (
        <g>
          <rect x={headX - 1} y={headY - 2} width="10" height="3" fill="#a16207" />
          <rect x={headX - 1} y={headY + 1} width="10" height="2" fill="#14b8a6" />
          <rect x={headX - 2} y={headY + 3} width="3" height="7" fill="#a16207" />
        </g>
      );
    }

    // Casual: Flat cap or bucket hat or classic 80s quiff
    if (role === 'runner') {
      return (
        <g>
          <rect x={headX - 1} y={headY - 3} width="11" height="4" fill="#0f172a" />
          <rect x={headX - 2} y={headY} width="13" height="2" fill="#0f172a" />
        </g>
      );
    }
    return (
      <rect x={headX} y={headY - 3} width="9" height="4" fill={hairColor} />
    );
  };

  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{
        width: svgWidth,
        height: svgHeight,
        transform: isFlipped ? 'scaleX(-1)' : 'none'
      }}
    >
      <svg
        viewBox="0 0 50 54"
        width={svgWidth}
        height={svgHeight}
        className="overflow-visible"
        shapeRendering="crispEdges"
      >
        {/* Ground Contact Shadow */}
        {showShadow && motion !== 'knocked_down' && (
          <ellipse
            cx="25"
            cy="50"
            rx={motion === 'kicking' ? '14' : motion === 'running' ? '12' : '10'}
            ry="3.5"
            fill="rgba(0,0,0,0.4)"
          />
        )}

        {/* ============================================================== */}
        {/* MOTION 1: IDLE / GUARD / DANCE STANCE                          */}
        {/* ============================================================== */}
        {motion === 'idle' && (() => {
          const bounceY = (frame % 2) === 1 ? -1 : 0;
          return (
            <g transform={`translate(0, ${bounceY})`}>
              {/* Head & Face */}
              <rect x="22" y="9" width="8" height="9" fill={resolvedSkin} />
              {renderHeadwear(22, 9)}
              {/* Eye */}
              <rect x="27" y="12" width="2" height="2" fill="#090d16" />

              {/* Torso / Jacket */}
              <rect x="19" y="18" width="12" height="15" fill={resolvedJacket} />
              <line x1="25" y1="18" x2="25" y2="33" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

              {/* Subculture Torso Insignia */}
              {isPolice && (
                <g>
                  {/* High-vis / POLICE badge */}
                  <rect x="20" y="21" width="10" height="3" fill="#38bdf8" />
                  <text x="21" y="23.5" fontSize="3" fontWeight="bold" fill="#000000">POL</text>
                  {/* Round Riot Shield held in front */}
                  <circle cx="15" cy="26" r="8" fill="#94a3b8" opacity="0.7" stroke="#334155" strokeWidth="1.5" />
                  <circle cx="15" cy="26" r="3" fill="#64748b" opacity="0.8" />
                </g>
              )}
              {isRasta && (
                <rect x="17" y="22" width="3" height="4" fill="#facc15" />
              )}
              {isPunk && (
                <g>
                  {/* Studs */}
                  <circle cx="21" cy="20" r="0.8" fill="#ffffff" />
                  <circle cx="28" cy="20" r="0.8" fill="#ffffff" />
                  <circle cx="21" cy="24" r="0.8" fill="#ffffff" />
                </g>
              )}
              {isBiker && (
                <rect x="17" y="21" width="4" height="4" fill="#000000" />
              )}
              {isCasual && (
                // Stone Island sleeve badge
                <g>
                  <rect x="17" y="22" width="3" height="4" fill="#000000" />
                  <rect x="18" y="23" width="1" height="2" fill="#facc15" />
                </g>
              )}

              {/* Arms / Hands */}
              {!isPolice && (
                <g>
                  <rect x="16" y="20" width="4" height="7" fill={resolvedJacket} />
                  <rect x="17" y="27" width="3" height="3" fill={resolvedSkin} />
                  <rect x="28" y="19" width="4" height="6" fill={resolvedJacket} />
                  <rect x="31" y="18" width="4" height="4" fill={resolvedSkin} />
                </g>
              )}
              {isPolice && (
                // Holding truncheon
                <g>
                  <line x1="31" y1="20" x2="35" y2="12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {/* Trousers */}
              <rect x="21" y="33" width="4" height="12" fill={resolvedTrousers} />
              <rect x="26" y="33" width="4" height="12" fill={resolvedTrousers} />

              {/* Footwear */}
              <rect x="20" y="45" width="6" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />
              <rect x="26" y="45" width="7" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />
              {isCasual && (
                <g>
                  <line x1="22" y1="46" x2="24" y2="46" stroke="#000000" strokeWidth="1" />
                  <line x1="28" y1="46" x2="30" y2="46" stroke="#000000" strokeWidth="1" />
                </g>
              )}
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 2: RUNNING / CHARGING SPRINT (4 Frames)                */}
        {/* ============================================================== */}
        {motion === 'running' && (() => {
          const runPhase = frame % 4;
          const leg1Y = runPhase === 0 ? 33 : runPhase === 1 ? 31 : runPhase === 2 ? 35 : 32;
          const leg1X = runPhase === 0 ? 19 : runPhase === 1 ? 16 : runPhase === 2 ? 23 : 26;
          const leg2Y = runPhase === 0 ? 35 : runPhase === 1 ? 32 : runPhase === 2 ? 33 : 30;
          const leg2X = runPhase === 0 ? 25 : runPhase === 1 ? 28 : runPhase === 2 ? 18 : 15;

          return (
            <g transform="translate(1, -1)">
              {/* Leaning forward in sprint */}
              <g transform="rotate(8, 25, 25)">
                <rect x="23" y="8" width="8" height="9" fill={resolvedSkin} />
                {renderHeadwear(23, 8)}
                <rect x="28" y="10" width="2" height="2" fill="#090d16" />

                <rect x="20" y="17" width="11" height="14" fill={resolvedJacket} />
                <line x1="25" y1="17" x2="25" y2="31" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              </g>

              {/* Arms pumping */}
              <rect x={runPhase < 2 ? 16 : 30} y="19" width="5" height="5" fill={resolvedJacket} />
              <rect x={runPhase < 2 ? 31 : 17} y="18" width="5" height="5" fill={resolvedJacket} />

              {/* Legs */}
              <rect x={leg1X} y={leg1Y} width="5" height="10" fill={resolvedTrousers} />
              <rect x={leg1X - 1} y={leg1Y + 9} width="7" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />

              <rect x={leg2X} y={leg2Y} width="5" height="10" fill={resolvedTrousers} />
              <rect x={leg2X - 1} y={leg2Y + 9} width="7" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />

              {/* Speed dust puffs */}
              <circle cx="11" cy="47" r="2" fill="#64748b" opacity="0.6" />
              <circle cx="8" cy="49" r="1.5" fill="#475569" opacity="0.4" />
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 3: PUNCHING / STRIKE MOTION                            */}
        {/* ============================================================== */}
        {motion === 'punching' && (() => {
          const punchPhase = frame % 3;
          const fistExtensionX = punchPhase === 1 ? 38 : punchPhase === 2 ? 34 : 28;
          const fistY = punchPhase === 1 ? 19 : 21;

          return (
            <g transform={`translate(${punchPhase === 1 ? 2 : 0}, 0)`}>
              {/* Head */}
              <rect x="22" y="8" width="8" height="9" fill={resolvedSkin} />
              {renderHeadwear(22, 8)}
              <rect x="28" y="10" width="2" height="2" fill="#090d16" />

              {/* Torso */}
              <rect x="19" y="17" width="12" height="15" fill={resolvedJacket} />

              {/* Strike Hand / Truncheon */}
              {isPolice ? (
                <g>
                  {/* Truncheon swing forward */}
                  <rect x="28" y={fistY} width={fistExtensionX - 25} height="4" fill="#1e293b" />
                  <line x1={fistExtensionX} y1={fistY} x2={fistExtensionX + 8} y2={fistY - 4} stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* Devastating straight punch */}
                  <rect x="28" y={fistY} width={fistExtensionX - 27} height="5" fill={resolvedJacket} />
                  <rect x={fistExtensionX} y={fistY - 1} width="6" height="7" fill={resolvedSkin} />
                </g>
              )}

              {/* Impact Flash Spark on Phase 1 */}
              {(punchPhase === 1 || showHitEffect) && (
                <g transform={`translate(${fistExtensionX + 7}, ${fistY - 4})`}>
                  <path
                    d="M 4 0 L 6 3 L 9 2 L 7 5 L 10 7 L 6 7 L 6 10 L 4 7 L 0 8 L 3 5 L 0 2 L 4 3 Z"
                    fill="#facc15"
                  />
                  <circle cx="5" cy="5" r="2.5" fill="#ef4444" />
                </g>
              )}

              {/* Braced Stance Legs */}
              <rect x="17" y="32" width="5" height="13" fill={resolvedTrousers} />
              <rect x="14" y="45" width="7" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />
              <rect x="26" y="32" width="5" height="13" fill={resolvedTrousers} />
              <rect x="26" y="45" width="8" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 4: KICKING / BOOT SWEEP                                */}
        {/* ============================================================== */}
        {motion === 'kicking' && (() => {
          const kickPhase = frame % 3;
          const isFullKick = kickPhase === 1;
          const kickBootX = isFullKick ? 40 : 33;
          const kickBootY = isFullKick ? 22 : 28;

          return (
            <g transform="translate(-2, 0)">
              {/* Torso counter-leaning */}
              <g transform="rotate(-10, 20, 30)">
                <rect x="18" y="8" width="8" height="9" fill={resolvedSkin} />
                {renderHeadwear(18, 8)}
                <rect x="24" y="10" width="2" height="2" fill="#090d16" />
                <rect x="16" y="17" width="11" height="15" fill={resolvedJacket} />
              </g>

              {/* Planted Standing Leg */}
              <rect x="17" y="32" width="5" height="14" fill={resolvedTrousers} />
              <rect x="15" y="46" width="8" height="4" fill={isCasual ? '#ffffff' : '#0f172a'} />

              {/* Kicking Flying Leg */}
              {isFullKick ? (
                <g>
                  <rect x="23" y="27" width="9" height="6" fill={resolvedTrousers} />
                  <rect x="31" y={kickBootY + 2} width="8" height="5" fill={resolvedTrousers} />
                  <rect x={kickBootX - 2} y={kickBootY} width="10" height="6" fill={isCasual ? '#ffffff' : '#0f172a'} />

                  {/* High Speed Kick Swoosh Lines */}
                  <path
                    d="M 26 38 C 34 36, 40 30, 44 24"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  {/* Impact Spark at the toe */}
                  <g transform={`translate(${kickBootX + 7}, ${kickBootY - 3})`}>
                    <polygon points="0,3 3,0 4,4 7,2 5,6 8,8 4,7 3,10 2,6" fill="#facc15" />
                    <circle cx="3" cy="4" r="1.5" fill="#f97316" />
                  </g>
                </g>
              ) : (
                <g>
                  <rect x="22" y="29" width="7" height="6" fill={resolvedTrousers} />
                  <rect x="28" y="32" width="6" height="6" fill={resolvedTrousers} />
                  <rect x={kickBootX - 3} y={kickBootY} width="7" height="5" fill={isCasual ? '#ffffff' : '#0f172a'} />
                </g>
              )}
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 5: KNOCKED DOWN / SUBDUED                              */}
        {/* ============================================================== */}
        {motion === 'knocked_down' && (
          <g transform="translate(0, 10)">
            <rect x="8" y="34" width="8" height="8" fill={resolvedSkin} />
            <rect x="7" y="34" width="3" height="7" fill={hairColor} />
            <line x1="12" y1="37" x2="14" y2="39" stroke="#dc2626" strokeWidth="1" />

            <rect x="16" y="36" width="16" height="8" fill={resolvedJacket} />
            <rect x="12" y="39" width="5" height="4" fill={resolvedJacket} />
            <rect x="10" y="42" width="3" height="3" fill={resolvedSkin} />

            <rect x="32" y="38" width="12" height="5" fill={resolvedTrousers} />
            <rect x="42" y="37" width="5" height="6" fill={isCasual ? '#ffffff' : '#0f172a'} />

            {/* Swirling Stars */}
            <g transform="translate(10, 24)">
              <text x="0" y="0" fontSize="8" fill="#facc15">✦</text>
              <text x="8" y="-2" fontSize="6" fill="#facc15">✦</text>
              <text x="14" y="2" fontSize="7" fill="#facc15">✦</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
