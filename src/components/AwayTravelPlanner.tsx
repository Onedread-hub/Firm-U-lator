import React from 'react';
import { AwayTravelPlan, TransportMode, PubStrategy, ArrivalTiming, Fixture, Firm } from '../types/game';
import { sound } from '../services/sound';
import { Train, Bus, Car, Beer, Clock, Eye, AlertOctagon, Sparkles, DollarSign, ShieldCheck } from 'lucide-react';

interface AwayTravelPlannerProps {
  plan: AwayTravelPlan;
  nextFixture: Fixture | undefined;
  rivalFirm: Firm | undefined;
  treasury: number;
  playerFirmId?: string;
  onUpdatePlan: (plan: AwayTravelPlan) => void;
}

export const AwayTravelPlanner: React.FC<AwayTravelPlannerProps> = ({
  plan,
  nextFixture,
  rivalFirm,
  treasury,
  playerFirmId,
  onUpdatePlan
}) => {
  const isAway = nextFixture?.awayFirmId === playerFirmId;

  const handleSetTransport = (mode: TransportMode) => {
    sound.playClick();
    let cost = 150;
    let stealth = 30;
    let loyalty = 10;
    let heatRisk = 20;

    if (mode === 'train_special') {
      cost = 220;
      stealth = 15;
      loyalty = 20;
      heatRisk = 35;
    } else if (mode === 'chartered_minibus') {
      cost = 320;
      stealth = 45;
      loyalty = 15;
      heatRisk = 20;
    } else if (mode === 'official_coach') {
      cost = 180;
      stealth = 10;
      loyalty = 8;
      heatRisk = 10;
    } else if (mode === 'unmarked_convoy') {
      cost = 450;
      stealth = 70;
      loyalty = 25;
      heatRisk = 15;
    }

    onUpdatePlan({
      ...plan,
      transportMode: mode,
      totalCost: cost + (plan.contrabandSupplies.flares * 25) + (plan.contrabandSupplies.firstAid * 20) + (plan.contrabandSupplies.scoutsAhead ? 80 : 0) + (plan.contrabandSupplies.solicitorOnCall ? 120 : 0),
      stealthBonus: stealth,
      loyaltyImpact: loyalty,
      policeHeatRisk: heatRisk
    });
  };

  const handleSetPub = (pub: PubStrategy) => {
    sound.playClick();
    onUpdatePlan({ ...plan, pubStrategy: pub });
  };

  const handleSetTiming = (timing: ArrivalTiming) => {
    sound.playClick();
    onUpdatePlan({ ...plan, arrivalTiming: timing });
  };

  const handleToggleSupply = (supply: 'scoutsAhead' | 'solicitorOnCall') => {
    sound.playClick();
    const currentVal = plan.contrabandSupplies[supply];
    const newSupplies = { ...plan.contrabandSupplies, [supply]: !currentVal };
    const costDelta = !currentVal ? (supply === 'scoutsAhead' ? 80 : 120) : (supply === 'scoutsAhead' ? -80 : -120);
    onUpdatePlan({
      ...plan,
      contrabandSupplies: newSupplies,
      totalCost: Math.max(100, plan.totalCost + costDelta)
    });
  };

  const handleAdjustFlares = (delta: number) => {
    sound.playClick();
    const newCount = Math.max(0, Math.min(10, plan.contrabandSupplies.flares + delta));
    const countDiff = newCount - plan.contrabandSupplies.flares;
    onUpdatePlan({
      ...plan,
      contrabandSupplies: { ...plan.contrabandSupplies, flares: newCount },
      totalCost: plan.totalCost + countDiff * 25
    });
  };

  const handleAdjustFirstAid = (delta: number) => {
    sound.playClick();
    const newCount = Math.max(0, Math.min(8, plan.contrabandSupplies.firstAid + delta));
    const countDiff = newCount - plan.contrabandSupplies.firstAid;
    onUpdatePlan({
      ...plan,
      contrabandSupplies: { ...plan.contrabandSupplies, firstAid: newCount },
      totalCost: plan.totalCost + countDiff * 20
    });
  };

  return (
    <div className="space-y-6">
      {/* FM 2010 Breadcrumb Header */}
      <div className="bg-[#0d1520] p-3 rounded-t-lg border-b border-[#25394f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#7188a1] font-mono">
            Northwood United &gt; Fixtures &gt; Away Game Travel Logistics
          </div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white font-sans flex items-center gap-2">
            <span>Away Day Logistics</span>
            <span className="text-xs text-amber-400 font-mono font-normal">({isAway ? 'Away Trip' : 'Home Defense'})</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[#64748b]">Total Cost: </span>
            <span className="font-bold text-amber-400 tabular-nums">£{plan.totalCost}</span>
          </div>
          <div>
            <span className="text-[#64748b]">Treasury: </span>
            <span className="font-bold text-emerald-400 tabular-nums">£{treasury}</span>
          </div>
        </div>
      </div>

      {/* Fixture Context Strip */}
      <div className="fm-panel p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
            {isAway ? 'AWAY FIXTURE DEPLOYMENT' : 'HOME FIXTURE DEFENSE DEPLOYMENT'}
          </span>
          <h3 className="text-base font-bold text-white font-sans mt-0.5">
            {nextFixture?.footballFixture || 'Season Matchday'}
          </h3>
          <div className="text-xs text-[#8fa6be] font-mono">
            Destination: {nextFixture?.venueName} ({nextFixture?.location})
          </div>
        </div>

        <div className="text-right font-mono text-xs text-[#8fa6be]">
          <span>Surprise Factor: </span>
          <strong className="text-sky-300">{plan.stealthBonus}% Stealth</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Choices */}
        <div className="lg:col-span-8 space-y-4">
          {/* Step 1: Transport Mode */}
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-4 py-2 flex items-center gap-2 text-xs">
              <Train className="w-4 h-4 text-amber-400" />
              <span>1. Mode of Transport</span>
            </div>

            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#0c141e]">
              {[
                {
                  id: 'train_special',
                  title: 'The Football Special (Rail)',
                  cost: '£220',
                  stealth: 'Low (15%)',
                  loyalty: '+20 Loyalty',
                  desc: 'Pack 80 lads onto the morning train. Unrivalled terrace camaraderie, but British Transport Police wait at the terminus.'
                },
                {
                  id: 'chartered_minibus',
                  title: 'Chartered Minibuses',
                  cost: '£320',
                  stealth: 'Medium (45%)',
                  loyalty: '+15 Loyalty',
                  desc: 'Convoy of 4 unmarked vans. Can divert to motorway service stations for unexpected ambushes before the ground.'
                },
                {
                  id: 'unmarked_convoy',
                  title: 'Sneak Convoy (Private Cars)',
                  cost: '£450',
                  stealth: 'High (70%)',
                  loyalty: '+25 Loyalty',
                  desc: 'Pairs in unmarked cars wearing discrete designer casuals. Infiltrates straight into enemy pub territory undetected.'
                },
                {
                  id: 'official_coach',
                  title: 'Official Supporters Coach',
                  cost: '£180',
                  stealth: 'Zero (10%)',
                  loyalty: '+8 Loyalty',
                  desc: 'Direct police escort from motorway to turnstiles. Safest from street brawls, but zero chance of taking rival pubs.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSetTransport(item.id as TransportMode)}
                  className={`p-3.5 rounded-lg border text-left transition-all font-mono text-xs ${
                    plan.transportMode === item.id
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/50 shadow'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-zinc-100">{item.title}</span>
                    <span className="text-amber-400 font-bold tabular-nums">{item.cost}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{item.desc}</p>
                  <div className="flex gap-3 text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-1.5">
                    <span>Stealth: {item.stealth}</span>
                    <span className="text-emerald-400 font-semibold">{item.loyalty}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pre-Match Watering Hole Strategy */}
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-4 py-2 flex items-center gap-2 text-xs">
              <Beer className="w-4 h-4 text-amber-400" />
              <span>2. Pre-Match Pub &amp; Gathering Territory</span>
            </div>

            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#0c141e]">
              {[
                {
                  id: 'neutral_spoons',
                  name: 'Town Centre Neutral Spoons',
                  rep: '+20 Rep',
                  risk: 'Low Police Presence',
                  desc: 'Cheap pints, quiet mingling. Low chance of rival clash, steady nerve builder.'
                },
                {
                  id: 'enemy_local',
                  name: 'The Enemy Local Stronghold',
                  rep: '+80 Rep (Massive)',
                  risk: 'Extreme Danger & Riot Squad',
                  desc: 'Boldly drink in their territory pub! Massive street reputation if we stand our ground, but expect immediate brawl.'
                },
                {
                  id: 'station_concourse',
                  name: 'Railway Station Vaults Tap',
                  rep: '+45 Rep',
                  risk: 'CCTV Surveillance High',
                  desc: 'Fast railway egress routes. Classic transit battleground where incoming firms meet.'
                },
                {
                  id: 'lock_in_fortress',
                  name: 'Private Hired Backroom',
                  rep: '+30 Rep',
                  risk: 'Zero Infiltration Risk',
                  desc: 'Lock in the entire firm away from public eyes to run final tactical briefings.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSetPub(item.id as PubStrategy)}
                  className={`p-3 rounded-lg border text-left transition-all font-mono text-xs ${
                    plan.pubStrategy === item.id
                      ? 'bg-[#1e3a5f] border-[#3b82f6] text-white ring-1 ring-[#60a5fa] shadow'
                      : 'bg-[#111c29] border-[#22354a] text-[#8fa6be] hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-amber-400 text-[10px] font-bold">{item.rep}</span>
                  </div>
                  <p className="text-[11px] text-[#8fa6be] leading-relaxed mb-2">{item.desc}</p>
                  <div className="text-[10px] text-rose-400 font-semibold">{item.risk}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Arrival Timing */}
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-4 py-2 flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3. Arrival &amp; Operation Timing</span>
            </div>

            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#0c141e] font-mono text-xs">
              {[
                {
                  id: 'dawn_infiltrate',
                  title: 'Dawn Raid (08:30 AM)',
                  desc: 'Arrive hours before police shifts change. Complete surprise.'
                },
                {
                  id: 'midday_march',
                  title: 'Midday March (13:00 PM)',
                  desc: 'Classic matchday march with songs and scarves down the high street.'
                },
                {
                  id: 'post_whistle_rush',
                  title: 'Post-Whistle (16:50 PM)',
                  desc: 'Strike outside away turnstiles as the stadium gates empty.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSetTiming(item.id as ArrivalTiming)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    plan.arrivalTiming === item.id
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-zinc-100 mb-1">{item.title}</div>
                  <div className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Supplies & Logistics Calculations */}
        <div className="lg:col-span-4 space-y-4">
          {/* Contraband Supplies */}
          <div className="fm-panel rounded-lg overflow-hidden">
            <div className="fm-panel-header px-4 py-2 text-xs font-bold text-white">
              Contraband &amp; Logistics Kit
            </div>

            <div className="p-3.5 space-y-3 bg-[#0c141e] text-xs font-mono">
              {/* Flares counter */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Marine Purple Flares</div>
                  <div className="text-[10px] text-[#64748b]">Smoke cover &amp; deterrence (£25/ea)</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustFlares(-1)}
                    className="w-6 h-6 rounded bg-[#172535] hover:bg-[#203348] border border-[#2b415a] text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-amber-400 tabular-nums">
                    {plan.contrabandSupplies.flares}
                  </span>
                  <button
                    onClick={() => handleAdjustFlares(1)}
                    className="w-6 h-6 rounded bg-[#172535] hover:bg-[#203348] border border-[#2b415a] text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* First Aid counter */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Trauma First Aid Bags</div>
                  <div className="text-[10px] text-[#64748b]">Field wound dressing (£20/ea)</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustFirstAid(-1)}
                    className="w-6 h-6 rounded bg-[#172535] hover:bg-[#203348] border border-[#2b415a] text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-emerald-400 tabular-nums">
                    {plan.contrabandSupplies.firstAid}
                  </span>
                  <button
                    onClick={() => handleAdjustFirstAid(1)}
                    className="w-6 h-6 rounded bg-[#172535] hover:bg-[#203348] border border-[#2b415a] text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Scouts Ahead Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1f3044]">
                <div>
                  <div className="font-bold text-slate-200">Spotter Scouts Ahead</div>
                  <div className="text-[10px] text-[#64748b]">Reveals police vans early (£80)</div>
                </div>
                <button
                  onClick={() => handleToggleSupply('scoutsAhead')}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                    plan.contrabandSupplies.scoutsAhead
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#172535] text-slate-400 hover:text-white'
                  }`}
                >
                  {plan.contrabandSupplies.scoutsAhead ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Solicitor on Standby */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1f3044]">
                <div>
                  <div className="font-bold text-slate-200">24/7 Solicitor Standby</div>
                  <div className="text-[10px] text-[#64748b]">Station bail assist (£120)</div>
                </div>
                <button
                  onClick={() => handleToggleSupply('solicitorOnCall')}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                    plan.contrabandSupplies.solicitorOnCall
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#172535] text-slate-400 hover:text-white'
                  }`}
                >
                  {plan.contrabandSupplies.solicitorOnCall ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Travel Metrics Summary Card */}
          <div className="fm-panel rounded-lg overflow-hidden text-xs font-mono">
            <div className="fm-panel-header px-4 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Logistics Intelligence Summary</span>
            </div>

            <div className="p-3.5 space-y-3 bg-[#0c141e]">
              <div>
                <div className="flex justify-between text-[#8fa6be] mb-1">
                  <span>Stealth &amp; Infiltration</span>
                  <span className="font-bold text-white tabular-nums">{plan.stealthBonus}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
                  <div className="h-full bg-purple-500 rounded" style={{ width: `${plan.stealthBonus}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8fa6be] mb-1">
                  <span>Police Heat Risk</span>
                  <span className="font-bold text-rose-400 tabular-nums">{plan.policeHeatRisk}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
                  <div className="h-full bg-rose-500 rounded" style={{ width: `${plan.policeHeatRisk}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8fa6be] mb-1">
                  <span>Estimated Fan Loyalty Morale</span>
                  <span className="font-bold text-emerald-400 tabular-nums">+{plan.loyaltyImpact}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0a1018] rounded overflow-hidden border border-[#1e2f42]">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: `${plan.loyaltyImpact * 4}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-500">
                Lads are locked in for the away day. Tactics applied automatically upon arrival.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
