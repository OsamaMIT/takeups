"use client";

import { Home, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Leaderboard } from "@/components/game/Leaderboard";
import type { PublicRoomState } from "@/types/game";

export function GameOver({
  state,
  isHost,
  onRestart
}: {
  state: PublicRoomState;
  isHost: boolean;
  onRestart: () => void;
}) {
  const winner = state.leaderboard[0];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-takeups-elevated px-5 py-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
            Final Judgment
          </p>
          <h1 className="mt-3 font-heading text-5xl font-semibold text-takeups-text">
            {winner?.name ?? "No winner"}
          </h1>
          <p className="mt-3 text-takeups-muted">Winner of Takeups room {state.roomCode}</p>
        </div>
        <div className="grid gap-0 md:grid-cols-[1fr_18rem]">
          <div className="p-5">
            <Leaderboard players={state.leaderboard} title="Final Leaderboard" />
          </div>
          <div className="border-t border-takeups-border bg-takeups-panel p-5 md:border-l md:border-t-0">
            <div className="rounded-md border border-takeups-border bg-takeups-bg p-4">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
                Share Card
              </div>
              <div className="mt-4 font-heading text-2xl font-semibold text-takeups-text">
                {winner?.name ?? "Nobody"} survived assigned opinions.
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-takeups-muted">
                <Share2 size={16} />
                Image export is not enabled in this version.
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <Button
                type="button"
                disabled={!isHost}
                variant="primary"
                icon={<RotateCcw size={16} />}
                onClick={onRestart}
              >
                Restart Game
              </Button>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-takeups-border bg-takeups-elevated px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-takeups-text transition hover:border-takeups-blue/60 hover:bg-[#1A2230] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-takeups-blue"
              >
                <Home size={16} />
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
