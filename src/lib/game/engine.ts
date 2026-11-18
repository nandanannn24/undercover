import { Role, Winner, Player, GameConfig } from "./types";
import { WordPair, WORD_PAIRS } from "@/data/wordBank";
import { AVATAR_OPTIONS } from "@/components/CartoonAvatar";

export const DEFAULT_AVATARS = AVATAR_OPTIONS;

/**
 * Cryptographically secure unbiased random integer in [min, max] (inclusive)
 * Uses rejection sampling to completely eliminate modulo bias.
 */
export function getRandomInt(min: number, max: number): number {
  if (min >= max) return min;
  const range = max - min + 1;

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - ((maxUint32 + 1) % range);
    const buf = new Uint32Array(1);
    let value: number;
    do {
      crypto.getRandomValues(buf);
      value = buf[0];
    } while (value > limit);
    return min + (value % range);
  }

  return Math.floor(Math.random() * range) + min;
}

/**
 * Cryptographically secure unbiased Fisher-Yates shuffle.
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function validateSetup(config: GameConfig): { isValid: boolean; error?: string } {
  if (config.playerCount < 3 || config.playerCount > 12) {
    return { isValid: false, error: "Jumlah pemain harus antara 3 dan 12 orang." };
  }
  const totalSpecial = config.undercoverCount + config.mrWhiteCount;
  if (totalSpecial >= config.playerCount - 1) {
    return { isValid: false, error: "Harus ada minimal 2 Civilian dalam permainan!" };
  }
  if (config.undercoverCount < 1) {
    return { isValid: false, error: "Minimal harus ada 1 Undercover." };
  }
  return { isValid: true };
}

/**
 * Select a highly randomized word pair:
 * - Avoids recently used word IDs until pool is exhausted
 * - Avoids repeating the same category back-to-back when alternatives exist
 * - Randomly flips Civilian <-> Undercover word direction (50/50) so pairs cannot be memorized
 */
export function selectWordPair(
  config: GameConfig,
  availableWords: WordPair[] = WORD_PAIRS,
  excludedIds: string[] = [],
  lastCategory?: string
): WordPair {
  let pool = [...availableWords];

  if (config.selectedCategories && config.selectedCategories.length > 0) {
    const catFiltered = pool.filter((w) => config.selectedCategories.includes(w.category));
    if (catFiltered.length > 0) {
      pool = catFiltered;
    }
  }

  if (config.difficulty && config.difficulty !== "all") {
    const diffFiltered = pool.filter((w) => w.difficulty === config.difficulty);
    if (diffFiltered.length > 0) {
      pool = diffFiltered;
    }
  }

  if (excludedIds.length > 0) {
    const freshPool = pool.filter((w) => !excludedIds.includes(w.id));
    if (freshPool.length > 0) {
      pool = freshPool;
    }
  }

  if (lastCategory) {
    const diffCategoryPool = pool.filter((w) => w.category !== lastCategory);
    if (diffCategoryPool.length > 0) {
      pool = diffCategoryPool;
    }
  }

  if (pool.length === 0) {
    pool = [...availableWords];
  }

  const shuffledPool = shuffle(pool);
  const picked = shuffledPool[getRandomInt(0, shuffledPool.length - 1)];

  // 50/50 random swap between civilian & undercover word so players can't memorize word order
  const shouldSwapDirection = getRandomInt(0, 1) === 1;
  if (shouldSwapDirection) {
    return {
      ...picked,
      civilian: picked.undercover,
      undercover: picked.civilian,
    };
  }

  return { ...picked };
}

/**
 * Exact-uniform role & word distribution across ALL players [0..N-1].
 * Every player (including #1 during card reveal) has an equal chance of getting any role.
 * When transitioning from REVEAL to DISCUSSION, `randomizeGameplayOrder()` reshuffles
 * the turn order and guarantees Mr. White is NEVER first speaker (Undercover is free).
 */
export function distributeRolesAndWords(
  playerNames: { name: string; avatar: string; color: string }[],
  config: GameConfig,
  wordPair: WordPair
): Player[] {
  const n = playerNames.length;
  const roles: Role[] = [];

  const mrWhiteCount = Math.min(config.mrWhiteCount, Math.max(0, n - 2));
  const undercoverCount = Math.min(config.undercoverCount, Math.max(1, n - mrWhiteCount - 1));

  for (let i = 0; i < mrWhiteCount; i++) roles.push("Mr. White");
  for (let i = 0; i < undercoverCount; i++) roles.push("Undercover");
  while (roles.length < n) roles.push("Civilian");

  const shuffledRoles = shuffle(roles);

  const players: Player[] = playerNames.map((p, index) => {
    const role = shuffledRoles[index];
    let clue = "";
    if (role === "Civilian") {
      clue = wordPair.civilian;
    } else if (role === "Undercover") {
      clue = wordPair.undercover;
    } else {
      clue = "Tidak ada clue - Anda harus menebak!";
    }

    return {
      id: `player_${index + 1}`,
      name: p.name.trim() || `Pemain ${index + 1}`,
      avatar: p.avatar,
      color: p.color,
      role,
      clue,
      isEliminated: false,
      votesReceived: 0,
    };
  });

  return players;
}

