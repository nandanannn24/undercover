"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { GameHeader } from "@/components/GameHeader";
import { ParticleBackground } from "@/components/ParticleBackground";
import { LobbyView } from "@/components/views/LobbyView";
import { SetupView } from "@/components/views/SetupView";
import { PlayerInputView } from "@/components/views/PlayerInputView";
import { ConfirmationView } from "@/components/views/ConfirmationView";
import { RevealView } from "@/components/views/RevealView";
import { DiscussionView } from "@/components/views/DiscussionView";
import { VotingView } from "@/components/views/VotingView";
import { MrWhiteGuessModal } from "@/components/views/MrWhiteGuessModal";
import { GameOverView } from "@/components/views/GameOverView";

export default function HomePage() {
  const { stage } = useGameStore();

  return (
    <main className="relative min-h-dvh text-[#f0e6d2] flex flex-col overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Interactive Constellation Particle Background */}
      <ParticleBackground />

      {/* Persistent Global Header */}
      <GameHeader />

      {/* Main Dynamic Viewport */}
      <div className="flex-1 flex flex-col justify-center items-center py-3 relative z-10 w-full">
        {stage === "LOBBY" && <LobbyView />}
        {stage === "SETUP" && <SetupView />}
        {stage === "PLAYERS_INPUT" && <PlayerInputView />}
        {stage === "CONFIRMATION" && <ConfirmationView />}
        {stage === "REVEAL" && <RevealView />}
        {stage === "DISCUSSION" && <DiscussionView />}
        {stage === "VOTING" && <VotingView />}
        {stage === "MR_WHITE_GUESS" && <MrWhiteGuessModal />}
        {stage === "GAME_OVER" && <GameOverView />}
      </div>

      {/* Subtle Bottom Vignette */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-0" />
    </main>
  );
}
