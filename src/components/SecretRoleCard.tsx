"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShieldCheck, Sparkles, HelpCircle, Lock, Timer } from "lucide-react";
import { Player } from "@/lib/game/types";

interface SecretRoleCardProps {
  player: Player;
  isFlipped: boolean;
  onOpen: () => void;
  secondsLeft: number;
}

export function SecretRoleCard({
  player,
  isFlipped,
  onOpen,
  secondsLeft,
}: SecretRoleCardProps) {
  const isMrWhite = player.role === "Mr. White";
  const isUndercover = player.role === "Undercover";
  const isCivilian = player.role === "Civilian";

  const characterImage = isCivilian
    ? "/characters/civilian.png"
    : isUndercover
      ? "/characters/undercover.png"
      : "/characters/mr_white.png";

  return (
    <div
      className="w-[300px] sm:w-[325px] h-[470px] sm:h-[500px] mx-auto select-none relative z-20"
      style={{ perspective: 1200, WebkitPerspective: 1200 }}
    >
      <motion.div
        className="w-full h-full relative rounded-3xl"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FRONT OF CARD (Vertical Portrait Mystery Card) */}
        <motion.div
          aria-hidden={isFlipped}
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.04, delay: 0.2 }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(1px)",
          }}
          className={`absolute inset-0 rounded-3xl bg-gradient-to-b from-[#2a144e] via-[#1b0d33] to-[#110722] border-2 border-[#d4af37] p-5 sm:p-6 flex flex-col justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_24px_rgba(212,175,55,0.18)] overflow-hidden ${
            isFlipped ? "pointer-events-none" : ""
          }`}
        >
          {/* Inner decorative filigree border */}
          <div className="absolute inset-2 rounded-2xl border border-[#d4af37]/35 pointer-events-none" />

          {/* Top Badge */}
          <div className="w-full flex justify-between items-center z-10">
            <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-black/50 border border-[#d4af37]/40 shadow-sm flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>KARTU RAHASIA</span>
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-300">Privat</span>
            </div>
          </div>

          {/* Center Content: Player Name & Avatar */}
          <div className="flex flex-col items-center my-auto z-10 text-center w-full">
            <div className="relative w-24 h-32 sm:w-28 sm:h-36 mb-2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
              <Image
                src="/characters/civilian.png"
                alt="Detective Mascot"
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-contain"
                priority
              />
            </div>

            <span className="text-[11px] font-mono font-bold text-amber-400/90 tracking-wider uppercase mb-1">
              GILIRAN MEMBUKA:
            </span>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mb-1">
              {player.name}
            </h3>

            <p className="text-[11px] text-slate-300 font-medium leading-relaxed max-w-[240px] mx-auto mt-1 mb-4">
              Oper HP ke <strong>{player.name}</strong>. Hanya nama yang ditunjuk yang boleh membuka!
            </p>

            {/* Click to Open Button (Only once!) */}
            <button
              type="button"
              disabled={isFlipped}
              onClick={onOpen}
              className="w-full py-3.5 px-4 rounded-2xl btn-gold-3d bg-gradient-to-b from-[#f7df8b] via-[#d4af37] to-[#b38b1f] text-[#1a0b2e] border-t border-amber-200 border-b-4 border-[#634305] font-cinzel text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl active:translate-y-1 active:border-b-0 transition-all cursor-pointer animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4 fill-amber-950 stroke-[2.5]" />
              <span>Buka Sandi Rahasia</span>
            </button>
          </div>

          {/* Bottom Security Note */}
          <div className="w-full text-center z-10 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-amber-200/70 font-medium pt-1 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sekali buka • Jangan sampai terlihat orang lain!</span>
          </div>
        </motion.div>

        {/* BACK OF CARD (Revealed Role & Word with 5s Cooldown Timer) */}
        <motion.div
          aria-hidden={!isFlipped}
          initial={false}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.04, delay: 0.2 }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
          }}
          className={`absolute inset-0 rounded-3xl border-2 p-5 sm:p-6 flex flex-col justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden ${
            !isFlipped ? "pointer-events-none" : ""
          } ${
            isMrWhite
              ? "bg-gradient-to-b from-[#24133d] to-[#11071f] border-purple-400/60 shadow-purple-950/50"
              : isUndercover
                ? "bg-gradient-to-b from-[#3b0d23] to-[#17040e] border-rose-500/60 shadow-rose-950/50"
                : "bg-gradient-to-b from-[#0e2747] to-[#061224] border-sky-400/60 shadow-sky-950/50"
          }`}
        >
          {/* Inner decorative border */}
          <div className="absolute inset-2 rounded-2xl border border-white/10 pointer-events-none" />

          {/* Top Header: Player Name + Role Badge */}
          <div className="w-full flex justify-between items-center z-10">
            <span className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider">
              {player.name}
            </span>
            <div
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                isMrWhite
                  ? "bg-purple-900/70 text-purple-200 border border-purple-400/50"
                  : isUndercover
                    ? "bg-rose-900/70 text-rose-200 border border-rose-400/50"
                    : "bg-sky-900/70 text-sky-200 border border-sky-400/50"
              }`}
            >
              {isMrWhite ? <HelpCircle className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              <span>{player.role}</span>
            </div>
          </div>

          {/* Center Content: 3D Character Avatar & Secret Word */}
          <div className="flex flex-col items-center my-auto w-full z-10 text-center">
            {/* 3D Character Art */}
            <div className="relative w-20 h-28 sm:w-24 sm:h-32 mb-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] animate-float-ghost">
              <Image
                src={characterImage}
                alt={player.role}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain"
                priority
              />
            </div>

            {isMrWhite ? (
              <div className="p-3.5 rounded-2xl bg-black/50 border border-purple-400/40 w-full shadow-inner">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300/80 block mb-0.5">
                  PERAN SPESIAL
                </span>
                <h4 className="font-cinzel text-xl sm:text-2xl font-black text-purple-200 mb-1">
                  TIDAK ADA KATA!
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Anda adalah <strong>Mr. White</strong>. Dengarkan petunjuk orang lain dan tebak kata Civilian di akhir!
                </p>
              </div>
            ) : (
              <div
                className={`p-3.5 rounded-2xl w-full border shadow-inner ${
                  isUndercover
                    ? "bg-black/50 border-rose-500/40"
                    : "bg-black/50 border-sky-500/40"
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-0.5">
                  KATA RAHASIA ANDA
                </span>
                <h2
                  className={`font-cinzel text-2xl sm:text-3xl font-black tracking-wide my-0.5 ${
                    isUndercover
                      ? "text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                      : "text-amber-200 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  }`}
                >
                  {player.clue}
                </h2>
                <p className="text-[10px] text-slate-300 mt-1">
                  {isUndercover
                    ? "Kata Anda serupa dengan Civilian. Jangan sampai dicurigai!"
                    : "Berikan petunjuk cerdik tanpa membocorkan ke Mr. White!"}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Countdown Cooldown Indicator */}
          <div className="w-full text-center z-10 pt-2 border-t border-white/10">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Menutup otomatis dalam {secondsLeft} detik...</span>
            </div>
            {/* Visual Countdown Progress Bar */}
            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-1000 ease-linear"
                style={{ width: `${(secondsLeft / 5) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
