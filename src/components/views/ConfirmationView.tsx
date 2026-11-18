"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { shuffle } from "@/lib/game/engine";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import { ArrowLeft, Play, Shuffle, ShieldCheck } from "lucide-react";

export function ConfirmationView() {
  const { playerInputs, setPlayerInputs, setStage, startNewGame } = useGameStore();

  const handleShuffleOrder = () => {
    sound.playClick();
    setPlayerInputs(shuffle(playerInputs));
  };

  const handleStartGame = () => {
    sound.playClick();
    startNewGame();
  };

  const handleBack = () => {
    sound.playClick();
    setStage("PLAYERS_INPUT");
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* Step Header */}
      <div className="text-center mb-5 sm:mb-6">
        <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30">
          LANGKAH 3 DARI 4
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mt-2">
          Urutan Giliran Bicara
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Pemain akan memberikan petunjuk sesuai urutan nomor di bawah ini
        </p>
      </div>

      {/* 3D Bento Container */}
      <div className="bento-card p-5 mb-5">
        {/* Shuffle Header Bar */}
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-amber-200 block">
              Urutan Giliran {playerInputs.length} Pemain:
            </span>
            <span className="text-[10px] text-slate-400">
              Dapat dikocok ulang jika ingin mengubah urutan
            </span>
          </div>

          <button
            type="button"
            onClick={handleShuffleOrder}
            className="px-3.5 py-2 rounded-xl btn-secondary-3d text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-1"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Kocok Urutan</span>
          </button>
        </div>

        {/* Players Roster in 2 Columns on Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[48vh] overflow-y-auto pr-1">
          {playerInputs.map((p, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl glass-panel flex items-center justify-between transition-all hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-cinzel text-base font-black text-amber-400/90 w-7 text-center shrink-0">
                  #{idx + 1}
                </span>
                <CartoonAvatar id={p.avatar} size="sm" />
                <span className="text-sm font-bold text-slate-100 truncate">
                  {p.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-purple-500/20 text-[11px] text-amber-300/90 font-mono shrink-0">
                <span>Siap</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pass-and-play Security Reminder Inside Bento */}
        <div className="mt-4 p-3.5 rounded-xl glass-card-subtle flex items-start gap-2.5 text-xs text-amber-200/90 border-purple-500/25">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Peran dan kata rahasia akan diacak otomatis oleh sistem. Oper HP ke <strong>{playerInputs[0]?.name || "Pemain #1"}</strong> terlebih dahulu secara pribadi.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3.5 px-4 rounded-xl btn-secondary-3d text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleStartGame}
          className="flex-[2] py-4 px-5 rounded-xl btn-gold-3d font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl cursor-pointer"
        >
          <Play className="w-4 h-4 fill-amber-950" />
          <span>Bagikan Peran Rahasia!</span>
        </button>
      </div>
    </div>
  );
}
