"use client";

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { Send, AlertCircle } from "lucide-react";

export function MrWhiteGuessModal() {
  const { votedPlayer, handleMrWhiteGuess } = useGameStore();
  const [guess, setGuess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!votedPlayer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) {
      setErrorMsg("Masukkan tebakan kata terlebih dahulu!");
      sound.playClick();
      return;
    }
    sound.playClick();
    handleMrWhiteGuess(guess);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel border-2 border-purple-400/50 rounded-3xl max-w-sm w-full p-6 shadow-[0_0_50px_rgba(192,132,252,0.25)] text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

        <div className="relative w-24 h-28 mx-auto mb-2 drop-shadow-[0_8px_20px_rgba(192,132,252,0.4)] animate-float-ghost">
          <Image
            src="/characters/mr_white.png"
            alt="Mr. White Ghost"
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </div>

        <span className="font-mono text-[10px] font-bold tracking-widest text-purple-300 uppercase mb-2 bg-purple-950/70 px-3 py-0.5 rounded-full inline-block border border-purple-400/40">
          ROLE TERBONGKAR • MR. WHITE
        </span>
        <h3 className="font-cinzel text-xl font-black text-amber-100 tracking-wide mb-1">
          {votedPlayer.name} adalah Mr. White!
        </h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed font-medium">
          Kesempatan terakhir! Tulis kata rahasia Civilian dengan tepat — jika benar, <strong>Mr. White langsung menang!</strong>
        </p>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            type="text"
            autoFocus
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="Ketik tebakan kata rahasia..."
            className="w-full bg-black/50 border border-purple-500/40 rounded-xl px-4 py-3 text-base text-center font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 shadow-inner transition"
          />

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl btn-gold-3d font-cinzel text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Tebakan Terakhir</span>
          </button>
        </form>

        <p className="text-[10px] text-slate-400 font-medium mt-3">
          Tebakan tidak membedakan huruf besar atau kecil.
        </p>
      </div>
    </div>
  );
}
