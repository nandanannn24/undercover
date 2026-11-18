export type Role = "Civilian" | "Undercover" | "Mr. White";

export type GameStage =
  | "LOBBY"
  | "SETUP"
  | "PLAYERS_INPUT"
  | "CONFIRMATION"
  | "REVEAL"
  | "DISCUSSION"
  | "VOTING"
  | "ELIMINATION_REVEAL"
  | "MR_WHITE_GUESS"
  | "GAME_OVER";

export interface Player {
  id: string;
  name: string;
  avatar: string; // Identifier for clean cartoon SVG icon
  color: string;
  role: Role;
  clue: string;
  isEliminated: boolean;
  eliminatedRound?: number;
  votesReceived: number;
}

export interface GameConfig {
  playerCount: number;
  undercoverCount: number;
  mrWhiteCount: number;
  selectedCategories: string[];
  difficulty: "all" | "easy" | "medium" | "hard";
  discussionTimerSeconds: number; // 0 = unlimited
  votingTimerSeconds: number;     // 0 = unlimited
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  winner: Role;
  playerCount: number;
  rounds: number;
  secretWordCivilian: string;
  secretWordUndercover: string;
  playersSummary: { name: string; role: Role; isEliminated: boolean }[];
}

export interface VoteRecord {
  voterId: string;
  targetPlayerId: string;
}
