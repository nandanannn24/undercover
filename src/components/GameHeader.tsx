"use client";

import { useState } from "react";
import { Volume2, VolumeX, HelpCircle, BookOpen, Home, Shield, Sparkles } from "lucide-react";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import Link from "next/link";

export function GameHeader() {
  const { isMuted, toggleMute } = useSettingsStore();
  const { stage, resetGame } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleMuteToggle = () => {
    toggleMute();
    sound.playClick();
  };

  return (
    <>
      <header className="w-full max-w-xl mx-auto flex items-center justify-between px-4 py-3 z-20">
        <div className="flex items-center gap-2">
          {stage !== "LOBBY" ? (
            <button
              onClick={() => {
                if (confirm("Kembali ke menu utama? Permainan saat ini akan dihentikan.")) {
                  resetGame();
                }
              }}
              className="p-2.5 rounded-xl btn-secondary-3d text-amber-300 transition active:scale-95"
              title="Menu Utama"
            >
              <Home className="w-4 h-4 stroke-[2]" />
            </button>
          ) : null}

          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none group"
            onClick={() => sound.playClick()}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md border border-amber-300/50 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">
              UNDERCOVER
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowHowToPlay(true);
              sound.playClick();
            }}
            className="p-2.5 rounded-xl btn-secondary-3d text-amber-300 transition active:scale-95"
            title="Cara Bermain"
          >
            <HelpCircle className="w-4 h-4 stroke-[2]" />
          </button>

          <Link
            href="/words"
            className="p-2.5 rounded-xl btn-secondary-3d text-amber-300 transition active:scale-95"
            title="Bank Kata Bersih"
            onClick={() => sound.playClick()}
          >
            <BookOpen className="w-4 h-4 stroke-[2]" />
          </Link>

          <button
            onClick={handleMuteToggle}
            className={`p-2.5 rounded-xl transition active:scale-95 ${
              isMuted
                ? "bg-rose-950/80 border border-rose-500/40 text-rose-400 shadow-sm"
                : "btn-secondary-3d text-amber-300"
            }`}
            title={isMuted ? "Nyalakan Suara" : "Bisukan Suara"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 stroke-[2]" />
            ) : (
              <Volume2 className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>
      </header>

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-purple-500/20 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-black text-amber-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Aturan & Cara Bermain
              </h3>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                <h4 className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  1. Civilian (Warga Sipil)
                </h4>
                <p className="text-slate-300 text-xs">
                  Menerima kata rahasia utama. Berikan petunjuk cerdik untuk mendeteksi penyusup tanpa membocorkan kata ke Mr. White!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30">
                <h4 className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  2. Undercover (Penyusup)
                </h4>
                <p className="text-slate-300 text-xs">
                  Menerima kata serupa yang masih satu rumpun. Cari tahu apakah Anda adalah Undercover dan berbaurlah agar tidak dicurigai!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <h4 className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  3. Mr. White (Penyusup Buta)
                </h4>
                <p className="text-slate-300 text-xs">
                  Tidak memiliki kata sama sekali! Karang deskripsi Anda. Jika tertangkap saat voting, tebak kata Civilian untuk <strong>langsung memenangkan game!</strong>
                </p>
              </div>

              <div className="border-t border-purple-500/20 pt-3">
                <h4 className="font-bold text-amber-200 mb-1.5">Alur Permainan:</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-xs">
                  <li><strong>Setup:</strong> Tentukan jumlah pemain dan nama.</li>
                  <li><strong>Buka Kartu:</strong> Oper HP bergantian untuk melihat kata rahasia.</li>
                  <li><strong>Diskusi:</strong> Berikan petunjuk satu kata/frasa secara bergantian.</li>
                  <li><strong>Voting:</strong> Pilih pemain yang paling mencurigakan untuk dieliminasi.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHowToPlay(false);
                sound.playClick();
              }}
              className="mt-5 w-full py-3.5 rounded-xl btn-gold-3d font-cinzel text-xs font-black tracking-wider uppercase"
            >
              Mengerti & Siap Main
            </button>
          </div>
        </div>
      )}
    </>
  );
}
