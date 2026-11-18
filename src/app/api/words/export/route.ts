import { NextResponse } from "next/server";
import { WORD_PAIRS } from "@/data/wordBank";

export async function GET() {
  return new NextResponse(JSON.stringify(WORD_PAIRS, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="undercover_word_bank.json"',
    },
  });
}
