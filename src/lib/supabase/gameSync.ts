import { supabase } from "./client";
import { GameHistoryEntry } from "../game/types";
import { WordPair } from "@/data/wordBank";

/**
 * Save match history entry to Supabase
 */
export async function saveGameHistoryToSupabase(entry: GameHistoryEntry): Promise<boolean> {
  try {
    const { error } = await supabase.from("game_history").insert({
      id: entry.id,
      date: entry.date,
      winner: entry.winner,
      player_count: entry.playerCount,
      rounds: entry.rounds,
      secret_word_civilian: entry.secretWordCivilian,
      secret_word_undercover: entry.secretWordUndercover,
      players_summary: entry.playersSummary,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Supabase saveGameHistory error (falling back to local):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase network error:", err);
    return false;
  }
}

/**
 * Fetch match history entries from Supabase
 */
export async function fetchGameHistoryFromSupabase(): Promise<GameHistoryEntry[] | null> {
  try {
    const { data, error } = await supabase
      .from("game_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) {
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      date: row.date || new Date(row.created_at).toLocaleDateString("id-ID"),
      winner: row.winner,
      playerCount: row.player_count,
      rounds: row.rounds,
      secretWordCivilian: row.secret_word_civilian,
      secretWordUndercover: row.secret_word_undercover,
      playersSummary: row.players_summary || [],
    }));
  } catch {
    return null;
  }
}
