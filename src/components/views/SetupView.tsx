"use client";

import { useMemo } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import {
  Users,
  UserX,
  Ghost,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Zap,
  Flame,
} from "lucide-react";
import { validateSetup } from "@/lib/game/engine";
import { WORD_PAIRS } from "@/data/wordBank";

export function SetupView() {
  const { config, updateConfig, setStage } = useGameStore();

  const validation = validateSetup(config);

  const countsByDifficulty = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    for (const w of WORD_PAIRS) {
      if (w.difficulty === "easy") easy++;
      else if (w.difficulty === "medium") medium++;
      else if (w.difficulty === "hard") hard++;
    }
    return { all: WORD_PAIRS.length, easy, medium, hard };
  }, []);

  const difficultyOptions = [
    {
      id: "all" as const,
      label: "Acak",
      count: countsByDifficulty.all,
      desc: "Campuran seluruh 708 kata dari Easy hingga Hard agar tiap ronde tidak terduga.",
      activeClass: "bg-amber-500/20 border-amber-400 text-amber-200",
    },
    {
      id: "easy" as const,
      label: "Easy",
      count: countsByDifficulty.easy,
      desc: "Kata benda sehari-hari yang familiar dan santai untuk pemanasan.",
      activeClass: "bg-emerald-500/20 border-emerald-400 text-emerald-200",
    },
    {
      id: "medium" as const,
      label: "Medium",
      count: countsByDifficulty.medium,
      desc: "Pasangan kata lebih dekat dan cukup menjebak saat memberi petunjuk.",
      activeClass: "bg-sky-500/20 border-sky-400 text-sky-200",
    },
    {
      id: "hard" as const,
      label: "Hard",
      count: countsByDifficulty.hard,
      desc: "Kata abstrak, konsep tak terduga, dan pasangan super mirip yang bikin diskusi panas!",
      activeClass: "bg-rose-500/20 border-rose-400 text-rose-200",
    },
  ];

  const activeDiff =
    difficultyOptions.find((d) => d.id === config.difficulty) || difficultyOptions[0];

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

  const presets = [
    { label: "4 Pemain", players: 4, undercover: 1, mrWhite: 0 },
    { label: "5 Pemain", players: 5, undercover: 1, mrWhite: 1 },
    { label: "6 Pemain", players: 6, undercover: 1, mrWhite: 1 },
    { label: "8 Pemain", players: 8, undercover: 2, mrWhite: 1 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-5 z-10">
      {/* Step Indicator Header */}
      <div className="text-center mb-3.5 sm:mb-6">
        <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30">
          LANGKAH 1 DARI 4
        </span>
        <h2 className="font-cinzel text-xl sm:text-3xl font-black text-amber-100 tracking-wide mt-1.5">
          Atur Permainan
        </h2>
      </div>

      {/* 3D Bento Grid for Setup */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-4">
        {/* Left Bento: Stepper Controls + Difficulty (Span 7 cols on Desktop) */}
        <div className="md:col-span-7 bento-card p-3.5 sm:p-5 space-y-3">
          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {presets.map((preset, idx) => {
              const isSelected =
                config.playerCount === preset.players &&
                config.undercoverCount === preset.undercover &&
                config.mrWhiteCount === preset.mrWhite;
              return (
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
                  className={`min-h-[38px] px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition border cursor-pointer ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm"
                      : "glass-card-subtle border-purple-500/30 text-slate-300 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* 1. Total Players Stepper */}
          <div className="p-3 rounded-2xl glass-panel flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-sky-950/70 border border-sky-400/40 text-sky-300 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                  Jumlah Pemain
                </h4>
                <p className="text-[10px] text-slate-400">3 - 12 orang</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
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
              <span className="w-7 text-center font-cinzel text-lg sm:text-xl font-black text-amber-200">
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
          <div className="p-3 rounded-2xl glass-panel flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-950/70 border border-rose-400/40 text-rose-300 flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                  Undercover
                </h4>
                <p className="text-[10px] text-slate-400">Penyusup bersandi mirip</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
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
              <span className="w-7 text-center font-cinzel text-lg sm:text-xl font-black text-rose-400">
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
          <div className="p-3 rounded-2xl glass-panel flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
                <Ghost className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                  Mr. White
                </h4>
                <p className="text-[10px] text-slate-400">Penyusup tanpa kata</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
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
              <span className="w-7 text-center font-cinzel text-lg sm:text-xl font-black text-purple-300">
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

          {/* 4. Clue Difficulty Selector (Acak / Easy / Medium / Hard) */}
          <div className="p-3 rounded-2xl glass-panel space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-100">
                  Tingkat Kesulitan Clue
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-300">
                {activeDiff.count} Pasang
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {difficultyOptions.map((opt) => {
                const isSelected = config.difficulty === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      updateConfig({ difficulty: opt.id });
                    }}
                    className={`min-h-[42px] px-2 py-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? `${opt.activeClass} shadow-sm`
                        : "bg-black/35 border-purple-500/25 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xs font-extrabold leading-tight">{opt.label}</span>
                    <span className="text-[9px] font-mono opacity-80">{opt.count}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">{activeDiff.desc}</p>
          </div>

          {!validation.isValid && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validation.error}</span>
            </div>
          )}
        </div>

        {/* Right Bento: Live Role Distribution & Balance (Span 5 cols on Desktop) */}
        <div className="md:col-span-5 bento-card p-3.5 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                Distribusi Peran
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Seimbang</span>
              </span>
            </div>

            {/* Role Breakdown Metric Cards */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-400/30">
                <span className="text-[10px] font-bold text-sky-300 uppercase block mb-0.5">
                  Civilian
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-black text-sky-100">
                  {civilianCount}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-400/30">
                <span className="text-[10px] font-bold text-rose-300 uppercase block mb-0.5">
                  Undercover
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-black text-rose-100">
                  {config.undercoverCount}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/30">
                <span className="text-[10px] font-bold text-purple-300 uppercase block mb-0.5">
                  Mr. White
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-black text-purple-100">
                  {config.mrWhiteCount}
                </span>
              </div>
            </div>

            {/* Tactical Game Advice */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Aturan Kemenangan:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                • Civilian menang saat seluruh Undercover dan Mr. White tereliminasi.
              </p>
              <p className="text-[11px] text-slate-300 leading-snug">
                • Penyusup (Undercover / Mr. White) langsung menang jika Civilian tinggal 1 orang.
              </p>
              {config.mrWhiteCount > 0 && (
                <p className="text-[11px] text-purple-300 leading-snug">
                  • Mr. White juga menang instan jika berhasil menebak kata Civilian saat tertangkap!
                </p>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Setelah semua pemain melihat kartu, urutan bicara gameplay akan diacak otomatis.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleBack}
          className="btn-secondary-3d flex-1 min-h-[48px] py-3 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!validation.isValid}
          className="btn-gold-3d flex-[2] min-h-[48px] py-3.5 px-5 rounded-xl font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl cursor-pointer"
        >
          <span>Lanjut ke Nama Pemain</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
