import React from 'react';
import { Phone, PhoneOff, ShieldAlert, Award, AlertTriangle, Users } from 'lucide-react';
import { sound } from '../services/sound';

interface FirmPhoneCallOverlayProps {
  callerName: string;
  callerNickname: string;
  clubName: string;
  firmName: string;
  situation: string;
  onAccept: (bonusMsg: string) => void;
  onDecline: (bonusMsg: string) => void;
  onDismiss: () => void;
}

export const FirmPhoneCallOverlay: React.FC<FirmPhoneCallOverlayProps> = ({
  callerName,
  callerNickname,
  clubName,
  firmName,
  situation,
  onAccept,
  onDecline,
  onDismiss
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden font-mono text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Phone Call Masthead */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 animate-pulse">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Incoming Secure Call · {clubName}
              </div>
              <div className="text-base font-bold text-white">
                {callerName} "{callerNickname}"
              </div>
            </div>
          </div>
          <span className="text-[11px] bg-red-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold uppercase">
            PRIORITY WIRE
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs text-zinc-400 leading-relaxed italic">
              "{situation}"
            </div>
            <div className="text-[11px] text-zinc-500 text-right">
              — {firmName} Inner Circle
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                sound.playCheer();
                onAccept("You backed the lads! Firm loyalty +10%, Street Respect +25 pts.");
              }}
              className="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Back The Firm</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onDecline("You advised caution. Police Heat dropped by -15%, but lads muttered.");
              }}
              className="p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <PhoneOff className="w-4 h-4 text-zinc-500" />
              <span>Tell Them To Stand Down</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-zinc-900/60 border-t border-zinc-800/80 px-6 py-2.5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>SFS v0.1 Firm Controller Wire</span>
          <button
            onClick={onDismiss}
            className="hover:text-zinc-300 underline"
          >
            Hang up
          </button>
        </div>
      </div>
    </div>
  );
};
