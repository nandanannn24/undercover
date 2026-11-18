import { NextResponse } from "next/server";
import { WORD_PAIRS, WordPair } from "@/data/wordBank";
import { supabaseAdmin } from "@/lib/supabase/server";

async function loadAllWordPairs(): Promise<WordPair[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("custom_words")
      .select("id, category, civilian, undercover, difficulty")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [...WORD_PAIRS];
    }

    const customPairs: WordPair[] = data.map((row) => ({
      id: row.id,
      category: row.category,
      civilian: row.civilian,
      undercover: row.undercover,
      difficulty: row.difficulty || "medium",
    }));

    return [...customPairs, ...WORD_PAIRS];
  } catch {
    return [...WORD_PAIRS];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    let filtered = await loadAllWordPairs();

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.civilian.toLowerCase().includes(search) ||
          p.undercover.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data kata" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, civilian, undercover, difficulty } = body;

    if (!category || !civilian || !undercover) {
      return NextResponse.json(
        { success: false, error: "Kategori, kata Civilian, dan kata Undercover wajib diisi." },
        { status: 400 }
      );
    }

    const cLower = civilian.toLowerCase().trim();
    const uLower = undercover.toLowerCase().trim();

    if (cLower === uLower) {
      return NextResponse.json(
        { success: false, error: "Kata Civilian dan Undercover tidak boleh sama!" },
        { status: 400 }
      );
    }

    const allPairs = await loadAllWordPairs();
    const exists = allPairs.some(
      (p) =>
        (p.civilian.toLowerCase() === cLower && p.undercover.toLowerCase() === uLower) ||
        (p.civilian.toLowerCase() === uLower && p.undercover.toLowerCase() === cLower)
    );

    if (exists) {
      return NextResponse.json(
        { success: false, error: "Pasangan kata ini sudah ada di database!" },
        { status: 409 }
      );
    }

    const newPair: WordPair = {
      id: `wp_${Date.now()}`,
      category: category.trim(),
      civilian: civilian.trim(),
      undercover: undercover.trim(),
      difficulty: difficulty || "medium",
    };

    const { error: insertError } = await supabaseAdmin.from("custom_words").insert({
      id: newPair.id,
      category: newPair.category,
      civilian: newPair.civilian,
      undercover: newPair.undercover,
      difficulty: newPair.difficulty,
    });

    return NextResponse.json(
      {
        success: true,
        data: newPair,
        persistedToSupabase: !insertError,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
