import { Role, Player, GameConfig } from "./types";
import { WordPair, WORD_PAIRS } from "@/data/wordBank";
import { AVATAR_OPTIONS } from "@/components/CartoonAvatar";

export const DEFAULT_AVATARS = AVATAR_OPTIONS;

/**
 * Cryptographically secure random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  if (min >= max) return min;
  const range = max - min + 1;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const uintArray = new Uint32Array(1);
    crypto.getRandomValues(uintArray);
    return min + (uintArray[0] % range);
  }
  return Math.floor(Math.random() * range) + min;
}

/**
 * Cryptographically secure Fisher-Yates shuffle
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
 * Select a truly random word pair, avoiding recently used pairs in the current session
 */
export function selectWordPair(
  config: GameConfig,
  availableWords: WordPair[] = WORD_PAIRS,
  excludedIds: string[] = []
): WordPair {
  let pool = availableWords;

  // Filter category if specified
  if (config.selectedCategories && config.selectedCategories.length > 0) {
    const catFiltered = pool.filter((w) => config.selectedCategories.includes(w.category));
    if (catFiltered.length > 0) {
      pool = catFiltered;
    }
  }

  // Filter difficulty if specified
  if (config.difficulty && config.difficulty !== "all") {
    const diffFiltered = pool.filter((w) => w.difficulty === config.difficulty);
    if (diffFiltered.length > 0) {
      pool = diffFiltered;
    }
  }

  // Filter out recently used pairs if pool is large enough
  if (excludedIds.length > 0) {
    const freshPool = pool.filter((w) => !excludedIds.includes(w.id));
    if (freshPool.length > 0) {
      pool = freshPool;
    }
  }

  if (pool.length === 0) {
    pool = availableWords;
  }

  const randomIndex = getRandomInt(0, pool.length - 1);
  return pool[randomIndex];
}

/**
 * Distribute roles and words cleanly across players.
 * Preserves player seating order and player names 100%.
 * Guarantees Mr. White is NEVER assigned to player index 0 (first speaker).
 */
export function distributeRolesAndWords(
  playerNames: { name: string; avatar: string; color: string }[],
  config: GameConfig,
  wordPair: WordPair
): Player[] {
  const roles: Role[] = [];

  // 1. Add Mr. White count
  for (let i = 0; i < config.mrWhiteCount; i++) {
    roles.push("Mr. White");
  }

  // 2. Add Undercover count
  for (let i = 0; i < config.undercoverCount; i++) {
    roles.push("Undercover");
  }

  // 3. Fill the rest with Civilian
  while (roles.length < playerNames.length) {
    roles.push("Civilian");
  }

  // 4. Crypto-shuffle roles array
  let shuffledRoles = shuffle(roles);

  // 5. Hard Guarantee: Mr. White is NEVER the first speaker (index 0).
  // We swap within the roles array before mapping to players, ensuring seating order is completely intact.
  if (shuffledRoles[0] === "Mr. White" && shuffledRoles.length > 1) {
    // Find non-Mr. White index to swap with
    const nonMrWhiteIndices: number[] = [];
    for (let i = 1; i < shuffledRoles.length; i++) {
      if (shuffledRoles[i] !== "Mr. White") {
        nonMrWhiteIndices.push(i);
      }
    }

    if (nonMrWhiteIndices.length > 0) {
      const targetIdx = nonMrWhiteIndices[getRandomInt(0, nonMrWhiteIndices.length - 1)];
      const temp = shuffledRoles[0];
      shuffledRoles[0] = shuffledRoles[targetIdx];
      shuffledRoles[targetIdx] = temp;
    }
  }

  // 6. Map to Player objects keeping exact name & avatar positions
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
  return guess.trim().toLowerCase() === civilianWord.trim().toLowerCase();
}
