import { NextResponse } from "next/server";
import { WORD_PAIRS } from "@/data/wordBank";

export async function GET() {
  const counts: Record<string, number> = {};
  WORD_PAIRS.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const categories = Object.keys(counts)
    .sort()
    .map((name) => ({
      name,
      count: counts[name],
    }));

  return NextResponse.json({
    success: true,
    totalPairs: WORD_PAIRS.length,
    totalCategories: categories.length,
    categories,
  });
}
