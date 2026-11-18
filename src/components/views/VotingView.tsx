"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import { Vote, ArrowLeft, Check } from "lucide-react";

export function VotingView() {
  const { players, currentRound, castVote, setStage } = useGameStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const activePlayers = players.filter((p) => !p.isEliminated);
  const selectedPlayer = activePlayers.find((p) => p.id === selectedPlayerId);

  const handleSubmitVote = () => {
    if (!selectedPlayerId) return;
    sound.playClick();
    castVote(selectedPlayerId);
  };

  const handleBackToDiscussion = () => {
    sound.playClick();
    setStage("DISCUSSION");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-2 z-10 flex flex-col gap-3">
      {/* Compact Header */}
      <div className="text-center">
        <span className="font-mono text-[10px] font-bold tracking-widest text-rose-400 uppercase bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/40 inline-block">
          VOTING ELIMINASI • RONDE {currentRound}
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100 tracking-wide mt-1.5">
          Siapa Penyusupnya?
        </h2>
      </div>

      {/* Single Compact Zero-Scroll Voting Card */}
      <div className="bento-card p-3.5 sm:p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {activePlayers.map((p) => {
            const isSelected = selectedPlayerId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedPlayerId((prev) => (prev === p.id ? null : p.id));
                }}
                className={`min-h-[54px] px-2.5 py-2 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-[0.97] ${
                  isSelected
                    ? "bg-rose-950/75 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] ring-2 ring-rose-500"
                    : "glass-panel border-purple-500/25 hover:border-amber-400/40"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CartoonAvatar id={p.avatar} size="xs" />
                  <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {p.name}
                  </span>
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

        {/* Immediate Action Bar Right Below Candidates (Zero Scroll!) */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleBackToDiscussion}
            className="btn-secondary-3d min-h-[48px] px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitVote}
            disabled={!selectedPlayerId}
            className="btn-chunky-rose flex-1 min-h-[48px] px-4 rounded-xl font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Vote className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {selectedPlayer
                ? `Eliminasi ${selectedPlayer.name}`
                : "Pilih Pemain"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
