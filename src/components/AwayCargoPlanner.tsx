/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AwayCargoPlanner.tsx
 * The Black Market Cargo & Travel Subsystem.
 * Buy up to 50 units of goods, select transport routes,
 * and trigger police stop travel events.
 */

import React, { useState } from 'react';
import { CargoManifest, TradingItem, TravelRoute, TravelEvent } from '../types/trading';
import { TRAVEL_EVENTS } from '../data/tradingData';
import { sound } from '../services/sound';
import { Package, Truck, Train, Navigation, AlertTriangle, ShieldCheck, DollarSign, Flame, Store, CheckCircle, RefreshCw } from 'lucide-react';

interface AwayCargoPlannerProps {
  manifest: CargoManifest;
  treasury: number;
  awayCityName: string;
  onUpdateManifest: (updated: CargoManifest) => void;
  onDeductTreasury: (amount: number, reason: string) => boolean;
  onAddTreasury: (amount: number) => void;
  onOpenMarket: () => void;
}

export const AwayCargoPlanner: React.FC<AwayCargoPlannerProps> = ({
  manifest,
  treasury,
  awayCityName,
  onUpdateManifest,
  onDeductTreasury,
  onAddTreasury,
  onOpenMarket
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Bootleg' | 'Contraband' | 'Premium'>('All');
  const [eventAlert, setEventAlert] = useState<TravelEvent | null>(manifest.lastTravelEvent || null);

  const totalCarriedUnits = manifest.items.reduce((acc, it) => acc + it.quantity, 0);
  const remainingCapacity = Math.max(0, manifest.maxCapacity - totalCarriedUnits);
  const totalCargoValue = manifest.items.reduce((acc, it) => acc + (it.buyPrice * it.quantity), 0);
  const totalPotentialProfit = manifest.items.reduce((acc, it) => acc + ((it.sellPrice - it.buyPrice) * it.quantity), 0);

  // Buy item
  const handleBuyItem = (itemId: string, count: number) => {
    const item = manifest.items.find(i => i.id === itemId);
    if (!item) return;

    const actualCount = Math.min(count, remainingCapacity);
    if (actualCount <= 0) return;

    const totalCost = item.buyPrice * actualCount;
    if (treasury < totalCost) {
      sound.playHit();
      return;
    }

    if (!onDeductTreasury(totalCost, `Purchased ${actualCount}x ${item.name}`)) {
      return;
    }

    sound.playClick();
    const updatedItems = manifest.items.map(it => {
      if (it.id === itemId) {
        return { ...it, quantity: it.quantity + actualCount };
      }
      return it;
    });

    onUpdateManifest({
      ...manifest,
      items: updatedItems,
      totalUnits: totalCarriedUnits + actualCount
    });
  };

  // Sell/Remove item before travel
  const handleRemoveItem = (itemId: string, count: number) => {
    const item = manifest.items.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return;

    const actualCount = Math.min(count, item.quantity);
    const refund = item.buyPrice * actualCount;

    sound.playClick();
    onAddTreasury(refund);

    const updatedItems = manifest.items.map(it => {
      if (it.id === itemId) {
        return { ...it, quantity: it.quantity - actualCount };
      }
      return it;
    });

    onUpdateManifest({
      ...manifest,
      items: updatedItems,
      totalUnits: Math.max(0, totalCarriedUnits - actualCount)
    });
  };

  // Change route
  const handleSelectRoute = (route: TravelRoute) => {
    sound.playClick();
    onUpdateManifest({
      ...manifest,
      route,
      travelEventTriggered: false
    });
    setEventAlert(null);
  };

  // Trigger Travel Event
  const handleDepartAndTriggerEvent = () => {
    sound.playWhistle();
    const routeEvents = TRAVEL_EVENTS[manifest.route] || TRAVEL_EVENTS.motorway;
    const randomEvent = routeEvents[Math.floor(Math.random() * routeEvents.length)];

    let updatedItems = [...manifest.items];
    let lostUnits = 0;

    // Apply cargo losses if police seized goods
    if (randomEvent.cargoLostQuantity > 0) {
      sound.playHit();
      let toRemove = randomEvent.cargoLostQuantity;
      updatedItems = updatedItems.map(it => {
        if (it.quantity > 0 && toRemove > 0) {
          const removed = Math.min(it.quantity, toRemove);
          toRemove -= removed;
          lostUnits += removed;
          return { ...it, quantity: it.quantity - removed };
        }
        return it;
      });
    }

    // Apply treasury penalty if bribe or fine was paid
    if (randomEvent.treasuryDelta < 0) {
      onDeductTreasury(Math.abs(randomEvent.treasuryDelta), randomEvent.title);
    }

    const nextHeat = Math.max(0, Math.min(100, manifest.awayCityHeat + randomEvent.heatDelta));

    const updatedManifest: CargoManifest = {
      ...manifest,
      items: updatedItems,
      totalUnits: Math.max(0, totalCarriedUnits - lostUnits),
      awayCityHeat: nextHeat,
      travelEventTriggered: true,
      lastTravelEvent: randomEvent
    };

    onUpdateManifest(updatedManifest);
    setEventAlert(randomEvent);
  };

  const filteredItems = activeCategory === 'All'
    ? manifest.items
    : manifest.items.filter(it => it.type === activeCategory);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Manifest Overview Bar */}
      <div className="fm-panel p-4 rounded-lg bg-[#0c141e] border border-[#213347] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Black Market Smuggling Cargo (Max 50 Units)</span>
          </span>
          <h3 className="text-base font-bold text-white font-sans mt-0.5">
            Terrace Bootleg & Contraband Manifest
          </h3>
          <p className="text-[11px] text-slate-400">
            Transport illicit 1990s goods to {awayCityName} for massive cash profits. Watch out for police roadblocks.
          </p>
        </div>

        {/* Meters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-[#121c29] border border-[#25394f] px-3 py-1.5 rounded">
            <div className="text-[10px] text-slate-400">Cargo Stowed:</div>
            <div className="font-bold text-amber-400 text-sm">
              {totalCarriedUnits} / {manifest.maxCapacity} units
            </div>
          </div>

          <div className="bg-[#121c29] border border-[#25394f] px-3 py-1.5 rounded">
            <div className="text-[10px] text-slate-400">Potential Profit:</div>
            <div className="font-bold text-emerald-400 text-sm">
              +£{totalPotentialProfit}
            </div>
          </div>

          <div className="bg-[#121c29] border border-[#25394f] px-3 py-1.5 rounded">
            <div className="text-[10px] text-slate-400">Away City Heat:</div>
            <div className={`font-bold text-sm flex items-center gap-1 ${
              manifest.awayCityHeat > 50 ? 'text-rose-400 animate-pulse' : manifest.awayCityHeat > 25 ? 'text-amber-400' : 'text-sky-300'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{manifest.awayCityHeat}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Transport Route Selection */}
      <div className="fm-panel rounded-lg overflow-hidden border border-[#213347]">
        <div className="fm-panel-header px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Choose Transport Smuggling Route</span>
          </div>
          <span className="text-[10px] text-slate-400">Determines police roadblock probability</span>
        </div>

        <div className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0a1018]">
          {[
            {
              id: 'motorway' as TravelRoute,
              name: 'Motorway Arteries (M1/M6)',
              icon: Truck,
              speed: 'Fast (Direct)',
              risk: 'Medium Police Risk (30%)',
              desc: 'High speed transit via service stations. Highway traffic patrols with sniffer dogs check suspicious minibuses.'
            },
            {
              id: 'a_roads' as TravelRoute,
              name: 'A-Roads & Country Lanes',
              icon: Navigation,
              speed: 'Slow (Twisting)',
              risk: 'Low Police Risk (15%)',
              desc: 'Rural backroads winding through farmland and villages. Avoids highway cameras, but risks potholes and speed traps.'
            },
            {
              id: 'train' as TravelRoute,
              name: 'The Rail Network (Train Special)',
              icon: Train,
              speed: 'Direct Terminus',
              risk: 'High BTP Risk (55%)',
              desc: 'Packing heavy duffel bags onto passenger carriages. Huge atmosphere, but British Transport Police wait at the terminus.'
            }
          ].map(route => {
            const isSelected = manifest.route === route.id;
            const Icon = route.icon;
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handleSelectRoute(route.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-[#152335] border-amber-400 text-white shadow-lg'
                    : 'bg-[#101722] border-[#1d2b3c] text-slate-300 hover:border-[#2d425c]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm flex items-center gap-1.5 text-white">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{route.name}</span>
                  </span>
                  {isSelected && (
                    <span className="bg-amber-400 text-black font-bold text-[9px] px-1.5 py-0.5 rounded">
                      SELECTED
                    </span>
                  )}
                </div>
                <div className="text-[10px] space-y-0.5 text-slate-400 mb-2">
                  <div className="text-amber-300 font-bold">{route.risk}</div>
                  <div>Pace: {route.speed}</div>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{route.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel Event Alert Card (if triggered) */}
      {eventAlert && (
        <div className={`p-4 rounded-lg border shadow-lg ${
          eventAlert.outcomeType === 'cargo_seized'
            ? 'bg-rose-950/70 border-rose-600 text-rose-100'
            : eventAlert.outcomeType === 'bribe_paid' || eventAlert.outcomeType === 'police_search'
              ? 'bg-amber-950/70 border-amber-600 text-amber-100'
              : 'bg-emerald-950/70 border-emerald-600 text-emerald-100'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-sm uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>TRAVEL INCIDENT: {eventAlert.title}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 font-mono">
              Route: {eventAlert.route.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {eventAlert.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] border-t border-white/10 pt-2">
            <div className="flex items-center gap-4">
              <span className="font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Heat Impact: {eventAlert.heatDelta > 0 ? `+${eventAlert.heatDelta}` : eventAlert.heatDelta}</span>
              </span>
              {eventAlert.cargoLostQuantity > 0 && (
                <span className="font-bold text-rose-400">
                  ⚠️ Cargo Confiscated: -{eventAlert.cargoLostQuantity} Units
                </span>
              )}
              {eventAlert.treasuryDelta < 0 && (
                <span className="font-bold text-amber-400">
                  💸 Fine/Bribe Paid: £{Math.abs(eventAlert.treasuryDelta)}
                </span>
              )}
            </div>

            <button
              onClick={onOpenMarket}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded flex items-center gap-1 shadow"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Open Away Street Market</span>
            </button>
          </div>
        </div>
      )}

      {/* Dispatch or Market Action Strip */}
      <div className="bg-[#0e1622] border border-[#213347] p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          {!manifest.travelEventTriggered ? (
            <span>Load your cargo and trigger travel to simulate the transit encounter into {awayCityName}.</span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Convoy arrived safely at {awayCityName}. Ready to liquidate stock at the Away Market.</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!manifest.travelEventTriggered ? (
            <button
              onClick={handleDepartAndTriggerEvent}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded flex items-center gap-1.5 shadow transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Depart for Away Day &amp; Roll Police Stop</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDepartAndTriggerEvent}
                className="px-3 py-1.5 bg-[#1a2736] hover:bg-[#25394f] text-slate-300 border border-[#304763] rounded font-bold text-xs flex items-center gap-1"
                title="Reroll transit event"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reroll Route Event</span>
              </button>
              <button
                onClick={onOpenMarket}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1.5 shadow transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Open Away Street Market</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step 1: Contraband Catalog to Purchase */}
      <div className="fm-panel rounded-lg overflow-hidden border border-[#213347]">
        <div className="fm-panel-header px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Cargo Wholesaler Catalog</span>
          </span>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-[#0b121b] p-0.5 rounded border border-[#233549]">
            {(['All', 'Bootleg', 'Contraband', 'Premium'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#0a1018]">
          {filteredItems.map(item => {
            const canAffordOne = treasury >= item.buyPrice && remainingCapacity >= 1;
            const canAffordFive = treasury >= item.buyPrice * 5 && remainingCapacity >= 5;

            return (
              <div
                key={item.id}
                className="bg-[#121c29] border border-[#203247] rounded-lg p-3 flex flex-col justify-between hover:border-[#2f4866] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-white text-xs">{item.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      item.type === 'Premium' ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                      item.type === 'Contraband' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' :
                      'bg-sky-900/60 text-sky-300 border border-sky-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-[#0b121b] p-2 rounded border border-[#1b2b3d] text-[10px] space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Buy Price:</span>
                      <strong className="text-white">£{item.buyPrice} / unit</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Away Sell Price:</span>
                      <strong className="text-emerald-400">£{item.sellPrice} / unit</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Heat on Sale:</span>
                      <strong className="text-rose-400 flex items-center gap-0.5">
                        <Flame className="w-3 h-3 inline" /> +{item.heat} Heat
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 px-1">
                    <span className="text-slate-400">In Boot:</span>
                    <span className="font-bold text-amber-400 tabular-nums">{item.quantity} units</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      disabled={!canAffordOne}
                      onClick={() => handleBuyItem(item.id, 1)}
                      className={`py-1 rounded font-bold text-[10px] border transition-colors ${
                        canAffordOne
                          ? 'bg-[#1e2f42] hover:bg-[#283e57] text-white border-[#344f6f]'
                          : 'bg-[#101722] text-slate-600 border-[#1a2533] cursor-not-allowed'
                      }`}
                    >
                      +1 (£{item.buyPrice})
                    </button>
                    <button
                      type="button"
                      disabled={!canAffordFive}
                      onClick={() => handleBuyItem(item.id, 5)}
                      className={`py-1 rounded font-bold text-[10px] border transition-colors ${
                        canAffordFive
                          ? 'bg-[#1e2f42] hover:bg-[#283e57] text-amber-300 border-[#344f6f]'
                          : 'bg-[#101722] text-slate-600 border-[#1a2533] cursor-not-allowed'
                      }`}
                    >
                      +5 (£{item.buyPrice * 5})
                    </button>
                    <button
                      type="button"
                      disabled={item.quantity <= 0}
                      onClick={() => handleRemoveItem(item.id, 1)}
                      className={`py-1 rounded font-bold text-[10px] border transition-colors ${
                        item.quantity > 0
                          ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800'
                          : 'bg-[#101722] text-slate-600 border-[#1a2533] cursor-not-allowed'
                      }`}
                    >
                      -1 (Sell)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
