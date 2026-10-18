import React, { useState, useEffect, useRef } from 'react';
import { Firm, Fixture, Lad, Tactics, AwayTravelPlan, ClashOutcome } from '../types/game';
import { sound } from '../services/sound';
import { Shield, Flame, Crosshair, Play, FastForward, Siren, Activity, BarChart2, Terminal, Layers } from 'lucide-react';
import { AsciiClashViewport } from './AsciiClashViewport';

interface ClashEngineProps {
  playerFirm: Firm;
  rivalFirm: Firm;
  fixture: Fixture;
  tactics: Tactics;
  awayPlan: AwayTravelPlan;
  lads: Lad[];
  onCompleteClash: (outcome: ClashOutcome) => void;
  onCancel: () => void;
}

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

export const ClashEngine: React.FC<ClashEngineProps> = ({
  playerFirm,
  rivalFirm,
  fixture,
  tactics,
  awayPlan,
  lads,
  onCompleteClash,
  onCancel
}) => {
  const [minute, setMinute] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [logs, setLogs] = useState<{ id: string; min: number; text: string; type: 'player' | 'rival' | 'police' | 'shout' }[]>([]);

  // Team Meters
  const [playerTeamHp, setPlayerTeamHp] = useState<number>(100);
  const [rivalTeamHp, setRivalTeamHp] = useState<number>(100);
  const [playerBottle, setPlayerBottle] = useState<number>(85 + awayPlan.loyaltyImpact);
  const [rivalBottle, setRivalBottle] = useState<number>(rivalFirm.tacticsProfile.baseBottle);
  const [flaresLeft, setFlaresLeft] = useState<number>(awayPlan.contrabandSupplies.flares);
  const [smokeActive, setSmokeActive] = useState<boolean>(false);
  const [policeDistance, setPoliceDistance] = useState<number>(100);
  const [activeShout, setActiveShout] = useState<string | null>(null);

  // Fighter Tokens
  const [tokens, setTokens] = useState<FighterToken[]>([]);
  const [displayMode, setDisplayMode] = useState<'ascii_3d' | 'tactical_2d'>('ascii_3d');

  const isResolvedRef = useRef<boolean>(false);

  useEffect(() => {
    sound.playCheer();
    const initialTokens: FighterToken[] = [];
    const selectedLads = lads.filter(l => tactics.selectedLadIds.includes(l.id)).slice(0, 8);

    selectedLads.forEach((lad, idx) => {
      initialTokens.push({
        id: lad.id,
        name: `${lad.name.split(' ')[0]} ("${lad.nickname}")`,
        isPlayer: true,
        role: lad.role,
        x: 30 + (idx % 4) * 14,
        y: 60 + Math.floor(idx / 4) * 16,
        rating: 6.8 + Math.floor(Math.random() * 4) * 0.1,
        hp: lad.health,
        maxHp: lad.maxHealth,
        bottle: lad.bottle,
        isPanicking: false
      });
    });

    for (let i = 0; i < 8; i++) {
      initialTokens.push({
        id: `rival_${i}`,
        name: `Rival #${i + 1}`,
        isPlayer: false,
        role: i < 3 ? 'minder' : i < 6 ? 'nutter' : 'runner',
        x: 25 + (i % 4) * 15,
        y: 22 + Math.floor(i / 4) * 14,
        rating: 6.7,
        hp: 100,
        maxHp: 100,
        bottle: rivalFirm.tacticsProfile.baseBottle,
        isPanicking: false
      });
    }

    setTokens(initialTokens);

    setLogs([
      {
        id: 'start_1',
        min: 0,
        text: `Matchday standoff underway at ${fixture.venueName}.`,
        type: 'shout'
      },
      {
        id: 'start_2',
        min: 1,
        text: `${playerFirm.name} lining up in [${tactics.formation.toUpperCase().replace('_', ' ')}].`,
        type: 'player'
      },
      {
        id: 'start_3',
        min: 2,
        text: `${rivalFirm.name} surge around the corner in full colors!`,
        type: 'rival'
      }
    ]);
  }, []);

  // Tick simulation
  useEffect(() => {
    if (!isRunning || isResolvedRef.current) return;

    const intervalTime = Math.max(100, 750 / speed);
    const timer = setInterval(() => {
      setMinute(prevMin => {
        const nextMin = prevMin + 1;
        tickClashRound(nextMin);
        return nextMin;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, speed, playerTeamHp, rivalTeamHp, policeDistance, smokeActive]);

  const tickClashRound = (currentMin: number) => {
    if (isResolvedRef.current) return;

    // Police ETA reduction
    const policeArrivalSpeed = (awayPlan.policeHeatRisk / 28) + 0.9;
    setPoliceDistance(prev => {
      const nextDist = Math.max(0, prev - policeArrivalSpeed);
      if (nextDist <= 30 && nextDist > 25) {
        sound.playSiren();
        addLog(currentMin, '🚨 Police Tactical Support Units are 2 minutes out from the high street!', 'police');
      }
      if (nextDist <= 5) {
        resolveMatch('police_dispersed', currentMin);
      }
      return nextDist;
    });

    // Check Victory / Defeat
    if (playerTeamHp <= tactics.retreatThreshold || playerBottle <= 15) {
      resolveMatch(rivalFirm.id, currentMin);
      return;
    }
    if (rivalTeamHp <= 20 || rivalBottle <= 15) {
      resolveMatch(playerFirm.id, currentMin);
      return;
    }
    if (currentMin >= 90) {
      resolveMatch('draw', currentMin);
      return;
    }

    // Token movement on 2D pitch
    setTokens(prevTokens => {
      return prevTokens.map(tok => {
        let jitterX = (Math.random() - 0.5) * 4;
        let jitterY = (Math.random() - 0.5) * 3;

        if (tok.isPlayer && !tok.isPanicking) {
          jitterY -= 0.6;
        } else if (!tok.isPlayer && !tok.isPanicking) {
          jitterY += 0.6;
        }

        return {
          ...tok,
          x: Math.max(10, Math.min(90, tok.x + jitterX)),
          y: Math.max(15, Math.min(85, tok.y + jitterY))
        };
      });
    });

    // Combat Events
    if (currentMin % 4 === 0) {
      sound.playHit();
      const playerLadsActive = lads.filter(l => tactics.selectedLadIds.includes(l.id));
      const randomLad = playerLadsActive[Math.floor(Math.random() * playerLadsActive.length)] || lads[0];

      const strikeRoll = Math.random() * 100;

      if (strikeRoll > 45) {
        // Player strikes
        const dmg = Math.floor(6 + Math.random() * 8);
        setRivalTeamHp(p => Math.max(0, p - dmg));
        setRivalBottle(b => Math.max(0, b - 5));

        // Boost lad rating
        setTokens(prev => prev.map(t => t.id === randomLad.id ? { ...t, rating: Math.min(9.8, t.rating + 0.2) } : t));

        const narratives = [
          `${randomLad.name.split(' ')[0]} ("${randomLad.nickname}") floors an incoming runner with a devastating right hook!`,
          `Frontline collision: ${playerFirm.name} drive forward with crushing force!`,
          `${randomLad.nickname} breaks through their defense! Rival front row stumbles back!`,
          `Chorus of terrace anthems from our lads! Rival bottle visibly shaken!`
        ];
        addLog(currentMin, narratives[Math.floor(Math.random() * narratives.length)], 'player');
      } else {
        // Rival strikes
        const dmg = Math.floor(5 + Math.random() * 7);
        setPlayerTeamHp(p => Math.max(0, p - dmg));
        setPlayerBottle(b => Math.max(0, b - 4));

        const rivalNarratives = [
          `Counter-charge from ${rivalFirm.name}! Our Minders absorb heavy contact!`,
          `Pint glasses shatter against the pavement! Shards scatter across the asphalt!`,
          `Rival firm surges into the pocket, putting pressure on our center!`,
          `Scuffle in the alleyway! Lads exchange heavy blows!`
        ];
        addLog(currentMin, rivalNarratives[Math.floor(Math.random() * rivalNarratives.length)], 'rival');
      }
    }
  };

  const addLog = (min: number, text: string, type: 'player' | 'rival' | 'police' | 'shout') => {
    setLogs(prev => [
      { id: `${Date.now()}_${Math.random()}`, min, text, type },
      ...prev.slice(0, 30)
    ]);
  };

  const handleShout = (type: 'push' | 'hold' | 'target_top_boy' | 'flare' | 'retreat') => {
    if (isResolvedRef.current) return;
    sound.playWhistle();

    if (type === 'push') {
      setActiveShout('PUSH THE LINE!');
      addLog(minute, `SHOUT: "FORWARD! STEP INTO 'EM! DON'T LET 'EM BREATHE!"`, 'shout');
      setRivalBottle(b => Math.max(0, b - 8));
      setRivalTeamHp(h => Math.max(0, h - 10));
    } else if (type === 'hold') {
      setActiveShout('HOLD THE GROUND!');
      addLog(minute, `SHOUT: "LOCK ARMS! DIG YOUR HEELS IN! NOBODY RUNS!"`, 'shout');
      setPlayerBottle(b => Math.min(100, b + 12));
    } else if (type === 'target_top_boy') {
      setActiveShout('TARGET THEIR TOP BOY!');
      addLog(minute, `SHOUT: "PUT THEIR LEADER ON THE DECK!"`, 'shout');
      setRivalBottle(b => Math.max(0, b - 15));
      setRivalTeamHp(h => Math.max(0, h - 12));
    } else if (type === 'flare') {
      if (flaresLeft <= 0) return;
      sound.playFlare();
      setFlaresLeft(f => f - 1);
      setSmokeActive(true);
      setActiveShout('PURPLE FLARE IGNITED!');
      addLog(minute, `🔥 PURPLE MARINE FLARE IGNITED! Smoke blankets the entire street!`, 'shout');
      setTimeout(() => setSmokeActive(false), 8000);
    } else if (type === 'retreat') {
      sound.playWhistle();
      addLog(minute, `WHISTLE: "SCATTER! DOWN THE ALLEY! GET TO THE TRAIN!"`, 'shout');
      resolveMatch(rivalFirm.id, minute, true);
    }

    setTimeout(() => setActiveShout(null), 3000);
  };

  const resolveMatch = (winner: string | 'draw' | 'police_dispersed', finalMin: number, voluntaryRetreat = false) => {
    if (isResolvedRef.current) return;
    isResolvedRef.current = true;
    setIsRunning(false);

    let respectChange = 0;
    let loyaltyChange = 0;
    let treasuryChange = 0;
    let headline = '';
    let quote = '';
    const activeLads = lads.filter(l => tactics.selectedLadIds.includes(l.id));
    const injuredList: string[] = [];
    const arrestList: string[] = [];

    if (winner === playerFirm.id) {
      sound.playCheer();
      respectChange = fixture.isDerby ? 95 : 65;
      loyaltyChange = 15;
      treasuryChange = 280;
      headline = `TERRACE SUPREMACY: ${playerFirm.name.toUpperCase()} DOMINATE ${rivalFirm.name.toUpperCase()}`;
      quote = `"Rival firm broke ranks and retreated down the station approach."`;
    } else if (winner === 'police_dispersed') {
      sound.playSiren();
      respectChange = 20;
      loyaltyChange = 5;
      treasuryChange = -100;
      headline = `RIOT POLICE DISPERSE MASS PITCHED CLASH AT ${fixture.location.toUpperCase()}`;
      quote = `"Tactical units with dogs and shields broke up the confrontation outside the station."`;
      if (Math.random() > 0.4) {
        const victim = activeLads[Math.floor(Math.random() * activeLads.length)];
        if (victim) arrestList.push(victim.name);
      }
    } else if (winner === 'draw') {
      respectChange = 30;
      loyaltyChange = 8;
      treasuryChange = 50;
      headline = `STALEMATE: NEITHER FIRM YIELDS IN ${fixture.location.toUpperCase()}`;
      quote = `"Both lines held their ground until sirens echoed across the borough."`;
    } else {
      respectChange = -35;
      loyaltyChange = voluntaryRetreat ? -5 : -15;
      treasuryChange = -150;
      headline = voluntaryRetreat
        ? `${playerFirm.name.toUpperCase()} EXECUTE TACTICAL DISPERSAL`
        : `${rivalFirm.name.toUpperCase()} CLAIM TERRACE VICTORY OVER ${playerFirm.name.toUpperCase()}`;
      quote = `"Several supporters treated for injuries following brutal street melee."`;
      const victim = activeLads[Math.floor(Math.random() * activeLads.length)];
      if (victim) injuredList.push(victim.name);
    }

    const outcome: ClashOutcome = {
      winnerId: winner,
      playerFirmName: playerFirm.name,
      rivalFirmName: rivalFirm.name,
      roundsFought: finalMin,
      playerInjuries: injuredList,
      rivalInjuries: winner === playerFirm.id ? ['2 rival fighters hospitalized'] : [],
      arrests: arrestList,
      respectDelta: respectChange,
      loyaltyDelta: loyaltyChange,
      treasuryDelta: treasuryChange,
      headline,
      matchNarrative: logs.map(l => `${l.min}' ${l.text}`),
      newspaperQuote: quote
    };

    setTimeout(() => {
      onCompleteClash(outcome);
    }, 1200);
  };

  return (
    <div className="space-y-3 font-mono select-none">
      {/* Top FM 2010 Matchday Header */}
      <div className="fm-panel rounded-lg overflow-hidden">
        <div className="fm-panel-header px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold">{fixture.venueName}</span>
            <span>·</span>
            <span className="text-slate-300">Round {fixture.round}</span>
            <span>·</span>
            <span className="text-[#93c5fd]">{fixture.footballFixture}</span>
          </div>

          {/* Time Scrubber & Speed Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0b121b] border border-[#233549] px-3 py-1 rounded text-center">
              <span className="text-amber-400 font-black text-sm tabular-nums">{minute}:00</span>
            </div>

            <div className="flex items-center gap-1 bg-[#0b121b] p-0.5 rounded border border-[#233549]">
              <button
                onClick={() => setSpeed(1)}
                className={`px-2 py-0.5 text-xs rounded ${speed === 1 ? 'bg-amber-400 text-black font-bold' : 'text-slate-400'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={`px-2 py-0.5 text-xs rounded ${speed === 2 ? 'bg-amber-400 text-black font-bold' : 'text-slate-400'}`}
              >
                2x
              </button>
              <button
                onClick={() => setSpeed(5)}
                className={`px-2 py-0.5 text-xs rounded ${speed === 5 ? 'bg-amber-400 text-black font-bold' : 'text-slate-400'}`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>

        {/* Live Score & Meter Bar */}
        <div className="p-3 bg-[#0d1622] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Player Firm */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{playerFirm.name}</span>
              <span className="font-bold text-emerald-400 tabular-nums">{playerTeamHp}% Resolve</span>
            </div>
            <div className="h-2 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
              <div className="h-full bg-emerald-500 rounded transition-all duration-300" style={{ width: `${playerTeamHp}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748b]">
              <span>Bottle: {playerBottle}%</span>
              <span>Flares: {flaresLeft}</span>
            </div>
          </div>

          {/* Police Vanguard Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-rose-400 font-bold">
              <span className="flex items-center gap-1">
                <Siren className="w-3.5 h-3.5 animate-pulse" />
                <span>Met Police Riot Squad ETA</span>
              </span>
              <span className="tabular-nums">{Math.round(policeDistance)}%</span>
            </div>
            <div className="h-2 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
              <div className="h-full bg-rose-500 rounded transition-all duration-300" style={{ width: `${100 - policeDistance}%` }} />
            </div>
            <div className="text-[10px] text-center text-[#64748b]">
              {policeDistance < 30 ? 'SIRENS BLARING AT JUNCTION!' : 'Patrols closing in'}
            </div>
          </div>

          {/* Rival Firm */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-rose-400 text-sm">{rivalFirm.name}</span>
              <span className="font-bold text-rose-400 tabular-nums">{rivalTeamHp}% Resolve</span>
            </div>
            <div className="h-2 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
              <div className="h-full bg-rose-600 rounded transition-all duration-300" style={{ width: `${rivalTeamHp}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748b]">
              <span>Bottle: {rivalBottle}%</span>
              <span>Formation: Holding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Screen: FM 2010 Split Pitch & Ratings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left: Tactical Viewport with 3D ASCII / 2D Tactical Switch */}
        <div className="lg:col-span-7 space-y-2">
          {/* Viewport Mode Switcher Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>MELEE MATCH VIEWPORT</span>
            </span>
            <div className="flex items-center gap-1 bg-[#0b121b] p-0.5 rounded border border-[#233549]">
              <button
                type="button"
                onClick={() => setDisplayMode('ascii_3d')}
                className={`px-2.5 py-1 text-[10px] rounded font-bold flex items-center gap-1 transition-all ${
                  displayMode === 'ascii_3d'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>SFS 3D ASCII</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('tactical_2d')}
                className={`px-2.5 py-1 text-[10px] rounded font-bold flex items-center gap-1 transition-all ${
                  displayMode === 'tactical_2d'
                    ? 'bg-emerald-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>2D Tactical Pitch</span>
              </button>
            </div>
          </div>

          {displayMode === 'ascii_3d' ? (
            <AsciiClashViewport
              playerFirm={playerFirm}
              rivalFirm={rivalFirm}
              tactics={tactics}
              awayPlan={awayPlan}
              lads={lads}
              smokeActive={smokeActive}
              policeDistance={policeDistance}
              minute={minute}
            />
          ) : (
            <div className="fm-panel rounded-lg overflow-hidden">
              <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#143d1f] via-[#1b4d27] to-[#143d1f] border-2 border-[#1e4a2a] overflow-hidden shadow-inner">
                {/* Pitch markings */}
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20" />

                {/* Smoke Screen */}
                {smokeActive && (
                  <div className="absolute inset-0 bg-purple-900/50 backdrop-blur-xs animate-pulse pointer-events-none z-10 flex items-center justify-center">
                    <span className="text-purple-200 text-xs font-bold tracking-widest bg-black/80 px-3 py-1 rounded border border-purple-500">
                      PURPLE SMOKE SCREEN DEPLOYED
                    </span>
                  </div>
                )}

                {/* Tokens */}
                {tokens.map(tok => (
                  <div
                    key={tok.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 z-20"
                    style={{ left: `${tok.x}%`, top: `${tok.y}%` }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg border-2 ${
                        tok.isPlayer
                          ? 'bg-amber-400 text-black border-black'
                          : 'bg-rose-600 text-white border-black'
                      }`}
                    >
                      {tok.name.charAt(0)}
                    </div>
                    <div className="text-[9px] mt-0.5 px-1 rounded bg-black/80 text-white whitespace-nowrap border border-white/20">
                      {tok.name}
                    </div>
                  </div>
                ))}

                {/* Active Shout Notification */}
                {activeShout && (
                  <div className="absolute bottom-4 inset-x-0 flex justify-center z-30">
                    <div className="bg-amber-400 text-black font-black text-xs px-4 py-1.5 rounded shadow-xl uppercase tracking-wider animate-bounce">
                      {activeShout}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Touchline Shouts FM Toolbar */}
          <div className="p-2.5 bg-[#0d1622] border-t border-[#1f3044] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Manager Shouts:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleShout('push')}
                className="px-2.5 py-1 bg-[#1b2b3d] hover:bg-[#253d58] text-amber-300 border border-[#304a69] rounded font-bold transition-all text-xs"
              >
                Push Line!
              </button>
              <button
                onClick={() => handleShout('hold')}
                className="px-2.5 py-1 bg-[#1b2b3d] hover:bg-[#253d58] text-sky-300 border border-[#304a69] rounded font-bold transition-all text-xs"
              >
                Hold Ground!
              </button>
              <button
                onClick={() => handleShout('target_top_boy')}
                className="px-2.5 py-1 bg-[#1b2b3d] hover:bg-[#253d58] text-rose-300 border border-[#304a69] rounded font-bold transition-all text-xs"
              >
                Target Top Boy!
              </button>
              <button
                onClick={() => handleShout('flare')}
                disabled={flaresLeft <= 0}
                className={`px-2.5 py-1 rounded font-bold transition-all text-xs border ${
                  flaresLeft > 0
                    ? 'bg-purple-950 hover:bg-purple-900 text-purple-200 border-purple-600'
                    : 'bg-[#0f1722] text-[#475569] border-[#1e293b] cursor-not-allowed'
                }`}
              >
                Pop Flare ({flaresLeft})
              </button>
              <button
                onClick={() => handleShout('retreat')}
                className="px-2.5 py-1 bg-[#0b121b] hover:bg-rose-950 text-slate-400 hover:text-rose-200 border border-[#243548] rounded font-bold transition-all text-xs"
              >
                Disperse!
              </button>
            </div>
          </div>
        </div>

        {/* Right: FM 2010 Player Ratings & Match Stats Split */}
        <div className="lg:col-span-5 space-y-3">
          {/* FM Ratings Table */}
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-3 py-1.5 text-xs flex justify-between items-center">
              <span>Player Ratings ({playerFirm.shortName})</span>
              <span className="text-[10px] text-amber-400">Matchday Form</span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-[#1e2f42]/60 text-xs">
              {tokens.filter(t => t.isPlayer).map(tok => (
                <div key={tok.id} className="p-2 flex items-center justify-between hover:bg-[#152332]">
                  <div>
                    <span className="font-bold text-slate-200">{tok.name}</span>
                    <span className="text-[10px] text-[#64748b] ml-1.5 capitalize">({tok.role})</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold tabular-nums ${
                      tok.rating >= 7.5
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : tok.rating >= 7.0
                        ? 'bg-sky-950 text-sky-400 border border-sky-700'
                        : 'bg-[#15202d] text-slate-300'
                    }`}
                  >
                    {tok.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Scrolling FM Commentary Feed */}
          <div className="fm-panel rounded-lg overflow-hidden flex flex-col h-48">
            <div className="fm-panel-header px-3 py-1.5 text-xs flex justify-between items-center">
              <span>Match Commentary</span>
              <span className="text-[10px] text-slate-400">FM 2010 Match Engine</span>
            </div>
            <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-xs bg-[#0b121b]">
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded border text-[11px] ${
                    log.type === 'player'
                      ? 'bg-[#132335] border-[#254261] text-amber-200'
                      : log.type === 'rival'
                      ? 'bg-[#121924] border-[#1e2b3c] text-slate-300'
                      : log.type === 'police'
                      ? 'bg-rose-950/60 border-rose-800 text-rose-200 font-bold'
                      : 'bg-[#1b2b3d] border-[#304a69] text-white font-bold'
                  }`}
                >
                  <span className="text-amber-400 font-bold mr-1.5">{log.min}'</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
