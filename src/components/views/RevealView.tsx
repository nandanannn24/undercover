"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { SecretRoleCard } from "@/components/SecretRoleCard";
import { sound } from "@/lib/audio";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const REVEAL_DURATION_SECONDS = 5;

export function RevealView() {
  const { players, currentRevealIndex, nextRevealStep } = useGameStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REVEAL_DURATION_SECONDS);

  const isAdvancingRef = useRef(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPlayer = players[currentRevealIndex];
  const isLastPlayer = currentRevealIndex === players.length - 1;

  // Reset local state strictly when moving to a new player index
  useEffect(() => {
    setIsFlipped(false);
    setHasOpened(false);
    setSecondsLeft(REVEAL_DURATION_SECONDS);
    isAdvancingRef.current = false;

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, [currentRevealIndex]);

  // Clean up any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, []);

  // Safely close card and advance to next player exactly ONCE
  const triggerCloseAndAdvance = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    sound.playCardFlip();
    setIsFlipped(false);

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    advanceTimeoutRef.current = setTimeout(() => {
      advanceTimeoutRef.current = null;
      nextRevealStep();
    }, 550);
  }, [nextRevealStep]);

  // Pure declarative countdown effect (zero side effects inside state updaters)
  useEffect(() => {
    if (!isFlipped || isAdvancingRef.current) return;

    if (secondsLeft <= 0) {
      triggerCloseAndAdvance();
      return;
    }

    const tickTimeout = setTimeout(() => {
      sound.playTimerTick(true);
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(tickTimeout);
  }, [isFlipped, secondsLeft, triggerCloseAndAdvance]);

  // Handle open card (strictly once per player turn)
  const handleOpenCard = () => {
    if (hasOpened || isFlipped || isAdvancingRef.current) return;

    setHasOpened(true);
    setIsFlipped(true);
    setSecondsLeft(REVEAL_DURATION_SECONDS);
    sound.playCardFlip();

    if (currentPlayer) {
      sound.playRoleReveal(currentPlayer.role);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 z-10 flex flex-col items-center justify-center relative">
      {/* Top Progress Bar */}
      <div className="w-[300px] sm:w-[325px] mb-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-200 mb-1.5 px-1">
          <span className="uppercase text-[10px] tracking-wider text-slate-400">
            Pemain {currentRevealIndex + 1} dari {players.length}
          </span>
          <span className="text-amber-300">
            {Math.round(((currentRevealIndex + 1) / players.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-purple-950/70 rounded-full overflow-hidden border border-purple-500/20">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
            style={{ width: `${((currentRevealIndex + 1) / players.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Vertical Portrait Secret Role Card (Locked Position & Dimension) */}
      <div className="my-1">
        <SecretRoleCard
          player={currentPlayer}
          isFlipped={isFlipped}
          onOpen={handleOpenCard}
          secondsLeft={secondsLeft}
        />
      </div>

      {/* Bottom Action / Status Bar (Fixed Height to prevent layout shift) */}
      <div className="w-[300px] sm:w-[325px] mt-3 h-14 flex items-center justify-center">
        {isFlipped ? (
          <button
            type="button"
            onClick={triggerCloseAndAdvance}
            className="w-full py-3.5 px-4 rounded-xl btn-gold-3d font-cinzel text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl cursor-pointer active:translate-y-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isLastPlayer
                ? `Sudah Hafal • Mulai Diskusi (${secondsLeft}s)`
                : `Sudah Hafal • Lanjut (${secondsLeft}s)`}
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pegang HP dan sentuh tombol di kartu</span>
          </div>
        )}
      </div>
    </div>
  );
}
