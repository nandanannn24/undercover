"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { shuffle } from "@/lib/game/engine";
import { AVATAR_OPTIONS, CartoonAvatar } from "@/components/CartoonAvatar";
import { ArrowLeft, ArrowRight, Dices, AlertCircle, Sparkles, UserCheck } from "lucide-react";

const COOL_NICKNAMES = [
  "Rizky", "Dimas", "Aulia", "Farhan", "Nabila", "Bagas", "Dinda",
  "Fahmi", "Citra", "Yoga", "Tiara", "Agung", "Salsa", "Ilham", "Putri",
  "Bayu", "Maya", "Doni", "Rina", "Arya", "Kevin", "Rendy", "Dewi"
];

export function PlayerInputView() {
  const { playerInputs, updatePlayerInput, setStage, setPlayerInputs } = useGameStore();
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRandomizeNames = () => {
    sound.playClick();
    const shuffled = shuffle(COOL_NICKNAMES);
    const updated = playerInputs.map((p, idx) => ({
      ...p,
      name: shuffled[idx] || `Pemain ${idx + 1}`,
    }));
    setPlayerInputs(updated);
    setErrorMsg("");
  };

  const handleNext = () => {
    const names = playerInputs.map((p) => p.name.trim());
    if (names.some((n) => !n)) {
      setErrorMsg("Semua pemain wajib memiliki nama!");
      sound.playClick();
      return;
    }

    const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
    if (uniqueNames.size < names.length) {
      setErrorMsg("Nama pemain tidak boleh ada yang sama!");
      sound.playClick();
      return;
    }

    setErrorMsg("");
    sound.playClick();
    setStage("CONFIRMATION");
  };

  const handleBack = () => {
    sound.playClick();
    setStage("SETUP");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30">
            LANGKAH 2 DARI 4
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mt-1.5">
            Nama & Karakter Pemain
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Ketik nama panggilan untuk tiap pemain atau gunakan tombol acak
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomizeNames}
          className="px-4 py-2.5 rounded-xl btn-secondary-3d text-xs font-bold text-amber-300 flex items-center gap-2 cursor-pointer shadow-sm active:translate-y-1"
          title="Isi nama acak otomatis"
        >
          <Dices className="w-4 h-4 text-amber-400" />
          <span>Isi Nama Acak</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3D Bento Grid: Players Cards (2 columns on tablet/desktop) */}
      <div className="bento-card p-4 sm:p-5 mb-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <span className="text-xs font-bold text-amber-200">
            Daftar {playerInputs.length} Pemain Aktif
          </span>
          <span className="text-[11px] text-slate-400">
            Ketuk avatar untuk ganti lambang
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[52vh] overflow-y-auto pr-1">
          {playerInputs.map((p, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl glass-panel flex items-center gap-3 transition-all hover:border-amber-400/40"
            >
              {/* Character Avatar Trigger */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatarIndex(selectedAvatarIndex === idx ? null : idx);
                  sound.playClick();
                }}
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
                title="Ganti Karakter"
              >
                <CartoonAvatar id={p.avatar} size="md" />
              </button>

              {/* Name Input Field */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400/90">
                    Pemain #{idx + 1}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Maks 16 huruf
                  </span>
                </div>
                <input
                  type="text"
                  value={p.name}
                  maxLength={16}
                  placeholder={`Nama Pemain ${idx + 1}`}
                  onChange={(e) => {
                    updatePlayerInput(idx, { name: e.target.value });
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {selectedAvatarIndex !== null && (
        <div className="mb-5 p-4 rounded-3xl bento-card border border-amber-500/40 animate-fadeIn shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Pilih Lambang untuk Pemain #{selectedAvatarIndex + 1} ({playerInputs[selectedAvatarIndex]?.name || "Pemain"})
            </span>
            <button
              type="button"
              onClick={() => setSelectedAvatarIndex(null)}
              className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-black/30 cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {AVATAR_OPTIONS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  updatePlayerInput(selectedAvatarIndex, {
                    avatar: av.id,
                    color: av.borderColor,
                  });
                  setSelectedAvatarIndex(null);
                  sound.playClick();
                }}
                className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 hover:border-amber-400 hover:scale-105 active:scale-95 transition flex flex-col items-center shadow-sm cursor-pointer"
              >
                <CartoonAvatar id={av.id} size="sm" />
                <span className="text-[10px] font-bold text-slate-300 mt-1 truncate w-full text-center">
                  {av.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3.5 px-4 rounded-xl btn-secondary-3d text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-[2] py-4 px-5 rounded-xl btn-gold-3d font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Konfirmasi Urutan Giliran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
