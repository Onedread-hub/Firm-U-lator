/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FirmMemberSprite.tsx
 * Authentic 1990s British Casual Firm Member Animated Pixel-Art Sprite.
 * Renders firm lads with custom club jacket colors, Stone Island badges,
 * denim jeans, and Adidas trainers across 5 distinct motions:
 * - Running (4-frame stride cycle)
 * - Punching (3-frame wind-up, cross punch, impact flash)
 * - Kicking (3-frame boot sweep, high snap kick, speed lines)
 * - Idle / Guard (2-frame bounce on toes, fists up)
 * - Knocked Down (floored on pavement with stars)
 */

import React, { useState, useEffect } from 'react';

export type SpriteMotion = 'idle' | 'running' | 'punching' | 'kicking' | 'knocked_down';
export type SpriteFacing = 'left' | 'right';

export interface FirmMemberSpriteProps {
  motion?: SpriteMotion;
  facing?: SpriteFacing;
  role?: 'top_boy' | 'minder' | 'runner' | 'nutter' | 'face' | string;
  jacketColor?: string;
  trousersColor?: string;
  skinTone?: string;
  hairColor?: string;
  isPlayer?: boolean;
  size?: number; // Height in px (e.g. 48, 64, 80)
  frameIndex?: number; // Optional controlled frame index
  showShadow?: boolean;
  showHitEffect?: boolean;
  className?: string;
}