/**
 * Randomize the gameplay turn order AFTER all players have finished viewing their cards.
 * - Shuffles player order completely using unbiased crypto Fisher-Yates (re-shuffles once if identical to reveal order for N >= 3).
 * - Hard Guarantee: index 0 (first speaker) is NEVER Mr. White, while Undercover is completely free to be index 0.
 */
export function randomizeGameplayOrder(players: Player[]): Player[] {
  if (players.length <= 1) return [...players];

  const originalIds = players.map((p) => p.id).join(",");
  let ordered = shuffle(players);

  // Avoid returning the exact same reveal order when there are >= 3 players
  if (players.length >= 3 && ordered.map((p) => p.id).join(",") === originalIds) {
    ordered = shuffle(ordered);
  }

  // Hard Guarantee: Mr. White is NEVER first in gameplay order (index 0); Undercover is free
  if (ordered[0].role === "Mr. White") {
    const eligibleIndices: number[] = [];
    for (let i = 1; i < ordered.length; i++) {
      if (ordered[i].role !== "Mr. White") {
        eligibleIndices.push(i);
      }
    }
    if (eligibleIndices.length > 0) {
      const swapIdx = eligibleIndices[getRandomInt(0, eligibleIndices.length - 1)];
      const temp = ordered[0];
      ordered[0] = ordered[swapIdx];
      ordered[swapIdx] = temp;
    }
  }

  return ordered;
}

/**
 * Pick the first active speaker index following the seating order (#1 -> #2 -> ... -> #N)
 * where Mr. White is NEVER forced to speak first. Undercover and Civilian are both free to go first.
 */
export function pickRandomFirstSpeakerIndex(players: Player[]): number {
  const activePlayers = players.filter((p) => !p.isEliminated);
  if (activePlayers.length <= 1) return 0;

  const firstNonMrWhite = activePlayers.findIndex((p) => p.role !== "Mr. White");
  return firstNonMrWhite >= 0 ? firstNonMrWhite : 0;
}

export interface WinConditionResult {
  isGameOver: boolean;
  winner?: Winner;
  reason?: string;
}

/**
 * Official Undercover Win Conditions:
 * 1. All Undercovers & Mr. White eliminated -> Civilian wins.
 * 2. Only 1 (or 0) Civilian remains -> Surviving infiltrators win immediately:
 *    - Both Undercover & Mr. White alive -> Joint win ("Penyusup": Undercover & Mr. White)
 *    - Only Undercover alive -> Undercover wins
 *    - Only Mr. White alive -> Mr. White wins automatically without needing to guess
 * 3. While >= 2 Civilians remain (even e.g. 2 Civilian vs 2 Undercover), the game continues
 *    because Undercovers do not know each other's identities.
 */
export function evaluateWinConditions(players: Player[]): WinConditionResult {
  const activePlayers = players.filter((p) => !p.isEliminated);
  const activeCivilians = activePlayers.filter((p) => p.role === "Civilian").length;
  const activeUndercover = activePlayers.filter((p) => p.role === "Undercover").length;
  const activeMrWhite = activePlayers.filter((p) => p.role === "Mr. White").length;

  // 1. All infiltrators eliminated -> Civilian wins
  if (activeUndercover === 0 && activeMrWhite === 0) {
    return {
      isGameOver: true,
      winner: "Civilian",
      reason: "Semua Undercover dan Mr. White telah tereliminasi! Warga sipil menang!",
    };
  }

  // 2. Only 1 (or 0) Civilian left -> Surviving infiltrators dominate and win
  if (activeCivilians <= 1) {
    if (activeUndercover > 0 && activeMrWhite > 0) {
      return {
        isGameOver: true,
        winner: "Penyusup",
        reason: "Civilian hanya tersisa 1! Undercover dan Mr. White berhasil mendominasi dan menang bersama!",
      };
    }

    if (activeUndercover > 0) {
      return {
        isGameOver: true,
        winner: "Undercover",
        reason: "Civilian hanya tersisa 1! Undercover berhasil bertahan dan mendominasi permainan!",
      };
    }

    if (activeMrWhite > 0) {
      return {
        isGameOver: true,
        winner: "Mr. White",
        reason: "Civilian hanya tersisa 1! Mr. White berhasil lolos hingga akhir dan menang otomatis!",
      };
    }
  }

  return { isGameOver: false };
}

export function checkMrWhiteGuess(guess: string, civilianWord: string): boolean {
  if (!guess || !civilianWord) return false;
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return normalize(guess) === normalize(civilianWord);
}
