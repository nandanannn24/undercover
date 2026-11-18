"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGameStore } from "@/lib/store/gameStore";
import { sound } from "@/lib/audio";
import {
  Play,
  BookOpen,
  Shield,
  Users,
  Trophy,
  Compass,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";

export function LobbyView() {
  const { setStage } = useGameStore();
  const [activeRoleTab, setActiveRoleTab] = useState<"civilian" | "undercover" | "mr_white">("civilian");

  const handleStartSetup = () => {
    sound.playClick();
    setStage("SETUP");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-6 z-10">
      {/* 3D Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
        
        {/* BENTO CELL 1: Grand Hero Showcase with 3D Characters (Span 2 cols on Desktop) */}
        <div className="lg:col-span-2 bento-card-raised p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

          {/* Top Label & Tagline */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-mono tracking-wider uppercase">Party Game Deduksi Sosial</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/5">
              1 HP Bergantian • Pass & Play
            </span>
          </div>

          {/* Centerpiece: 3D Cartoon Characters Trio */}
          <div className="relative z-10 flex items-center justify-center -space-x-3 sm:-space-x-6 my-2 sm:my-3 select-none">
            {/* Detective (Civilian) */}
            <div className="relative w-24 h-32 sm:w-32 sm:h-40 transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] cursor-pointer"
                 onClick={() => { sound.playClick(); setActiveRoleTab("civilian"); }}>
              <Image
                src="/characters/civilian.png"
                alt="Civilian Detective"
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-contain"
                priority
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950/90 text-sky-300 border border-sky-400/40 opacity-90 shadow-sm">
                Civilian
              </span>
            </div>

            {/* Mr. White Ghost (Centerpiece, 3D Floating) */}
            <div className="relative w-28 h-36 sm:w-36 sm:h-44 z-20 animate-float-ghost drop-shadow-[0_16px_32px_rgba(192,132,252,0.45)] cursor-pointer"
                 onClick={() => { sound.playClick(); setActiveRoleTab("mr_white"); }}>
              <Image
                src="/characters/mr_white.png"
                alt="Mr. White Ghost"
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-contain"
                priority
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/90 text-purple-200 border border-purple-400/50 opacity-90 shadow-sm">
                Mr. White
              </span>
            </div>

            {/* Undercover Spy */}
            <div className="relative w-24 h-32 sm:w-32 sm:h-40 transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] cursor-pointer"
                 onClick={() => { sound.playClick(); setActiveRoleTab("undercover"); }}>
              <Image
                src="/characters/undercover.png"
                alt="Undercover Spy"
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-contain"
                priority
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-400/40 opacity-90 shadow-sm">
                Undercover
              </span>
            </div>
          </div>

          {/* Title & Authentic Copy */}
          <div className="relative z-10 text-center sm:text-left mt-1">
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]">
              UNDERCOVER
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-1 max-w-xl leading-relaxed">
              Game e Arek-Arek. Cari tahu siapa penyusup rahasia di antara kalian lewat petunjuk cerdik dan deduksi voting!
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pemain</span>
              <span className="font-cinzel text-sm sm:text-base font-black text-amber-200">3 - 12 Orang</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Durasi</span>
              <span className="font-cinzel text-sm sm:text-base font-black text-amber-200">~10 Menit</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kata Bersih</span>
              <span className="font-cinzel text-sm sm:text-base font-black text-amber-200">454 Pasang</span>
            </div>
          </div>
        </div>

        {/* BENTO CELL 2: Command & Play Console (Primary Action Box) */}
        <div className="bento-card p-5 sm:p-6 flex flex-col justify-between border-amber-500/30">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                LOBBY UTAMA
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100 tracking-wide mb-1.5">
              Siap Bermain?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Kumpulkan teman-temanmu dalam satu lingkaran. Satu orang memegang HP untuk memulai setup permainan.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleStartSetup}
              className="w-full py-4 px-5 rounded-2xl btn-gold-3d bg-gradient-to-b from-[#f7df8b] via-[#d4af37] to-[#b38b1f] text-[#1a0b2e] border-t border-amber-200 border-b-4 border-[#634305] font-cinzel text-sm sm:text-base font-black tracking-wider uppercase flex items-center justify-center gap-2 group shadow-xl active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-amber-950 transition-transform group-hover:scale-110" />
              <span>Mulai Main Sekarang</span>
            </button>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight">
                Kartu rahasia dilindungi fitur 3D Flip privat agar kata tidak terintip pemain lain.
              </p>
            </div>
          </div>
        </div>

        {/* BENTO CELL 3: Bank Kata Bersih Preview */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h4 className="font-cinzel text-sm sm:text-base font-black text-amber-100">
                  Bank Kata Bersih
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                454 Pasang
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Kata benda konkret 1 hingga 2 kata yang familiar, berimbang, dan aman dimainkan siapa saja.
            </p>

            {/* Pair Preview Chips */}
            <div className="space-y-1.5 mb-3">
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-300">Pensil</span>
                <span className="text-slate-500 text-[10px]">lawan</span>
                <span className="text-rose-300">Pulpen</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-300">Beruang</span>
                <span className="text-slate-500 text-[10px]">lawan</span>
                <span className="text-rose-300">Panda</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-300">Gelas</span>
                <span className="text-slate-500 text-[10px]">lawan</span>
                <span className="text-rose-300">Cangkir</span>
              </div>
            </div>
          </div>

          <Link
            href="/words"
            onClick={() => sound.playClick()}
            className="w-full py-2.5 px-3 rounded-xl btn-secondary-3d text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 shadow-sm active:translate-y-1"
          >
            <span>Buka Seluruh Bank Kata</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* BENTO CELL 4: Interactive Roles Explorer (Span 2 cols on Desktop) */}
        <div className="lg:col-span-2 bento-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                PANDUAN STRATEGI
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-black text-amber-100">
                Tiga Peran dalam Permainan
              </h3>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveRoleTab("civilian"); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeRoleTab === "civilian"
                    ? "bg-sky-950 text-sky-200 border border-sky-400/50 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Civilian
              </button>
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveRoleTab("undercover"); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeRoleTab === "undercover"
                    ? "bg-rose-950 text-rose-200 border border-rose-400/50 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Undercover
              </button>
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveRoleTab("mr_white"); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeRoleTab === "mr_white"
                    ? "bg-purple-950 text-purple-200 border border-purple-400/50 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Mr. White
              </button>
            </div>
          </div>

          {/* Active Role Detail Card */}
          <div className="p-4 rounded-2xl glass-card-subtle border-purple-500/25 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 drop-shadow-md">
              <Image
                src={
                  activeRoleTab === "civilian"
                    ? "/characters/civilian.png"
                    : activeRoleTab === "undercover"
                    ? "/characters/undercover.png"
                    : "/characters/mr_white.png"
                }
                alt={activeRoleTab}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              {activeRoleTab === "civilian" && (
                <>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h4 className="font-cinzel text-base font-black text-sky-300">Civilian (Warga Sipil)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 border border-sky-400/40 text-sky-200">Mayoritas</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    Mendapatkan kata rahasia utama. Tugas Anda memberikan petunjuk yang dimengerti sesama Civilian tanpa membongkar kata tersebut ke Mr. White.
                  </p>
                  <div className="text-[11px] text-amber-200/90 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Menang jika seluruh Undercover dan Mr. White tereliminasi.</span>
                  </div>
                </>
              )}

              {activeRoleTab === "undercover" && (
                <>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h4 className="font-cinzel text-base font-black text-rose-300">Undercover (Penyusup)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-400/40 text-rose-200">Menyamar</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    Mendapatkan kata yang sangat mirip dengan kata Civilian. Berikan petunjuk yang meyakinkan agar tidak dicurigai dalam sesi voting.
                  </p>
                  <div className="text-[11px] text-amber-200/90 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Menang jika bertahan hingga Civilian hanya tersisa 1 orang (bisa menang bersama Mr. White).</span>
                  </div>
                </>
              )}

              {activeRoleTab === "mr_white" && (
                <>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h4 className="font-cinzel text-base font-black text-purple-300">Mr. White (Hantu Tanpa Kata)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-400/40 text-purple-200">Kartu Kosong</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    Tidak mendapatkan kata sama sekali! Simak petunjuk pemain lain dan karang deskripsi yang umum.
                  </p>
                  <div className="text-[11px] text-amber-200/90 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Menang otomatis jika bertahan hingga Civilian sisa 1, atau saat tertangkap berhasil menebak kata Civilian!</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BENTO CELL 5: Match History & Quick Links */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h4 className="font-cinzel text-sm sm:text-base font-black text-amber-100">
                  Riwayat Pertandingan
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Catatan kemenangan tiap ronde tersimpan otomatis di perangkat untuk evaluasi strategi tim Anda.
            </p>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Penyimpanan:</span>
                <span className="font-bold text-amber-300">Lokal di Browser</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Privasi:</span>
                <span className="font-bold text-emerald-300">100% Aman & Offline</span>
              </div>
            </div>
          </div>

          <Link
            href="/history"
            onClick={() => sound.playClick()}
            className="w-full py-2.5 px-3 rounded-xl btn-secondary-3d text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 shadow-sm active:translate-y-1"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Lihat Riwayat & Rekap</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
