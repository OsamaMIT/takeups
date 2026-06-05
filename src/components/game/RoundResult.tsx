"use client";

import { ArrowRight, Gauge, Medal, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Leaderboard } from "@/components/game/Leaderboard";
import type { PublicRoomState } from "@/types/game";

export function RoundResult({
  state,
  isHost,
  onNextRound
}: {
  state: PublicRoomState;
  isHost: boolean;
  onNextRound: () => void;
}) {
  const roundBoard = [...state.players].sort((a, b) => b.roundScore - a.roundScore);
  return (
    <div className="space-y-6">
      <Card className="p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              Round {state.roundNumber} Complete
            </p>
            <h1 className="mt-2 font-heading text-4xl font-semibold text-takeups-text">
              The chamber has rendered judgment.
            </h1>
          </div>
          <Button
            type="button"
            disabled={!isHost}
            variant="primary"
            icon={state.finalRoundReached ? <Medal size={17} /> : <ArrowRight size={17} />}
            onClick={onNextRound}
          >
            {state.finalRoundReached ? "Final Results" : "Next Round"}
          </Button>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <Leaderboard players={roundBoard} title="Round Leaderboard" mode="round" />
        </Card>
        <Card className="p-5">
          <Leaderboard players={state.leaderboard} title="Total Leaderboard" mode="total" />
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Biggest Landslide" value={state.roundStats.biggestLandslide?.label ?? "No votes"} icon={<Gauge size={17} />} />
        <StatCard label="Closest Debate" value={state.roundStats.closestDebate?.label ?? "No votes"} icon={<Gauge size={17} />} />
        <StatCard label="Most Consistent" value={state.roundStats.mostConsistentPlayer?.name ?? "No data"} icon={<RotateCcw size={17} />} />
        <StatCard label="Highest Round" value={state.roundStats.highestSingleRoundScore?.name ?? "No data"} icon={<Medal size={17} />} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-3 text-takeups-blue">{icon}</div>
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">{label}</div>
      <div className="mt-2 min-h-12 text-sm font-semibold text-takeups-text">{value}</div>
    </Card>
  );
}
