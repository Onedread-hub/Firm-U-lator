/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AwayMarketModal.tsx
 * The Away City Underworld & Street Contraband Market.
 * Allows selling smuggled cargo at destination, depositing liquid cash into treasury,
 * and accumulating awayCityHeat.
 */

import React from 'react';
import { CargoManifest, TradingItem } from '../types/trading';
import { sound } from '../services/sound';
import { DollarSign, Flame, AlertTriangle, ShieldAlert, Package, Check, ArrowRight } from 'lucide-react';

interface AwayMarketModalProps {
  manifest: CargoManifest;
  awayCityName: string;
  treasury: number;
  onSellItem: (itemId: string, quantity: number) => void;
  onLiquidateAll: () => void;
  onClose: () => void;
}

export const AwayMarketModal: React.FC<AwayMarketModalProps> = ({
  manifest,
  awayCityName,
  treasury,
  onSellItem,
  onLiquidateAll,
  onClose
}) => {
  const carriedItems = manifest.items.filter(item => item.quantity > 0);
  const totalUnits = carriedItems.reduce((acc, it) => acc + it.quantity, 0);
  const potentialTotalPayout = carriedItems.reduce((acc, it) => acc + (it.sellPrice * it.quantity), 0);

  const isCriticalHeat = manifest.awayCityHeat > 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div className="w-full max-w-2xl bg-[#0c131c] border-2 border-[#2b3e55] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#142333] via-[#1c2e42] to-[#142333] p-4 border-b border-[#2b3e55] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Underworld Exchange · {awayCityName}
            </div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>The Away Street Market</span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400">Current Treasury:</span>
            <div className="text-sm font-bold text-emerald-400 font-mono">£{treasury}</div>
          </div>
        </div>

        {/* Away City Heat Warning Banner */}
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          isCriticalHeat 
            ? 'bg-rose-950/80 border-rose-800 text-rose-200' 
            : manifest.awayCityHeat > 25 
              ? 'bg-amber-950/70 border-amber-800 text-amber-200'
              : 'bg-[#0f1a26] border-[#1e2f42] text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            {isCriticalHeat ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <Flame className="w-4 h-4 text-amber-400" />
            )}
            <span>
              <strong>Away City Heat: {manifest.awayCityHeat}/100</strong>
              {isCriticalHeat ? ' — CRITICAL DANGER: Police raid trigger risk (>50)!' : ' (Increases as goods are sold)'}
            </span>
          </div>

          {/* Liquidate All Button */}
          {carriedItems.length > 0 && (
            <button
              onClick={() => {
                sound.playCheer();
                onLiquidateAll();
              }}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] rounded transition-all flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Sell All (£{potentialTotalPayout})</span>
            </button>
          )}
        </div>

        {/* Cargo Inventory List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#090f17]">
          {carriedItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-slate-300">No smuggled cargo remaining in boot.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                All units have been liquidated or seized. Ready for matchday.
              </p>
            </div>
          ) : (
            carriedItems.map(item => {
              const itemTotalPayout = item.sellPrice * item.quantity;
              const itemProfit = (item.sellPrice - item.buyPrice) * item.quantity;
              const addedHeat = item.heat * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-[#121b27] border border-[#213347] rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#324a66] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        item.type === 'Premium' ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                        item.type === 'Contraband' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' :
                        'bg-sky-900/60 text-sky-300 border border-sky-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Carrying: <strong className="text-amber-400">{item.quantity} units</strong> · Bought: £{item.buyPrice} ea · Sell: £{item.sellPrice} ea
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-bold">Total Payout: +£{itemTotalPayout} (+£{itemProfit} profit)</span>
                      <span>·</span>
                      <span className="text-rose-400 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 inline" /> +{addedHeat} Heat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSellItem(item.id, 1);
                      }}
                      className="px-2.5 py-1.5 bg-[#1c2c3e] hover:bg-[#253d58] text-amber-300 border border-[#324b69] rounded font-bold text-xs"
                    >
                      Sell 1 (+£{item.sellPrice})
                    </button>
                    {item.quantity > 1 && (
                      <button
                        onClick={() => {
                          sound.playCheer();
                          onSellItem(item.id, item.quantity);
                        }}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded border border-emerald-600"
                      >
                        Sell All {item.quantity} (+£{itemTotalPayout})
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0c141e] border-t border-[#1e2f42] flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            {totalUnits} units carried in convoy
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#25394f] hover:bg-[#314a66] text-white font-bold rounded transition-colors text-xs"
          >
            Done Trading (Return to Logistics)
          </button>
        </div>
      </div>
    </div>
  );
};
