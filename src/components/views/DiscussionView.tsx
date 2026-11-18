"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import { UserCheck, Play, Pause, Vote, Clock, RotateCcw, Sparkles, AlertCircle } from "lucide-react";

export function DiscussionView() {
  const {
    players,
    currentRound,
    currentSpeakerIndex,
    nextSpeaker,
    setStage,
    config,
  } = useGameStore();

  const activePlayers = players.filter((p) => !p.isEliminated);
  const currentSpeaker = activePlayers[currentSpeakerIndex] || activePlayers[0];

  // Optional Discussion Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(config.discussionTimerSeconds || 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            sound.playTimerTick(true);
            setIsTimerRunning(false);
            return 0;
          }
          if (prev <= 10) {
            sound.playTimerTick(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const handleNextSpeaker = () => {
    sound.playClick();
    nextSpeaker();
    setSecondsLeft(config.discussionTimerSeconds || 60);
  };

  const handleStartVoting = () => {
    sound.playClick();
    setStage("VOTING");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* Round & Timer Cockpit Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold tracking-wider px-3.5 py-1 rounded-full bg-purple-950/80 border border-amber-500/40 text-amber-300 shadow-sm">
            RONDE {currentRound}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {activePlayers.length} dari {players.length} Pemain Aktif
          </span>
        </div>

        {/* Discussion Timer Widget */}
        {config.discussionTimerSeconds > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-purple-500/30 backdrop-blur-md shadow-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className={`text-sm font-mono font-bold ${secondsLeft <= 10 ? "text-rose-400 animate-pulse" : "text-amber-300"}`}>
              {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className="text-slate-300 hover:text-white transition p-1 cursor-pointer"
                title={isTimerRunning ? "Pause Timer" : "Mulai Timer"}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsTimerRunning(false);
                  setSecondsLeft(config.discussionTimerSeconds || 60);
                }}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Bento Cockpit: Speaker Spotlight & Player Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
        
        {/* Left Bento: Current Speaker Spotlight (Span 5 cols on Desktop) */}
        {currentSpeaker && (
          <div className="md:col-span-5 bento-card-raised p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>GILIRAN BICARA</span>
              </div>

              {/* 3D Speaker Avatar */}
              <div className="flex justify-center mb-3 drop-shadow-[0_12px_24px_rgba(212,175,55,0.3)]">
                <CartoonAvatar id={currentSpeaker.avatar} size="lg" />
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mb-1.5">
                {currentSpeaker.name}
              </h3>

              <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs mx-auto mt-2">
                Sebutkan 1 kata atau frasa pendek yang mendeskripsikan kata rahasiamu tanpa membuatnya terlalu gamblang!
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextSpeaker}
              className="w-full mt-5 py-3 px-4 rounded-xl btn-secondary-3d text-xs font-bold text-amber-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-y-1"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Selesai Bicara • Giliran Selanjutnya</span>
            </button>
          </div>
        )}

        {/* Right Bento: All Players Status Cockpit (Span 7 cols on Desktop) */}
        <div className="md:col-span-7 bento-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                Radar Status Seluruh Pemain
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Urutan Berputar
              </span>
            </div>

            {/* Players Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[44vh] overflow-y-auto pr-1">
              {players.map((p, idx) => {
                const isCurrent = currentSpeaker && p.id === currentSpeaker.id;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      p.isEliminated
                        ? "opacity-30 bg-black/20 border-white/5 line-through grayscale"
                        : isCurrent
                        ? "bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-amber-400"
                        : "glass-card-subtle border-purple-500/20 hover:border-purple-500/40"
                    }`}
                  >
                    <CartoonAvatar id={p.avatar} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{idx + 1}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${isCurrent ? "text-amber-300" : "text-slate-400"}`}>
                        {p.isEliminated ? "Tereliminasi" : isCurrent ? "Sedang Bicara" : "Menyimak"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
            Setelah semua pemain memberikan petunjuk, mulai voting eliminasi untuk mengeluarkan orang yang dicurigai.
          </div>
        </div>

      </div>

      {/* Action Footer: Prominent Elimination Voting Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleStartVoting}
          className="btn-chunky-rose w-full py-4 px-5 font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
        >
          <Vote className="w-5 h-5" />
          <span>Mulai Voting Eliminasi Sekarang!</span>
        </button>
      </div>
    </div>
  );
}
