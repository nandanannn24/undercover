"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store/gameStore";
import { ArrowRight, Trophy, Shield, UserX, Ghost } from "lucide-react";

export function EliminationRevealModal() {
  const {
    votedPlayer,
    lastEliminatedNote,
    pendingNextStage,
    currentRound,
    continueAfterElimination,
  } = useGameStore();

  if (!votedPlayer) return null;

  const isMrWhite = votedPlayer.role === "Mr. White";
  const isUndercover = votedPlayer.role === "Undercover";
  const isGameOverNext = pendingNextStage === "GAME_OVER";

  const characterImage = isMrWhite
    ? "/characters/mr_white.png"
    : isUndercover
      ? "/characters/undercover.png"
      : "/characters/civilian.png";

  const headline = isMrWhite
    ? "Mr. White Tereliminasi!"
    : isUndercover
      ? "Penyusup Tertangkap!"
      : "Warga Sipil Gugur!";

  const description = lastEliminatedNote
    ? lastEliminatedNote
    : isUndercover
      ? `Mantap! ${votedPlayer.name} ternyata adalah seorang penyusup Undercover.`
      : `Sayang sekali, ${votedPlayer.name} sebenarnya adalah Warga Sipil (Civilian).`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-panel border-2 rounded-3xl max-w-sm w-full p-6 text-center relative overflow-hidden shadow-2xl ${
          isMrWhite
            ? "border-purple-400/60 shadow-purple-950/60"
            : isUndercover
              ? "border-rose-500/60 shadow-rose-950/60"
              : "border-sky-400/60 shadow-sky-950/60"
        }`}
      >
        {/* Ambient Glow */}
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
            isMrWhite
              ? "bg-purple-500/20"
              : isUndercover
                ? "bg-rose-500/20"
                : "bg-sky-500/20"
          }`}
        />

        <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-black/50 border border-amber-500/30 inline-block mb-3">
          HASIL ELIMINASI • RONDE {currentRound}
        </span>

        {/* 3D Role Character */}
        <div className="relative w-24 h-32 mx-auto mb-2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] animate-float-ghost">
          <Image
            src={characterImage}
            alt={votedPlayer.role}
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </div>

        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          PEMAIN DIKELUARKAN:
        </p>
        <h3 className="font-cinzel text-2xl font-black text-amber-100 tracking-wide mt-0.5 mb-2">
          {votedPlayer.name}
        </h3>

        {/* Revealed Role Badge */}
        <div className="flex justify-center mb-3">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl border font-cinzel text-sm font-black uppercase tracking-wider shadow-lg ${
              isMrWhite
                ? "bg-purple-950/80 text-purple-200 border-purple-400/60"
                : isUndercover
                  ? "bg-rose-950/80 text-rose-200 border-rose-400/60"
                  : "bg-sky-950/80 text-sky-200 border-sky-400/60"
            }`}
          >
            {isMrWhite ? (
              <Ghost className="w-4 h-4 text-purple-300" />
            ) : isUndercover ? (
              <UserX className="w-4 h-4 text-rose-300" />
            ) : (
              <Shield className="w-4 h-4 text-sky-300" />
            )}
            <span>ROLE: {votedPlayer.role}</span>
          </div>
        </div>

        <h4 className="text-sm font-bold text-white mb-1">{headline}</h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-5 px-1">
          {description}
        </p>

        <button
          type="button"
          onClick={continueAfterElimination}
          className="w-full py-3.5 px-4 rounded-xl btn-gold-3d font-cinzel text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl cursor-pointer active:translate-y-1"
        >
          {isGameOverNext ? (
            <>
              <Trophy className="w-4 h-4" />
              <span>Lihat Hasil Akhir Permainan</span>
            </>
          ) : (
            <>
              <span>Lanjut ke Ronde {currentRound + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
