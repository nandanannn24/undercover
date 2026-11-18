"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { CartoonAvatar } from "@/components/CartoonAvatar";
import { Vote, ArrowLeft, AlertTriangle, Check, ShieldAlert } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6">
        <span className="font-mono text-[10px] font-bold tracking-widest text-rose-400 uppercase bg-rose-950/80 px-3.5 py-1 rounded-full border border-rose-500/40 inline-block shadow-sm">
          VOTING ELIMINASI • RONDE {currentRound}
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mt-2">
          Siapa Penyusupnya?
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Musyawarahkan dan pilih satu pemain yang paling mencurigakan untuk dikeluarkan
        </p>
      </div>

      {/* 3D Bento Grid for Voting */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
        
        {/* Left Bento: Ballot Candidates List (Span 7 or 8 cols on Desktop) */}
        <div className="md:col-span-7 lg:col-span-8 bento-card p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              Surat Suara Pemain Aktif ({activePlayers.length} Kandidat)
            </h4>
            <span className="text-[10px] text-slate-400">
              Pilih 1 nama
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {activePlayers.map((p) => {
              const isSelected = selectedPlayerId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlayerId(p.id);
                    sound.playClick();
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                    isSelected
                      ? "bg-rose-950/60 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.35)] ring-2 ring-rose-500"
                      : "glass-panel border-purple-500/25 hover:border-amber-400/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CartoonAvatar id={p.avatar} size="sm" />
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-100 truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">Kandidat Eliminasi</p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? "border-rose-400 bg-rose-500 text-white"
                        : "border-slate-600 bg-black/40"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Bento: Target Inspection & Elimination Warning (Span 5 or 4 cols) */}
        <div className="md:col-span-5 lg:col-span-4 bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-rose-300">
                Peringatan Eliminasi
              </h4>
            </div>

            {selectedPlayer ? (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-center animate-fadeIn">
                <div className="flex justify-center mb-2">
                  <CartoonAvatar id={selectedPlayer.avatar} size="md" />
                </div>
                <h4 className="font-cinzel text-lg font-black text-white mb-1">
                  {selectedPlayer.name}
                </h4>
                <p className="text-xs text-rose-200/90 leading-relaxed mb-3">
                  Pemain ini akan dikeluarkan dari permainan. Jika dia adalah <strong>Mr. White</strong>, dia akan mendapatkan kesempatan menebak kata Civilian untuk membalikkan keadaan!
                </p>
                <span className="text-[10px] font-mono font-bold text-rose-300 uppercase px-2.5 py-1 rounded bg-black/40 border border-rose-500/30">
                  Target Terpilih
                </span>
              </div>
            ) : (
              <div className="p-5 rounded-2xl glass-card-subtle text-center border-purple-500/20 text-slate-400 text-xs">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p>Belum ada pemain yang dipilih.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ketuk salah satu kandidat di sebelah kiri untuk menentukan target eliminasi.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Pastikan keputusan voting sudah disetujui bersama oleh seluruh pemain aktif.
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleBackToDiscussion}
          className="btn-secondary-3d flex-1 py-3.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bahas Lagi</span>
        </button>

        <button
          type="button"
          onClick={handleSubmitVote}
          disabled={!selectedPlayerId}
          className="btn-chunky-rose flex-[2] py-4 px-5 font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xl"
        >
          <Vote className="w-4 h-4" />
          <span>Keluarkan Pemain Terpilih</span>
        </button>
      </div>
    </div>
  );
}
