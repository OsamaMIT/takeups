"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { AnimatedScore } from "@/components/game/AnimatedScore";
import type { PublicPlayer } from "@/types/game";

export function Leaderboard({
  players,
  title = "Leaderboard",
  mode = "total"
}: {
  players: PublicPlayer[];
  title?: string;
  mode?: "total" | "round";
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
        <Trophy size={15} className="text-takeups-gold" />
        {title}
      </h3>
      <motion.div layout className="space-y-2">
        {players.map((player, index) => (
          <motion.div
            layout
            key={player.id}
            className="grid min-h-14 grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md border border-takeups-border bg-takeups-elevated/80 px-3"
          >
            <div className="font-mono text-sm font-bold text-takeups-muted">#{index + 1}</div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-takeups-text">{player.name}</div>
              <div className="text-xs text-takeups-muted">
                {mode === "round" ? "Round points" : "Total points"}
              </div>
            </div>
            <div className="font-mono text-xl font-bold text-takeups-text">
              <AnimatedScore value={mode === "round" ? player.roundScore : player.score} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
