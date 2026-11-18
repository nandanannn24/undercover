"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameConfig, GameStage, Player, Role, GameHistoryEntry } from "../game/types";
import { WordPair, WORD_PAIRS } from "@/data/wordBank";
import {
  DEFAULT_AVATARS,
  shuffle,
  selectWordPair,
  distributeRolesAndWords,
  pickRandomFirstSpeakerIndex,
  evaluateWinConditions,
  checkMrWhiteGuess,
} from "../game/engine";
import { sound } from "../audio";
import { saveGameHistoryToSupabase } from "../supabase/gameSync";

interface GameStore {
  stage: GameStage;
  setStage: (stage: GameStage) => void;

  config: GameConfig;
  updateConfig: (patch: Partial<GameConfig>) => void;

  playerInputs: { name: string; avatar: string; color: string }[];
  setPlayerInputs: (inputs: { name: string; avatar: string; color: string }[]) => void;
  updatePlayerInput: (index: number, patch: Partial<{ name: string; avatar: string; color: string }>) => void;

  players: Player[];
  activeWordPair: WordPair | null;
  currentRevealIndex: number;
  isCardFlipped: boolean;
  currentRound: number;
  currentSpeakerIndex: number;
  votedPlayer: Player | null;
  lastEliminatedNote: string;
  pendingNextStage: "DISCUSSION" | "GAME_OVER" | null;
  eliminatedHistory: { name: string; role: Role; round: number }[];
  winner: Role | null;
  winReason: string;

  gameHistory: GameHistoryEntry[];
  usedWordIds: string[];
  lastWordCategory: string;

  initPlayerInputs: (count: number) => void;
  startNewGame: () => boolean;
  flipSecretCard: () => void;
  nextRevealStep: () => void;
  nextSpeaker: () => void;
  castVote: (targetId: string) => void;
  continueAfterElimination: () => void;
  handleMrWhiteGuess: (guess: string) => boolean;
  playAgainSamePlayers: () => void;
  playAgainNewPlayers: () => void;
  resetGame: () => void;
}

