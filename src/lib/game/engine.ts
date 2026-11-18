import { Role, Player, GameConfig } from "./types";
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
 * Exact-uniform role & word distribution:
 * - Mr. White is strictly NEVER placed at index 0 (first turn), uniformly distributed across indices [1..N-1].
 * - Undercover is completely FREE to land on ANY index [0..N-1], including index 0 (first turn).
 * - Remaining slots are uniformly filled with Civilian & Undercover using unbiased crypto Fisher-Yates.
 */
export function distributeRolesAndWords(
  playerNames: { name: string; avatar: string; color: string }[],
  config: GameConfig,
  wordPair: WordPair
): Player[] {
  const n = playerNames.length;
  const assignedRoles: Role[] = new Array<Role>(n).fill("Civilian");

  // 1. Place Mr. White strictly in indices [1 .. n-1] (NEVER index 0)
  const mrWhiteCount = Math.min(config.mrWhiteCount, Math.max(0, n - 1));
  const nonFirstIndices: number[] = [];
  for (let i = 1; i < n; i++) {
    nonFirstIndices.push(i);
  }
  const mrWhiteSlots = new Set<number>(shuffle(nonFirstIndices).slice(0, mrWhiteCount));
  for (const slot of mrWhiteSlots) {
    assignedRoles[slot] = "Mr. White";
  }

  // 2. Collect all remaining slots (INCLUDING index 0!) for Undercover + Civilian
  const remainingSlots: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!mrWhiteSlots.has(i)) {
      remainingSlots.push(i);
    }
  }

  // 3. Shuffle both remaining slots and remaining roles (Undercover is completely free to be index 0!)
  const shuffledSlots = shuffle(remainingSlots);
  const undercoverCount = Math.min(config.undercoverCount, shuffledSlots.length);
  const remainingRoles: Role[] = [];
  for (let i = 0; i < undercoverCount; i++) {
    remainingRoles.push("Undercover");
  }
  while (remainingRoles.length < shuffledSlots.length) {
    remainingRoles.push("Civilian");
  }
  const shuffledRemainingRoles = shuffle(remainingRoles);

  for (let i = 0; i < shuffledSlots.length; i++) {
    assignedRoles[shuffledSlots[i]] = shuffledRemainingRoles[i];
  }

  // 4. Map to Player objects preserving exact seating order and names
  const players: Player[] = playerNames.map((p, index) => {
    const role = assignedRoles[index];
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
 * Pick a random starting speaker index among active players where Mr. White is NEVER first.
 * Undercover and Civilian are both equally eligible to speak first.
 */
export function pickRandomFirstSpeakerIndex(players: Player[]): number {
  const activePlayers = players.filter((p) => !p.isEliminated);
  if (activePlayers.length <= 1) return 0;

  const eligibleIndices: number[] = [];
  for (let i = 0; i < activePlayers.length; i++) {
    if (activePlayers[i].role !== "Mr. White") {
      eligibleIndices.push(i);
    }
  }

  if (eligibleIndices.length === 0) return 0;
  return eligibleIndices[getRandomInt(0, eligibleIndices.length - 1)];
}

export interface WinConditionResult {
  isGameOver: boolean;
  winner?: Role;
  reason?: string;
}

export function evaluateWinConditions(players: Player[]): WinConditionResult {
  const activePlayers = players.filter((p) => !p.isEliminated);
  const activeCivilians = activePlayers.filter((p) => p.role === "Civilian").length;
  const activeUndercover = activePlayers.filter((p) => p.role === "Undercover").length;
  const activeMrWhite = activePlayers.filter((p) => p.role === "Mr. White").length;

  // Condition 1: All Undercovers and Mr. White eliminated
  if (activeUndercover === 0 && activeMrWhite === 0) {
    return {
      isGameOver: true,
      winner: "Civilian",
      reason: "Semua Undercover dan Mr. White telah tereliminasi! Warga sipil menang!",
    };
  }

  // Condition 2: Undercover >= Civilians + Mr. White
  if (activeUndercover >= activeCivilians + activeMrWhite) {
    return {
      isGameOver: true,
      winner: "Undercover",
      reason: "Jumlah Undercover kini seimbang dengan warga sipil. Undercover mengambil alih permainan!",
    };
  }

  return { isGameOver: false };
}

export function checkMrWhiteGuess(guess: string, civilianWord: string): boolean {
  if (!guess || !civilianWord) return false;
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return normalize(guess) === normalize(civilianWord);
}
