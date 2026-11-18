"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { WORD_PAIRS, WORD_CATEGORIES, WordPair } from "@/data/wordBank";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { sound } from "@/lib/audio";
import {
  Search,
  Plus,
  Download,
  ArrowLeft,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export default function WordBankPage() {
  const { customWordPairs, addCustomWordPair, deleteCustomWordPair } = useSettingsStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Modal State for adding new pair
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState(WORD_CATEGORIES[0] || "Benda Sehari-hari");
  const [newCivilian, setNewCivilian] = useState("");
  const [newUndercover, setNewUndercover] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Combine static and custom words
  const allWords = useMemo(() => {
    return [...customWordPairs, ...WORD_PAIRS];
  }, [customWordPairs]);

  // Filtered
  const filteredWords = useMemo(() => {
    return allWords.filter((p) => {
      const matchSearch =
        !search ||
        p.civilian.toLowerCase().includes(search.toLowerCase()) ||
        p.undercover.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchDiff = selectedDifficulty === "all" || p.difficulty === selectedDifficulty;

      return matchSearch && matchCat && matchDiff;
    });
  }, [allWords, search, selectedCategory, selectedDifficulty]);

  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const paginatedWords = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredWords.slice(start, start + itemsPerPage);
  }, [filteredWords, page, itemsPerPage]);

  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allWords, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `undercover_word_bank_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreatePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCivilian.trim() || !newUndercover.trim()) {
      setModalFeedback("Kata Civilian dan Undercover tidak boleh kosong!");
      sound.playClick();
      return;
    }

    if (newCivilian.trim().toLowerCase() === newUndercover.trim().toLowerCase()) {
      setModalFeedback("Kata Civilian dan Undercover tidak boleh identik!");
      sound.playClick();
      return;
    }

    addCustomWordPair({
      category: newCategory,
      civilian: newCivilian.trim(),
      undercover: newUndercover.trim(),
      difficulty: newDifficulty,
    });

    sound.playClick();
    setNewCivilian("");
    setNewUndercover("");
    setModalFeedback("Pasangan kata baru berhasil ditambahkan!");
    setTimeout(() => {
      setShowAddModal(false);
      setModalFeedback(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen text-[#f0e6d2] p-4 sm:p-6 pb-20 relative font-sans">
      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-500/20">
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
                Database Bank Kata
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Koleksi {allWords.length} pasang kata ringkas lintas {WORD_CATEGORIES.length} kategori
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleExportJSON}
              className="btn-secondary-3d px-3.5 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Ekspor JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddModal(true);
                sound.playClick();
              }}
              className="btn-gold-3d px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kata</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="glass-panel p-3.5 rounded-2xl border-amber-500/20 shadow-sm">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
              Total Pasangan
            </span>
            <span className="font-cinzel text-2xl font-black text-amber-300">{allWords.length}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-amber-500/20 shadow-sm">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
              Kategori
            </span>
            <span className="font-cinzel text-2xl font-black text-purple-300">{WORD_CATEGORIES.length}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-amber-500/20 shadow-sm">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
              Tingkat Mudah
            </span>
            <span className="font-cinzel text-2xl font-black text-emerald-400">
              {allWords.filter((w) => w.difficulty === "easy").length}
            </span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-amber-500/20 shadow-sm">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
              Kata Custom
            </span>
            <span className="font-cinzel text-2xl font-black text-rose-400">
              {customWordPairs.length}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 rounded-3xl border-purple-500/20 mb-6 space-y-3 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              placeholder="Cari kata Civilian, Undercover, atau kategori..."
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Semua Kategori ({WORD_CATEGORIES.length})</option>
              {WORD_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#120924] text-white">
                  {c}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              className="bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all" className="bg-[#120924] text-white">Semua Tingkat Kesulitan</option>
              <option value="easy" className="bg-[#120924] text-white">Mudah (Easy)</option>
              <option value="medium" className="bg-[#120924] text-white">Sedang (Medium)</option>
              <option value="hard" className="bg-[#120924] text-white">Sulit (Hard)</option>
            </select>

            <span className="ml-auto text-xs font-mono text-slate-400 self-center">
              Ditemukan {filteredWords.length} kata
            </span>
          </div>
        </div>

        {/* Word Pairs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {paginatedWords.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-card-subtle border-purple-500/20 hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-amber-500/30">
                    {item.category}
                  </span>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                      item.difficulty === "easy"
                        ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                        : item.difficulty === "hard"
                        ? "bg-rose-950 text-rose-400 border-rose-500/40"
                        : "bg-sky-950 text-sky-400 border-sky-500/40"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30">
                    <span className="text-[9px] text-sky-400 font-bold block uppercase mb-0.5">
                      Civilian
                    </span>
                    <span className="font-cinzel text-sm font-bold text-white">{item.civilian}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                    <span className="text-[9px] text-rose-400 font-bold block uppercase mb-0.5">
                      Undercover
                    </span>
                    <span className="font-cinzel text-sm font-bold text-white">{item.undercover}</span>
                  </div>
                </div>
              </div>

              {item.id.startsWith("custom_") && (
                <div className="mt-3 pt-2 border-t border-purple-500/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Hapus kata custom ini?")) {
                        deleteCustomWordPair(item.id);
                        sound.playClick();
                      }
                    }}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page <= 1}
              className="btn-secondary-3d px-3.5 py-2 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>

            <span className="text-xs font-mono text-slate-400 px-3">
              Halaman {page} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={page >= totalPages}
              className="btn-secondary-3d px-3.5 py-2 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>

      {/* ADD CUSTOM WORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-purple-500/20 pb-3 mb-4">
              <h3 className="font-cinzel text-base font-black text-amber-200 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Tambah Pasangan Kata Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            {modalFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{modalFeedback}</span>
              </div>
            )}

            <form onSubmit={handleCreatePair} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  {WORD_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#120924] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Kata Civilian (Singkat, 1-2 kata)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pensil"
                  value={newCivilian}
                  onChange={(e) => setNewCivilian(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-2.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Kata Undercover (Mirip, 1-2 kata)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pulpen"
                  value={newUndercover}
                  onChange={(e) => setNewUndercover(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-2.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tingkat Kesulitan</label>
                <select
                  value={newDifficulty}
                  onChange={(e) =>
                    setNewDifficulty(e.target.value as "easy" | "medium" | "hard")
                  }
                  className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="easy" className="bg-[#120924] text-white">Mudah (Easy)</option>
                  <option value="medium" className="bg-[#120924] text-white">Sedang (Medium)</option>
                  <option value="hard" className="bg-[#120924] text-white">Sulit (Hard)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary-3d flex-1 py-2.5 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-gold-3d flex-1 py-2.5 text-xs font-black uppercase tracking-wider"
                >
                  Simpan Kata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