export const FirmMemberSprite: React.FC<FirmMemberSpriteProps> = ({
  motion = 'idle',
  facing = 'right',
  role = 'minder',
  jacketColor = '#1e3a8a',
  trousersColor = '#1e293b',
  skinTone = '#fed7aa',
  hairColor = '#78350f',
  isPlayer = true,
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
    if (motion === 'punching') intervalMs = 140;
    if (motion === 'kicking') intervalMs = 150;
    if (motion === 'idle') intervalMs = 350;

    const timer = setInterval(() => {
      setInternalFrame(prev => (prev + 1) % 4);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [motion, controlledFrame]);

  const frame = controlledFrame !== undefined ? controlledFrame : internalFrame;
  const isFlipped = facing === 'left';

  // Role accessories
  const isTopBoy = role === 'top_boy';
  const isRunner = role === 'runner';
  const isNutter = role === 'nutter';
  const isFace = role === 'face';

  // Proportions
  const scale = size / 54;
  const svgWidth = Math.round(50 * scale);
  const svgHeight = Math.round(54 * scale);

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
        {/* MOTION 1: IDLE / BOUNCING GUARD STANCE                        */}
        {/* ============================================================== */}
        {motion === 'idle' && (() => {
          const bounceY = (frame % 2) === 1 ? -1 : 0;
          return (
            <g transform={`translate(0, ${bounceY})`}>
              {/* Head & Face */}
              <rect x="22" y="9" width="8" height="9" fill={skinTone} />
              {/* Hair / Cap */}
              {isRunner ? (
                // Bucket hat
                <g>
                  <rect x="20" y="7" width="12" height="4" fill="#0f172a" />
                  <rect x="19" y="10" width="14" height="2" fill="#0f172a" />
                  <rect x="23" y="8" width="2" height="2" fill="#38bdf8" />
                </g>
              ) : isTopBoy ? (
                // Flat cap / quiff
                <g>
                  <rect x="21" y="6" width="10" height="4" fill="#334155" />
                  <rect x="25" y="8" width="8" height="2" fill="#334155" />
                </g>
              ) : isNutter ? (
                // Shaved skinhead with scar
                <g>
                  <rect x="22" y="7" width="8" height="3" fill="#d97706" />
                  <line x1="26" y1="10" x2="28" y2="13" stroke="#dc2626" strokeWidth="1" />
                </g>
              ) : (
                // Casual cut
                <rect x="21" y="6" width="10" height="4" fill={hairColor} />
              )}
              {/* Eyes */}
              <rect x="27" y="11" width="2" height="2" fill="#090d16" />
              {isFace && (
                // Designer sunglasses
                <rect x="25" y="11" width="5" height="2" fill="#020617" />
              )}

              {/* Torso: Tracktop / Harrington / Jacket */}
              <rect x="20" y="18" width="11" height="15" fill={jacketColor} />
              {/* Central zipper line */}
              <line x1="25" y1="18" x2="25" y2="33" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
              {/* Collar */}
              <rect x="21" y="17" width="9" height="2" fill="#0f172a" />

              {/* Stone Island Arm Compass Badge (Left Sleeve) */}
              <rect x="18" y="22" width="3" height="4" fill="#000000" />
              <rect x="19" y="23" width="1" height="2" fill="#facc15" />

              {/* Guard Fists */}
              {/* Back Arm & Fist */}
              <rect x="17" y="20" width="4" height="7" fill={jacketColor} />
              <rect x="18" y="27" width="3" height="3" fill={skinTone} />
              {/* Front Arm & Fist raised in boxer stance */}
              <rect x="28" y="19" width="4" height="6" fill={jacketColor} />
              <rect x="31" y="18" width="4" height="4" fill={skinTone} />

              {/* Trousers: Dark denim / cords */}
              <rect x="21" y="33" width="4" height="12" fill={trousersColor} />
              <rect x="26" y="33" width="4" height="12" fill={trousersColor} />

              {/* Trainers: White Adidas with 3 Stripes */}
              {/* Left foot */}
              <rect x="20" y="45" width="6" height="4" fill="#ffffff" />
              <line x1="22" y1="46" x2="24" y2="46" stroke="#000000" strokeWidth="1" />
              {/* Right foot */}
              <rect x="26" y="45" width="7" height="4" fill="#ffffff" />
              <line x1="28" y1="46" x2="30" y2="46" stroke="#000000" strokeWidth="1" />
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 2: RUNNING SPRINT CYCLE (4 Frames)                     */}
        {/* ============================================================== */}
        {motion === 'running' && (() => {
          const runPhase = frame % 4;
          // Leg offsets across the 4 stride phases
          const leg1Y = runPhase === 0 ? 33 : runPhase === 1 ? 31 : runPhase === 2 ? 35 : 32;
          const leg1X = runPhase === 0 ? 19 : runPhase === 1 ? 16 : runPhase === 2 ? 23 : 26;
          const leg2Y = runPhase === 0 ? 35 : runPhase === 1 ? 32 : runPhase === 2 ? 33 : 30;
          const leg2X = runPhase === 0 ? 25 : runPhase === 1 ? 28 : runPhase === 2 ? 18 : 15;

          const armFrontX = runPhase < 2 ? 31 : 17;
          const armBackX = runPhase < 2 ? 16 : 30;

          return (
            <g transform="translate(1, -1)">
              {/* Torso leaning forward in aggressive sprint */}
              <g transform="rotate(8, 25, 25)">
                {/* Head */}
                <rect x="23" y="8" width="8" height="9" fill={skinTone} />
                <rect x="22" y="6" width="9" height="3" fill={hairColor} />
                <rect x="28" y="10" width="2" height="2" fill="#090d16" />

                {/* Body */}
                <rect x="20" y="17" width="11" height="14" fill={jacketColor} />
                <line x1="25" y1="17" x2="25" y2="31" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

                {/* Badge on sleeve */}
                <rect x="18" y="20" width="3" height="4" fill="#000000" />
                <rect x="19" y="21" width="1" height="2" fill="#facc15" />
              </g>

              {/* Arms pumping */}
              <rect x={armBackX} y="19" width="5" height="5" fill={jacketColor} />
              <rect x={armBackX - 1} y="24" width="3" height="3" fill={skinTone} />

              <rect x={armFrontX} y="18" width="5" height="5" fill={jacketColor} />
              <rect x={armFrontX + 2} y="22" width="3" height="3" fill={skinTone} />

              {/* Left Striding Leg */}
              <rect x={leg1X} y={leg1Y} width="5" height="10" fill={trousersColor} />
              <rect x={leg1X - 1} y={leg1Y + 9} width="7" height="4" fill="#ffffff" />
              <line x1={leg1X + 1} y1={leg1Y + 10} x2={leg1X + 3} y2={leg1Y + 10} stroke="#000000" strokeWidth="1" />

              {/* Right Striding Leg */}
              <rect x={leg2X} y={leg2Y} width="5" height="10" fill={trousersColor} />
              <rect x={leg2X - 1} y={leg2Y + 9} width="7" height="4" fill="#ffffff" />
              <line x1={leg2X + 1} y1={leg2Y + 10} x2={leg2X + 3} y2={leg2Y + 10} stroke="#000000" strokeWidth="1" />

              {/* Dust / Speed Puff Behind Trainer */}
              <circle cx="12" cy="46" r="2" fill="#64748b" opacity="0.6" />
              <circle cx="9" cy="48" r="1.5" fill="#475569" opacity="0.4" />
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 3: PUNCHING MOTION (Wind-up -> Cross -> Impact)       */}
        {/* ============================================================== */}
        {motion === 'punching' && (() => {
          const punchPhase = frame % 3;
          // Phase 0: Windup cocking right fist back
          // Phase 1: Full extended right cross punch!
          // Phase 2: Follow-through recoil
          const fistExtensionX = punchPhase === 1 ? 38 : punchPhase === 2 ? 34 : 28;
          const fistY = punchPhase === 1 ? 19 : 21;
          const bodyLeanX = punchPhase === 1 ? 2 : 0;

          return (
            <g transform={`translate(${bodyLeanX}, 0)`}>
              {/* Head */}
              <rect x="22" y="8" width="8" height="9" fill={skinTone} />
              <rect x="21" y="6" width="9" height="3" fill={hairColor} />
              <rect x="28" y="10" width="2" height="2" fill="#090d16" />

              {/* Torso twisting with the punch */}
              <rect x="19" y="17" width="12" height="15" fill={jacketColor} />
              <line x1="24" y1="17" x2="24" y2="32" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

              {/* Stone Island badge */}
              <rect x="17" y="21" width="3" height="4" fill="#000000" />
              <rect x="18" y="22" width="1" height="2" fill="#facc15" />

              {/* Left Arm guarding jaw */}
              <rect x="19" y="18" width="4" height="6" fill={jacketColor} />
              <rect x="21" y="16" width="3" height="3" fill={skinTone} />

              {/* Right Arm: Explosive Straight Cross Fist */}
              <rect x="28" y={fistY} width={fistExtensionX - 27} height="5" fill={jacketColor} />
              <rect x={fistExtensionX} y={fistY - 1} width="6" height="7" fill={skinTone} />
              {/* Bandaged knuckles */}
              <rect x={fistExtensionX + 2} y={fistY} width="3" height="4" fill="#f8fafc" />

              {/* Impact Flash Spark on Phase 1 */}
              {(punchPhase === 1 || showHitEffect) && (
                <g transform={`translate(${fistExtensionX + 6}, ${fistY - 4})`}>
                  <path
                    d="M 4 0 L 6 3 L 9 2 L 7 5 L 10 7 L 6 7 L 6 10 L 4 7 L 0 8 L 3 5 L 0 2 L 4 3 Z"
                    fill="#facc15"
                  />
                  <circle cx="5" cy="5" r="2.5" fill="#ef4444" />
                </g>
              )}

              {/* Stance Legs braced for punching impact */}
              {/* Back leg braced */}
              <rect x="17" y="32" width="5" height="13" fill={trousersColor} />
              <rect x="14" y="45" width="7" height="4" fill="#ffffff" />
              {/* Front leg driving forward */}
              <rect x="26" y="32" width="5" height="13" fill={trousersColor} />
              <rect x="26" y="45" width="8" height="4" fill="#ffffff" />
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 4: KICKING MOTION (Snap Kick / Boot Strike)            */}
        {/* ============================================================== */}
        {motion === 'kicking' && (() => {
          const kickPhase = frame % 3;
          // Phase 0: Chamber leg up
          // Phase 1: High kick fully extended forward!
          // Phase 2: Snap back
          const isFullKick = kickPhase === 1;
          const kickBootX = isFullKick ? 40 : 33;
          const kickBootY = isFullKick ? 22 : 28;

          return (
            <g transform="translate(-2, 0)">
              {/* Torso leaning backward for counter-balance */}
              <g transform="rotate(-10, 20, 30)">
                {/* Head */}
                <rect x="18" y="8" width="8" height="9" fill={skinTone} />
                <rect x="17" y="6" width="9" height="3" fill={hairColor} />
                <rect x="24" y="10" width="2" height="2" fill="#090d16" />

                {/* Torso */}
                <rect x="16" y="17" width="11" height="15" fill={jacketColor} />
                <line x1="21" y1="17" x2="21" y2="32" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

                {/* Arms thrown back for kick balance */}
                <rect x="11" y="20" width="5" height="5" fill={jacketColor} />
                <rect x="9" y="24" width="3" height="3" fill={skinTone} />
                <rect x="23" y="19" width="4" height="5" fill={jacketColor} />
                <rect x="24" y="23" width="3" height="3" fill={skinTone} />
              </g>

              {/* Planted Standing Leg (braced on ground) */}
              <rect x="17" y="32" width="5" height="14" fill={trousersColor} />
              <rect x="15" y="46" width="8" height="4" fill="#ffffff" />
              <line x1="17" y1="47" x2="19" y2="47" stroke="#000000" strokeWidth="1" />

              {/* Kicking Leg flying through the air */}
              {isFullKick ? (
                // Full horizontal/high snap kick
                <g>
                  {/* Thigh extending forward */}
                  <rect x="23" y="27" width="9" height="6" fill={trousersColor} />
                  {/* Shin and knee */}
                  <rect x="31" y={kickBootY + 2} width="8" height="5" fill={trousersColor} />
                  {/* Adidas Trainer Boot Strike! */}
                  <rect x={kickBootX - 2} y={kickBootY} width="10" height="6" fill="#ffffff" />
                  <rect x={kickBootX + 6} y={kickBootY + 1} width="3" height="4" fill="#18181b" />
                  {/* Iconic Adidas 3 Stripes on Trainer */}
                  <line x1={kickBootX + 1} y1={kickBootY + 1} x2={kickBootX + 1} y2={kickBootY + 5} stroke="#000000" strokeWidth="1" />
                  <line x1={kickBootX + 3} y1={kickBootY + 1} x2={kickBootX + 3} y2={kickBootY + 5} stroke="#000000" strokeWidth="1" />
                  <line x1={kickBootX + 5} y1={kickBootY + 1} x2={kickBootX + 5} y2={kickBootY + 5} stroke="#000000" strokeWidth="1" />

                  {/* High Speed Kick Swoosh Lines */}
                  <path
                    d="M 26 38 C 34 36, 40 30, 44 24"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <path
                    d="M 28 41 C 36 39, 42 33, 46 27"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.8"
                  />

                  {/* Impact Spark at the toe */}
                  <g transform={`translate(${kickBootX + 7}, ${kickBootY - 3})`}>
                    <polygon points="0,3 3,0 4,4 7,2 5,6 8,8 4,7 3,10 2,6" fill="#facc15" />
                    <circle cx="3" cy="4" r="1.5" fill="#f97316" />
                  </g>
                </g>
              ) : (
                // Chambering / recovering kick leg
                <g>
                  <rect x="22" y="29" width="7" height="6" fill={trousersColor} />
                  <rect x="28" y="32" width="6" height="6" fill={trousersColor} />
                  <rect x={kickBootX - 3} y={kickBootY} width="7" height="5" fill="#ffffff" />
                </g>
              )}
            </g>
          );
        })()}

        {/* ============================================================== */}
        {/* MOTION 5: KNOCKED DOWN / FLOORED ON THE DECK                  */}
        {/* ============================================================== */}
        {motion === 'knocked_down' && (
          <g transform="translate(0, 10)">
            {/* Floored Body flat on the ground */}
            {/* Head clutching ground */}
            <rect x="8" y="34" width="8" height="8" fill={skinTone} />
            <rect x="7" y="34" width="3" height="7" fill={hairColor} />
            <line x1="12" y1="37" x2="14" y2="39" stroke="#dc2626" strokeWidth="1" />

            {/* Torso on asphalt */}
            <rect x="16" y="36" width="16" height="8" fill={jacketColor} />
            {/* Stone Island badge */}
            <rect x="18" y="37" width="3" height="3" fill="#000000" />

            {/* Arms sprawled */}
            <rect x="12" y="39" width="5" height="4" fill={jacketColor} />
            <rect x="10" y="42" width="3" height="3" fill={skinTone} />

            {/* Legs sprawled */}
            <rect x="32" y="38" width="12" height="5" fill={trousersColor} />
            {/* White Adidas trainers flat */}
            <rect x="42" y="37" width="5" height="6" fill="#ffffff" />

            {/* Swirling Stars / Birds above head */}
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
