"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import {
  Play,
  Pause,
  Vote,
  Clock,
  RotateCcw,
  Check,
  ChevronRight,
  Mic,
  Shuffle,
} from "lucide-react";

export function DiscussionView() {
  const {
    players,
    currentRound,
    currentSpeakerIndex,
    nextSpeaker,
    castVote,
    config,
  } = useGameStore();

  const activePlayers = players.filter((p) => !p.isEliminated);
  const eliminatedPlayers = players.filter((p) => p.isEliminated);
  const safeSpeakerIdx =
    activePlayers.length > 0 ? currentSpeakerIndex % activePlayers.length : 0;
  const currentSpeaker = activePlayers[safeSpeakerIdx] || activePlayers[0];

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    config.discussionTimerSeconds || 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Reset selected vote when round changes
  useEffect(() => {
    setSelectedPlayerId(null);
    setIsTimerRunning(false);
    setSecondsLeft(config.discussionTimerSeconds || 60);
  }, [currentRound, config.discussionTimerSeconds]);

  useEffect(() => {
    if (!isTimerRunning || secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      if (secondsLeft <= 1) {
        sound.playTimerTick(true);
        setIsTimerRunning(false);
        setSecondsLeft(0);
      } else {
        if (secondsLeft <= 10) {
          sound.playTimerTick(true);
        }
        setSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isTimerRunning, secondsLeft]);

  const selectedPlayer = activePlayers.find((p) => p.id === selectedPlayerId);

  const handleNextSpeaker = () => {
    sound.playClick();
    nextSpeaker();
    setSecondsLeft(config.discussionTimerSeconds || 60);
  };

  const handleSelectCandidate = (id: string) => {
    sound.playClick();
    setSelectedPlayerId((prev) => (prev === id ? null : id));
  };

  const handleSubmitVote = () => {
    if (!selectedPlayerId) return;
    sound.playClick();
    castVote(selectedPlayerId);
  };

  const getSeatNumber = (playerId: string) => {
    return players.findIndex((p) => p.id === playerId) + 1;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-2 z-10 flex flex-col gap-3">
      {/* 1. Compact Round & Timer Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-950/85 border border-amber-500/40 text-amber-300 shadow-sm">
            RONDE {currentRound}
          </span>
          <span className="text-xs text-slate-300 font-semibold">
            {activePlayers.length}/{players.length} Aktif
          </span>
          {currentRound === 1 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <Shuffle className="w-2.5 h-2.5" />
              <span>Urutan Acak</span>
            </span>
          )}
        </div>

        {config.discussionTimerSeconds > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-purple-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span
              className={`text-xs font-mono font-bold ${
                secondsLeft <= 10 ? "text-rose-400 animate-pulse" : "text-amber-300"
              }`}
            >
              {Math.floor(secondsLeft / 60)}:
              {(secondsLeft % 60).toString().padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsTimerRunning((r) => !r);
              }}
              className="text-slate-300 hover:text-white p-1 cursor-pointer"
              title={isTimerRunning ? "Pause Timer" : "Mulai Timer"}
              aria-label={isTimerRunning ? "Pause Timer" : "Mulai Timer"}
            >
              {isTimerRunning ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(false);
                setSecondsLeft(config.discussionTimerSeconds || 60);
              }}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Compact Turn Speaker Banner (1 Row, Zero Bloat) */}
      {currentSpeaker && (
        <div className="bento-card-raised px-3.5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <CartoonAvatar id={currentSpeaker.avatar} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                <Mic className="w-3 h-3 shrink-0" />
                <span>Giliran Bicara #{getSeatNumber(currentSpeaker.id)}</span>
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-black text-amber-100 truncate leading-tight">
                {currentSpeaker.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextSpeaker}
            className="btn-secondary-3d min-h-[44px] px-3 sm:px-4 rounded-xl text-xs font-bold text-amber-200 flex items-center gap-1 shrink-0 cursor-pointer active:translate-y-0.5"
          >
            <span>Lanjut</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* 3. Instant Voting Section (Fits Entirely On One Screen — Zero Scroll!) */}
      <div className="bento-card p-3.5 sm:p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-cinzel text-sm sm:text-base font-black text-amber-200 tracking-wide">
              Voting Eliminasi
            </h4>
            <p className="text-[11px] text-slate-400">
              Ketuk nama pemain yang dicurigai, lalu tekan tombol eliminasi
            </p>
          </div>
          {selectedPlayer && (
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 shrink-0">
              Target: {selectedPlayer.name}
            </span>
          )}
        </div>

        {/* Compact 2-Column Mobile / 3-Column Desktop Candidate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {activePlayers.map((p) => {
            const isSelected = selectedPlayerId === p.id;
            const isSpeaking = currentSpeaker && p.id === currentSpeaker.id;
            const seatNum = getSeatNumber(p.id);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectCandidate(p.id)}
                className={`min-h-[54px] px-2.5 py-2 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-[0.97] ${
                  isSelected
                    ? "bg-rose-950/75 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] ring-2 ring-rose-500"
                    : isSpeaking
                      ? "bg-amber-500/12 border-amber-400/60 hover:border-amber-300"
                      : "glass-panel border-purple-500/25 hover:border-amber-400/40"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CartoonAvatar id={p.avatar} size="xs" />
                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm font-bold text-slate-100 truncate leading-tight">
                      {p.name}
                    </span>
                    <span
                      className={`block text-[10px] font-mono leading-tight ${
                        isSelected
                          ? "text-rose-300 font-bold"
                          : isSpeaking
                            ? "text-amber-300"
                            : "text-slate-400"
                      }`}
                    >
                      {isSelected
                        ? "Dipilih"
                        : isSpeaking
                          ? `#${seatNum} • Bicara`
                          : `#${seatNum}`}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    isSelected
                      ? "border-rose-300 bg-rose-500 text-white"
                      : "border-slate-600 bg-black/40"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Eliminated Players Compact Chips (Revealed Roles) */}
        {eliminatedPlayers.length > 0 && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">
              Gugur:
            </span>
            {eliminatedPlayers.map((p) => (
              <span
                key={p.id}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  p.role === "Undercover"
                    ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                    : p.role === "Mr. White"
                      ? "bg-purple-950/60 text-purple-300 border-purple-400/40"
                      : "bg-sky-950/60 text-sky-300 border-sky-400/40"
                }`}
              >
                {p.name} • {p.role}
              </span>
            ))}
          </div>
        )}

        {/* Direct Action Button Right Below Grid (Zero Scroll Needed!) */}
        <button
          type="button"
          onClick={handleSubmitVote}
          disabled={!selectedPlayerId}
          className="btn-chunky-rose w-full min-h-[50px] py-3 px-4 rounded-xl font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl cursor-pointer active:translate-y-0.5"
        >
          <Vote className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {selectedPlayer
              ? `Eliminasi ${selectedPlayer.name}`
              : "Pilih Pemain untuk Eliminasi"}
          </span>
        </button>
      </div>
    </div>
  );
}