const DEFAULT_CONFIG: GameConfig = {
  playerCount: 5,
  undercoverCount: 1,
  mrWhiteCount: 1,
  selectedCategories: [],
  difficulty: "all",
  discussionTimerSeconds: 60,
  votingTimerSeconds: 30,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      stage: "LOBBY",
      setStage: (stage) => set({ stage }),

      config: DEFAULT_CONFIG,
      updateConfig: (patch) => {
        const current = get().config;
        const updated = { ...current, ...patch };

        // Auto-clamp special roles so at least 2 Civilians always remain when playerCount shrinks
        const maxSpecial = Math.max(1, updated.playerCount - 2);
        if (updated.undercoverCount + updated.mrWhiteCount > maxSpecial) {
          const reducedMrWhite = Math.min(updated.mrWhiteCount, Math.max(0, maxSpecial - 1));
          updated.mrWhiteCount = reducedMrWhite;
          updated.undercoverCount = Math.max(1, Math.min(updated.undercoverCount, maxSpecial - reducedMrWhite));
        }

        set({ config: updated });

        if (patch.playerCount && patch.playerCount !== current.playerCount) {
          get().initPlayerInputs(patch.playerCount);
        }
      },

      playerInputs: Array.from({ length: 5 }, (_, i) => ({
        name: `Pemain ${i + 1}`,
        avatar: DEFAULT_AVATARS[i % DEFAULT_AVATARS.length].id,
        color: DEFAULT_AVATARS[i % DEFAULT_AVATARS.length].borderColor,
      })),

      setPlayerInputs: (inputs) => set({ playerInputs: inputs }),

      updatePlayerInput: (index, patch) => {
        const inputs = [...get().playerInputs];
        if (inputs[index]) {
          inputs[index] = { ...inputs[index], ...patch };
          set({ playerInputs: inputs });
        }
      },

      players: [],
      activeWordPair: null,
      currentRevealIndex: 0,
      isCardFlipped: false,
      currentRound: 1,
      currentSpeakerIndex: 0,
      votedPlayer: null,
      lastEliminatedNote: "",
      pendingNextStage: null,
      eliminatedHistory: [],
      winner: null,
      winReason: "",
      gameHistory: [],
      usedWordIds: [],
      lastWordCategory: "",

      initPlayerInputs: (count: number) => {
        const current = get().playerInputs;
        const newInputs = Array.from({ length: count }, (_, i) => {
          if (current[i]) return current[i];
          const av = DEFAULT_AVATARS[i % DEFAULT_AVATARS.length];
          return {
            name: `Pemain ${i + 1}`,
            avatar: av.id,
            color: av.borderColor,
          };
        });
        set({ playerInputs: newInputs });
      },

      startNewGame: () => {
        const { config, playerInputs, usedWordIds, lastWordCategory } = get();
        const syncedInputs = Array.from({ length: config.playerCount }, (_, i) => {
          if (playerInputs[i]) return playerInputs[i];
          const av = DEFAULT_AVATARS[i % DEFAULT_AVATARS.length];
          return {
            name: `Pemain ${i + 1}`,
            avatar: av.id,
            color: av.borderColor,
          };
        });

        const activeExcluded = usedWordIds.length >= WORD_PAIRS.length ? [] : usedWordIds;
        const wordPair = selectWordPair(config, WORD_PAIRS, activeExcluded, lastWordCategory);
        const distributed = distributeRolesAndWords(syncedInputs, config, wordPair);

        set({
          playerInputs: syncedInputs,
          players: distributed,
          activeWordPair: wordPair,
          usedWordIds: [...activeExcluded, wordPair.id],
          lastWordCategory: wordPair.category,
          currentRevealIndex: 0,
          isCardFlipped: false,
          currentRound: 1,
          currentSpeakerIndex: 0,
          votedPlayer: null,
          lastEliminatedNote: "",
          pendingNextStage: null,
          eliminatedHistory: [],
          winner: null,
          winReason: "",
          stage: "REVEAL",
        });

        sound.playRoleReveal("Civilian");
        return true;
      },

      flipSecretCard: () => {
        const isFlipped = !get().isCardFlipped;
        set({ isCardFlipped: isFlipped });
        sound.playCardFlip();

        if (isFlipped) {
          const { players, currentRevealIndex } = get();
          const curr = players[currentRevealIndex];
          if (curr) {
            sound.playRoleReveal(curr.role);
          }
        }
      },

      nextRevealStep: () => {
        const { currentRevealIndex, players } = get();
        sound.playClick();
        if (currentRevealIndex < players.length - 1) {
          set({
            currentRevealIndex: currentRevealIndex + 1,
            isCardFlipped: false,
          });
        } else {
          set({
            stage: "DISCUSSION",
            isCardFlipped: false,
            currentSpeakerIndex: 0,
          });
          sound.playTimerTick(false);
        }
      },

      nextSpeaker: () => {
        const { currentSpeakerIndex, players } = get();
        sound.playClick();
        const activePlayers = players.filter((p) => !p.isEliminated);
        const nextIdx = (currentSpeakerIndex + 1) % activePlayers.length;
        set({ currentSpeakerIndex: nextIdx });
      },

      castVote: (targetId: string) => {
        const { players, currentRound } = get();
        const target = players.find((p) => p.id === targetId);
        if (!target) return;

        sound.playVoteSelect();

        // Jika yang terpilih adalah Mr. White -> langsung tampilkan modal pengumuman Mr. White + input tebakan clue!
        if (target.role === "Mr. White") {
          set({
            votedPlayer: target,
            lastEliminatedNote: "",
            pendingNextStage: null,
            stage: "MR_WHITE_GUESS",
          });
          return;
        }

        // Civilian atau Undercover -> eliminasi, lalu tampilkan layar ELIMINATION_REVEAL untuk membongkar role aslinya!
        sound.playEliminationGong();
        const updatedPlayers = players.map((p) =>
          p.id === targetId ? { ...p, isEliminated: true, eliminatedRound: currentRound } : p
        );

        const newHistory = [...get().eliminatedHistory, { name: target.name, role: target.role, round: currentRound }];
        const winCheck = evaluateWinConditions(updatedPlayers);

        if (winCheck.isGameOver && winCheck.winner) {
          const entry: GameHistoryEntry = {
            id: `hist_${Date.now()}`,
            date: new Date().toLocaleDateString("id-ID"),
            winner: winCheck.winner,
            playerCount: players.length,
            rounds: currentRound,
            secretWordCivilian: get().activeWordPair?.civilian || "",
            secretWordUndercover: get().activeWordPair?.undercover || "",
            playersSummary: updatedPlayers.map((p) => ({
              name: p.name,
              role: p.role,
              isEliminated: p.isEliminated,
            })),
          };

          saveGameHistoryToSupabase(entry);

          set({
            players: updatedPlayers,
            votedPlayer: target,
            lastEliminatedNote: "",
            pendingNextStage: "GAME_OVER",
            eliminatedHistory: newHistory,
            winner: winCheck.winner,
            winReason: winCheck.reason || "",
            gameHistory: [entry, ...get().gameHistory.slice(0, 19)],
            stage: "ELIMINATION_REVEAL",
          });
        } else {
          set({
            players: updatedPlayers,
            votedPlayer: target,
            lastEliminatedNote: "",
            pendingNextStage: "DISCUSSION",
            eliminatedHistory: newHistory,
            stage: "ELIMINATION_REVEAL",
          });
        }
      },

      continueAfterElimination: () => {
        const { pendingNextStage, players, currentRound } = get();
        sound.playClick();

        if (pendingNextStage === "GAME_OVER") {
          sound.playVictory();
          set({
            pendingNextStage: null,
            stage: "GAME_OVER",
          });
        } else {
          set({
            pendingNextStage: null,
            currentRound: currentRound + 1,
            currentSpeakerIndex: pickRandomFirstSpeakerIndex(players),
            stage: "DISCUSSION",
          });
        }
      },

      handleMrWhiteGuess: (guess: string): boolean => {
        const { players, activeWordPair, currentRound, votedPlayer } = get();
        if (!votedPlayer || !activeWordPair) return false;

        const isCorrect = checkMrWhiteGuess(guess, activeWordPair.civilian);

        if (isCorrect) {
          sound.playVictory();
          const entry: GameHistoryEntry = {
            id: `hist_${Date.now()}`,
            date: new Date().toLocaleDateString("id-ID"),
            winner: "Mr. White",
            playerCount: players.length,
            rounds: currentRound,
            secretWordCivilian: activeWordPair.civilian,
            secretWordUndercover: activeWordPair.undercover,
            playersSummary: players.map((p) => ({
              name: p.name,
              role: p.role,
              isEliminated: p.isEliminated,
            })),
          };

          saveGameHistoryToSupabase(entry);

          set({
            winner: "Mr. White",
            winReason: `Mr. White (${votedPlayer.name}) berhasil menebak kata Civilian "${activeWordPair.civilian}" dengan tepat!`,
            gameHistory: [entry, ...get().gameHistory.slice(0, 19)],
            pendingNextStage: null,
            stage: "GAME_OVER",
          });
          return true;
        } else {
          sound.playEliminationGong();
          const updatedPlayers = players.map((p) =>
            p.id === votedPlayer.id ? { ...p, isEliminated: true, eliminatedRound: currentRound } : p
          );

          const newHistory = [
            ...get().eliminatedHistory,
            { name: votedPlayer.name, role: votedPlayer.role, round: currentRound },
          ];

          const note = `Tebakan "${guess.trim()}" salah! Mr. White resmi tereliminasi.`;
          const winCheck = evaluateWinConditions(updatedPlayers);

          if (winCheck.isGameOver && winCheck.winner) {
            const entry: GameHistoryEntry = {
              id: `hist_${Date.now()}`,
              date: new Date().toLocaleDateString("id-ID"),
              winner: winCheck.winner,
              playerCount: players.length,
              rounds: currentRound,
              secretWordCivilian: activeWordPair.civilian,
              secretWordUndercover: activeWordPair.undercover,
              playersSummary: updatedPlayers.map((p) => ({
                name: p.name,
                role: p.role,
                isEliminated: p.isEliminated,
              })),
            };

            saveGameHistoryToSupabase(entry);

            set({
              players: updatedPlayers,
              votedPlayer,
              lastEliminatedNote: note,
              pendingNextStage: "GAME_OVER",
              eliminatedHistory: newHistory,
              winner: winCheck.winner,
              winReason: winCheck.reason || "",
              gameHistory: [entry, ...get().gameHistory.slice(0, 19)],
              stage: "ELIMINATION_REVEAL",
            });
          } else {
            set({
              players: updatedPlayers,
              votedPlayer,
              lastEliminatedNote: note,
              pendingNextStage: "DISCUSSION",
              eliminatedHistory: newHistory,
              stage: "ELIMINATION_REVEAL",
            });
          }
          return false;
        }
      },

      playAgainSamePlayers: () => {
        const shuffledInputs = shuffle(get().playerInputs);
        set({ playerInputs: shuffledInputs });
        get().startNewGame();
      },

      playAgainNewPlayers: () => {
        set({ stage: "PLAYERS_INPUT" });
      },

      resetGame: () => {
        set({
          stage: "LOBBY",
          players: [],
          activeWordPair: null,
          currentRevealIndex: 0,
          isCardFlipped: false,
          currentRound: 1,
          currentSpeakerIndex: 0,
          votedPlayer: null,
          lastEliminatedNote: "",
          pendingNextStage: null,
          eliminatedHistory: [],
          winner: null,
          winReason: "",
        });
      },
    }),
    {
      name: "undercover-game-storage",
      partialize: (state) => ({
        config: state.config,
        playerInputs: state.playerInputs,
        gameHistory: state.gameHistory,
        usedWordIds: state.usedWordIds,
        lastWordCategory: state.lastWordCategory,
      }),
    }
  )
);
