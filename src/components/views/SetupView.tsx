"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import { Users, UserX, Ghost, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, Zap } from "lucide-react";
import { validateSetup } from "@/lib/game/engine";

export function SetupView() {
  const { config, updateConfig, setStage } = useGameStore();

  const validation = validateSetup(config);

  const handleNext = () => {
    if (!validation.isValid) return;
    sound.playClick();
    setStage("PLAYERS_INPUT");
  };

  const handleBack = () => {
    sound.playClick();
    setStage("LOBBY");
  };

  const civilianCount = config.playerCount - config.undercoverCount - config.mrWhiteCount;

  // Preset party sizes for quick selection
  const presets = [
    { label: "4 Pemain", players: 4, undercover: 1, mrWhite: 0 },
    { label: "5 Pemain", players: 5, undercover: 1, mrWhite: 1 },
    { label: "6 Pemain", players: 6, undercover: 1, mrWhite: 1 },
    { label: "8 Pemain", players: 8, undercover: 2, mrWhite: 1 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* Step Indicator Header */}
      <div className="text-center mb-5 sm:mb-7">
        <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30">
          LANGKAH 1 DARI 4
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wide mt-2">
          Atur Komposisi Pemain
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Sesuaikan jumlah warga sipil dan penyusup rahasia untuk keseimbangan game
        </p>
      </div>

      {/* 3D Bento Grid for Setup */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
        
        {/* Left Bento: Stepper Controls (Span 7 cols on Desktop) */}
        <div className="md:col-span-7 bento-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              Konfigurasi Jumlah Peran
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Total {config.playerCount} Orang
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 pt-1 pb-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playClick();
                  updateConfig({
                    playerCount: preset.players,
                    undercoverCount: preset.undercover,
                    mrWhiteCount: preset.mrWhite,
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  config.playerCount === preset.players &&
                  config.undercoverCount === preset.undercover &&
                  config.mrWhiteCount === preset.mrWhite
                    ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm"
                    : "glass-card-subtle border-purple-500/30 text-slate-300 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* 1. Total Players Stepper */}
          <div className="p-3.5 rounded-2xl glass-panel flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950/70 border border-sky-400/40 text-sky-300 flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Jumlah Pemain</h4>
                <p className="text-[11px] text-slate-400">Rentang 3 - 12 orang</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (config.playerCount > 3) {
                    sound.playClick();
                    updateConfig({ playerCount: config.playerCount - 1 });
                  }
                }}
                disabled={config.playerCount <= 3}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-cinzel text-xl font-black text-amber-200">
                {config.playerCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (config.playerCount < 12) {
                    sound.playClick();
                    updateConfig({ playerCount: config.playerCount + 1 });
                  }
                }}
                disabled={config.playerCount >= 12}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* 2. Undercover Stepper */}
          <div className="p-3.5 rounded-2xl glass-panel flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-400/40 text-rose-300 flex items-center justify-center shadow-md">
                <UserX className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Undercover</h4>
                <p className="text-[11px] text-slate-400">Penyusup bersandi mirip</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (config.undercoverCount > 1) {
                    sound.playClick();
                    updateConfig({ undercoverCount: config.undercoverCount - 1 });
                  }
                }}
                disabled={config.undercoverCount <= 1}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-cinzel text-xl font-black text-rose-400">
                {config.undercoverCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (config.undercoverCount < config.playerCount - 2) {
                    sound.playClick();
                    updateConfig({ undercoverCount: config.undercoverCount + 1 });
                  }
                }}
                disabled={config.undercoverCount >= config.playerCount - 2}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* 3. Mr. White Stepper */}
          <div className="p-3.5 rounded-2xl glass-panel flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-400/40 text-purple-300 flex items-center justify-center shadow-md">
                <Ghost className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Mr. White</h4>
                <p className="text-[11px] text-slate-400">Penyusup buta petunjuk</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (config.mrWhiteCount > 0) {
                    sound.playClick();
                    updateConfig({ mrWhiteCount: config.mrWhiteCount - 1 });
                  }
                }}
                disabled={config.mrWhiteCount <= 0}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-cinzel text-xl font-black text-purple-300">
                {config.mrWhiteCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (config.mrWhiteCount < 2) {
                    sound.playClick();
                    updateConfig({ mrWhiteCount: config.mrWhiteCount + 1 });
                  }
                }}
                disabled={config.mrWhiteCount >= 2}
                className="w-10 h-10 rounded-xl btn-secondary-3d text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {!validation.isValid && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validation.error}</span>
            </div>
          )}
        </div>

        {/* Right Bento: Live Role Distribution & Balance (Span 5 cols on Desktop) */}
        <div className="md:col-span-5 bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                Distribusi Peran
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Rasio Seimbang</span>
              </span>
            </div>

            {/* Role Breakdown Metric Cards */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-400/30">
                <span className="text-[10px] font-bold text-sky-300 uppercase block mb-1">
                  Civilian
                </span>
                <span className="font-cinzel text-2xl font-black text-sky-100">
                  {civilianCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-400/30">
                <span className="text-[10px] font-bold text-rose-300 uppercase block mb-1">
                  Undercover
                </span>
                <span className="font-cinzel text-2xl font-black text-rose-100">
                  {config.undercoverCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-400/30">
                <span className="text-[10px] font-bold text-purple-300 uppercase block mb-1">
                  Mr. White
                </span>
                <span className="font-cinzel text-2xl font-black text-purple-100">
                  {config.mrWhiteCount}
                </span>
              </div>
            </div>

            {/* Tactical Game Advice */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Aturan Kemenangan Cepat:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                • Civilian menang saat seluruh penyusup tereliminasi.
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                • Undercover menang jika jumlah mereka tersisa sama dengan Civilian.
              </p>
              {config.mrWhiteCount > 0 && (
                <p className="text-[11px] text-purple-300 leading-relaxed">
                  • Mr. White menang instan jika tebakan kata terakhirnya tepat!
                </p>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Setelah ini, masukkan nama tiap pemain sesuai giliran duduk melingkar.
          </div>
        </div>

      </div>

      {/* Navigation Footer */}
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
          disabled={!validation.isValid}
          className="flex-[2] py-4 px-5 rounded-xl btn-gold-3d font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <span>Lanjut ke Nama Pemain</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
