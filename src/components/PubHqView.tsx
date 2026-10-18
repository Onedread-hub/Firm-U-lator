import React, { useState } from 'react';
import { Firm, TerritoryLocation, Lad } from '../types/game';
import { Shield, Home, DollarSign, Users, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { sound } from '../services/sound';

interface PubHqViewProps {
  playerFirm: Firm;
  territories: TerritoryLocation[];
  treasury: number;
  lads: Lad[];
  onUpgradeTerritory: (terrId: string, cost: number) => void;
  onRecruitLad: (newLad: Lad, cost: number) => void;
  onPurchaseUpgrade: (name: string, cost: number) => void;
}

export const PubHqView: React.FC<PubHqViewProps> = ({
  playerFirm,
  territories,
  treasury,
  lads,
  onUpgradeTerritory,
  onRecruitLad,
  onPurchaseUpgrade
}) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFortify = (terr: TerritoryLocation) => {
    const cost = 250;
    if (treasury < cost) {
      showToast(`Not enough funds (£${cost} needed).`);
      return;
    }
    sound.playClick();
    onUpgradeTerritory(terr.id, cost);
    showToast(`Fortified ${terr.name}! Defense level increased.`);
  };

  const handleRecruitCasual = () => {
    const cost = 120;
    if (treasury < cost) {
      showToast(`Not enough funds (£${cost} needed for recruitment & track tops).`);
      return;
    }
    sound.playCheer();

    const firstNames = ['Callum', 'Declan', 'Liam', 'Bradley', 'Ryan', 'Kieran', 'Ronnie', 'Harvey'];
    const nicknames = ['Razor', 'Pint', 'Screamer', 'Bale', 'Boots', 'Shadow', 'Sparky', 'Guvnor'];
    const traits = [
      { name: 'Street Fighter', description: 'Gains strike bonus in narrow alleyways.', statBonus: { hardness: 6 } },
      { name: 'Loud Voice', description: 'Terrace chants bolster firm morale.', statBonus: { bottle: 8 } },
      { name: 'Sprinter', description: 'Quick on the flanks.', statBonus: { pace: 9 } }
    ];

    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const nn = nicknames[Math.floor(Math.random() * nicknames.length)];
    const trait = traits[Math.floor(Math.random() * traits.length)];

    const roles: Array<'minder' | 'runner' | 'nutter' | 'face'> = ['minder', 'runner', 'nutter', 'face'];
    const assignedRole = roles[Math.floor(Math.random() * roles.length)];

    const newLad: Lad = {
      id: `lad_${Date.now()}`,
      name: `${fn} Miller`,
      nickname: nn,
      role: assignedRole,
      hardness: 65 + Math.floor(Math.random() * 15),
      bottle: 70 + Math.floor(Math.random() * 15),
      pace: 72 + Math.floor(Math.random() * 16),
      streetSmarts: 65 + Math.floor(Math.random() * 18),
      loyalty: 88,
      stamina: 80,
      health: 100,
      maxHealth: 100,
      legalHeat: 10,
      status: 'active',
      trait,
      matchesFought: 0,
      victories: 0,
      avatarSeed: fn.toLowerCase()
    };

    onRecruitLad(newLad, cost);
    showToast(`Recruited ${newLad.name} "${newLad.nickname}" to the firm!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold uppercase tracking-tight font-mono text-zinc-100 flex items-center gap-2">
          <Home className="w-5 h-5 text-amber-400" />
          <span>The Stronghold: {playerFirm.pubStronghold}</span>
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-0.5">
          Territory defense network, pub lock-in headquarters, revenue streams, and new recruit initiation.
        </p>
      </div>

      {toast && (
        <div className="p-3 bg-amber-950/80 border border-amber-600 rounded text-xs text-amber-200 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Pub Exterior Visual Banner */}
      <div className="relative overflow-hidden rounded-lg fm-panel shadow-xl">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src="/src/assets/images/firm_pub_exterior_1792261606604.jpg"
            alt="British Corner Pub Headquarters"
            className="w-full h-full object-cover object-center brightness-70"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c141e] via-[#0c141e]/50 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                Terrace Stronghold &amp; Fortress
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans uppercase mt-0.5">
                {playerFirm.pubStronghold}
              </h3>
              <p className="text-xs text-[#9bb3cc] font-mono max-w-lg">
                The fortified meeting place where travel plans are drawn up and pints are poured before matchday.
              </p>
            </div>

            <button
              onClick={handleRecruitCasual}
              className="px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider rounded transition-all whitespace-nowrap shadow flex items-center gap-2 shrink-0 border border-amber-300"
            >
              <Users className="w-4 h-4" />
              <span>Recruit Casual (£120)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Territories & Upgrades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Territory Control Points */}
        <div className="lg:col-span-7 fm-panel rounded-lg overflow-hidden">
          <div className="fm-panel-header px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Territorial Strongholds ({territories.filter(t => t.controlledBy === playerFirm.id).length}/{territories.length})</span>
            </span>
            <span className="text-emerald-400 font-bold">
              Weekly Yield: +£{territories.filter(t => t.controlledBy === playerFirm.id).reduce((acc, t) => acc + t.weeklyRevenue, 0)}
            </span>
          </div>

            <div className="space-y-3">
              {territories.map(terr => {
                const isControlled = terr.controlledBy === playerFirm.id;

                return (
                  <div
                    key={terr.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isControlled
                        ? 'bg-zinc-950/80 border-amber-500/50'
                        : 'bg-zinc-950/40 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-100 text-sm">{terr.name}</span>
                          {isControlled ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800 font-bold">
                              HELD BY FIRM
                            </span>
                          ) : (
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-bold">
                              CONTESTED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          {terr.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-emerald-400 font-bold tabular-nums">+£{terr.weeklyRevenue}/wk</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Def Level: {terr.defenseLevel}/5</div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">
                        Bonus: <strong className="text-amber-300">{terr.strategicBonus}</strong>
                      </span>

                      {isControlled && terr.defenseLevel < 5 && (
                        <button
                          onClick={() => handleFortify(terr)}
                          className="px-2.5 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 rounded transition-colors font-bold"
                        >
                          Fortify Defenses (£250)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: HQ Operations & Facilities */}
          <div className="lg:col-span-5 fm-panel rounded-lg overflow-hidden font-mono text-xs">
            <div className="fm-panel-header px-4 py-2 text-xs font-bold text-white">
              HQ Facilities &amp; Infrastructure
            </div>

            <div className="p-3.5 space-y-3 bg-[#0c141e]">
              {[
                {
                  title: 'Underground Heavy Bag Boxing Gym',
                  cost: 350,
                  desc: 'Installed in the pub cellar. All squad lads gain +1 Hardness every matchday.',
                  active: true
                },
                {
                  title: 'Terrace Scarf & Vintage Merch Press',
                  cost: 280,
                  desc: 'Prints limited silk-weave terrace badges and bar scarves. Yields +£140 weekly.',
                  active: true
                },
                {
                  title: 'Retained Crown Court Solicitor Pool',
                  cost: 400,
                  desc: 'Experienced solicitors on retainer automatically reduce firm police heat by 5% every week.',
                  active: false
                },
                {
                  title: 'Railway Station Spotter Network',
                  cost: 320,
                  desc: 'Lookouts stationed at northern mainlines give 100% scouting accuracy on enemy travel plans.',
                  active: false
                }
              ].map((fac, idx) => (
                <div key={idx} className="p-3 bg-[#0d1622] rounded border border-[#1f3044] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{fac.title}</span>
                    {fac.active ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        OPERATIONAL
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (treasury < fac.cost) {
                            showToast(`Need £${fac.cost} to construct.`);
                            return;
                          }
                          sound.playClick();
                          onPurchaseUpgrade(fac.title, fac.cost);
                          showToast(`Constructed ${fac.title}!`);
                        }}
                        className="px-2.5 py-1 text-[10px] bg-amber-400 hover:bg-amber-300 text-black font-bold rounded transition-colors"
                      >
                        Build £{fac.cost}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8fa6be] leading-relaxed">{fac.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
