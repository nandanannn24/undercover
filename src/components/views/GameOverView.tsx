"use client";

import { useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import { Trophy, RotateCcw, Users, Home, Award, Sparkles } from "lucide-react";

export function GameOverView() {
  const {
    winner,
    winReason,
    players,
    activeWordPair,
    playAgainSamePlayers,
    playAgainNewPlayers,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f59e0b", "#c084fc", "#38bdf8", "#f43f5e"],
      });
    } catch {
      // Ignore if confetti unavailable
    }
  }, []);

  const isCivilian = winner === "Civilian";
  const isUndercover = winner === "Undercover";
  const isMrWhite = winner === "Mr. White";
  const isJointInfiltrators = winner === "Penyusup";

  const winnerImage = isCivilian
    ? "/characters/civilian.png"
    : isUndercover
    ? "/characters/undercover.png"
    : "/characters/mr_white.png";

  const winnerTitle = isJointInfiltrators
    ? "Tim Penyusup Menang!"
    : `${winner} Menang!`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* 3D Bento Grid: Winner Showcase & Recap */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
        
        {/* Bento 1: Winner Celebration Banner (Span 12 cols) */}
        <div
          className={`md:col-span-12 p-6 sm:p-8 rounded-3xl border-2 text-center shadow-2xl relative overflow-hidden bento-card-raised ${
            isCivilian
              ? "border-sky-400/60 shadow-sky-950/50"
              : isUndercover
              ? "border-rose-500/60 shadow-rose-950/50"
              : isJointInfiltrators
              ? "border-amber-400/70 shadow-rose-950/60"
              : "border-purple-400/60 shadow-purple-950/50"
          }`}
        >
          {/* Winner 3D Character Illustration */}
          {isJointInfiltrators ? (
            <div className="flex items-center justify-center -space-x-4 mx-auto mb-2 animate-float-ghost">
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 -rotate-6 drop-shadow-[0_16px_32px_rgba(244,63,94,0.45)]">
                <Image
                  src="/characters/undercover.png"
                  alt="Undercover"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rotate-6 drop-shadow-[0_16px_32px_rgba(192,132,252,0.45)]">
                <Image
                  src="/characters/mr_white.png"
                  alt="Mr. White"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="relative w-28 h-36 sm:w-32 sm:h-42 mx-auto mb-2 drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] animate-float-ghost">
              <Image
                src={winnerImage}
                alt={winner || "Winner"}
                fill
                sizes="(max-width: 640px) 112px, 128px"
                className="object-contain"
                priority
              />
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isJointInfiltrators ? "UNDERCOVER & MR. WHITE" : "PERMAINAN SELESAI"}
            </span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-amber-100 tracking-wide mb-1.5">
            {winnerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg mx-auto">
            {winReason}
          </p>
        </div>

        {/* Bento 2: Revealed Secret Words (Span 5 cols on Desktop) */}
        {activeWordPair && (
          <div className="md:col-span-5 bento-card p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                  Pasangan Kata Rahasia
                </h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Berikut adalah dua kata yang dibagikan secara acak ke seluruh pemain:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-400/40">
                  <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider block mb-0.5">
                    Kata Civilian
                  </span>
                  <span className="font-cinzel text-xl font-black text-white block">
                    {activeWordPair.civilian}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Diterima oleh seluruh warga sipil
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-400/40">
                  <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider block mb-0.5">
                    Kata Undercover
                  </span>
                  <span className="font-cinzel text-xl font-black text-white block">
                    {activeWordPair.undercover}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Diterima oleh penyusup yang menyamar
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-purple-300/80 p-2 rounded-lg bg-black/30 border border-purple-500/20 text-center">
              Mr. White tidak mendapatkan kata apapun.
            </div>
          </div>
        )}

        {/* Bento 3: Full Player Roster Breakdown (Span 7 cols on Desktop) */}
        <div className="md:col-span-7 bento-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                Rekap Peran Seluruh Pemain
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {players.length} Pemain
              </span>
            </div>

            <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
              {players.map((p, idx) => {
                const isCiv = p.role === "Civilian";
                const isUnd = p.role === "Undercover";

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl glass-card-subtle flex items-center justify-between border-purple-500/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CartoonAvatar id={p.avatar} size="xs" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-100 truncate">{p.name}</span>
                          {p.isEliminated && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/40">
                              Ronde {p.eliminatedRound}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">
                          Kata: <strong className="text-amber-200 font-semibold">{p.clue}</strong>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase shrink-0 border ${
                        isCiv
                          ? "bg-sky-950 text-sky-200 border-sky-400/40"
                          : isUnd
                          ? "bg-rose-950 text-rose-200 border-rose-400/40"
                          : "bg-purple-950 text-purple-200 border-purple-400/40"
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400 text-center sm:text-left">
            Hasil permainan ini telah disimpan secara otomatis ke riwayat lokal perangkat.
          </div>
        </div>

      </div>

      {/* Action Footer Controls */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            playAgainSamePlayers();
          }}
          className="w-full py-4 px-5 rounded-2xl btn-gold-3d font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Main Lagi (Pemain Sama)</span>
        </button>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              playAgainNewPlayers();
            }}
            className="flex-1 py-3 px-4 rounded-xl btn-secondary-3d text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Ganti Pemain</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              resetGame();
            }}
            className="flex-1 py-3 px-4 rounded-xl btn-secondary-3d text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
}
