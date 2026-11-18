"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/store/gameStore";
import { GameHistoryEntry } from "@/lib/game/types";
import { fetchGameHistoryFromSupabase } from "@/lib/supabase/gameSync";
import { sound } from "@/lib/audio";
import { ArrowLeft, Trophy, Calendar, Shield, UserX, Ghost, Cloud } from "lucide-react";

export default function HistoryPage() {
  const { gameHistory } = useGameStore();
  const [cloudHistory, setCloudHistory] = useState<GameHistoryEntry[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  useEffect(() => {
    let active = true;
    fetchGameHistoryFromSupabase().then((data) => {
      if (!active || !data) return;
      setCloudHistory(data);
      setIsCloudSynced(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const mergedHistory = useMemo(() => {
    const map = new Map<string, GameHistoryEntry>();
    for (const item of gameHistory) {
      map.set(item.id, item);
    }
    for (const item of cloudHistory) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
    return Array.from(map.values());
  }, [gameHistory, cloudHistory]);

  const totalGames = mergedHistory.length;
  const civilianWins = mergedHistory.filter((h) => h.winner === "Civilian").length;
  const undercoverWins = mergedHistory.filter((h) => h.winner === "Undercover" || h.winner === "Penyusup").length;
  const mrWhiteWins = mergedHistory.filter((h) => h.winner === "Mr. White" || h.winner === "Penyusup").length;

  return (
    <div className="min-h-screen text-[#f0e6d2] p-4 sm:p-6 pb-20 relative font-sans">
      <div className="max-w-2xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => sound.playClick()}
              className="p-2.5 rounded-xl btn-secondary-3d text-amber-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500">
                Statistik & Riwayat
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Catatan rekor kemenangan dan pertandingan Undercover sebelumnya
              </p>
            </div>
          </div>

          {isCloudSynced && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-[10px] font-mono text-emerald-300 shrink-0">
              <Cloud className="w-3 h-3" />
              <span>Supabase</span>
            </span>
          )}
        </div>

        {/* Win Ratio Statistics */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="glass-panel p-4 rounded-3xl border-sky-500/30 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center mx-auto mb-1.5">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              Civilian
            </span>
            <span className="font-cinzel text-2xl font-black text-white">{civilianWins}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              {totalGames > 0 ? `${Math.round((civilianWins / totalGames) * 100)}%` : "0%"}
            </span>
          </div>

          <div className="glass-panel p-4 rounded-3xl border-rose-500/30 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-400/40 flex items-center justify-center mx-auto mb-1.5">
              <UserX className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
              Undercover
            </span>
            <span className="font-cinzel text-2xl font-black text-white">{undercoverWins}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              {totalGames > 0 ? `${Math.round((undercoverWins / totalGames) * 100)}%` : "0%"}
            </span>
          </div>

          <div className="glass-panel p-4 rounded-3xl border-purple-500/30 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-400/40 flex items-center justify-center mx-auto mb-1.5">
              <Ghost className="w-5 h-5 text-purple-300" />
            </div>
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
              Mr. White
            </span>
            <span className="font-cinzel text-2xl font-black text-white">{mrWhiteWins}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              {totalGames > 0 ? `${Math.round((mrWhiteWins / totalGames) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Riwayat Pertandingan Terakhir ({totalGames})
          </span>

          {totalGames === 0 ? (
            <div className="glass-panel p-8 rounded-3xl border-purple-500/20 text-center shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-sm font-bold text-slate-300">Belum ada riwayat permainan.</p>
              <p className="text-xs text-slate-400 mt-1">Mainkan satu ronde pass-and-play untuk mencatat statistik!</p>
              <Link
                href="/"
                onClick={() => sound.playClick()}
                className="mt-4 inline-block btn-gold-3d px-5 py-2.5 font-cinzel text-xs font-black tracking-wider uppercase shadow-lg"
              >
                Mulai Main Sekarang
              </Link>
            </div>
          ) : (
            mergedHistory.map((h) => {
              const isCiv = h.winner === "Civilian";
              const isUnd = h.winner === "Undercover";
              const isJoint = h.winner === "Penyusup";

              return (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl glass-card-subtle border-purple-500/20 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                        isCiv
                          ? "bg-sky-950/80 text-sky-300 border-sky-400/40"
                          : isUnd
                          ? "bg-rose-950/80 text-rose-300 border-rose-400/40"
                          : isJoint
                          ? "bg-amber-950/80 text-amber-300 border-amber-400/50"
                          : "bg-purple-950/80 text-purple-300 border-purple-400/40"
                      }`}
                    >
                      Pemenang: {isJoint ? "Tim Penyusup (UC & Mr. White)" : h.winner}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {h.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 my-2">
                    <div className="p-2 rounded-xl bg-sky-950/40 border border-sky-500/20">
                      Civilian: <span className="font-cinzel font-bold text-white">{h.secretWordCivilian}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20">
                      Undercover: <span className="font-cinzel font-bold text-white">{h.secretWordUndercover}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-purple-500/10 pt-2 flex justify-between">
                    <span>{h.playerCount} Pemain • {h.rounds} Ronde</span>
                    <span className="truncate max-w-[200px]">
                      {h.playersSummary.map((p) => p.name).join(", ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
