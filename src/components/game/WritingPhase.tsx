"use client";

import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { StandCard } from "@/components/game/StandCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Timer } from "@/components/ui/Timer";
import type { Assignment, PublicRoomState } from "@/types/game";

export function WritingPhase({
  state,
  assignments,
  onDraft,
  onReady,
  onUnready
}: {
  state: PublicRoomState;
  assignments: Assignment[];
  onDraft: (matchupId: string, text: string) => void;
  onReady: () => void;
  onUnready: () => void;
}) {
  const locked = assignments.some((assignment) => assignment.locked);
  const valid = assignments.length === 2 && assignments.every((assignment) => assignment.draft.trim().length > 0);
  return (
    <div className="space-y-6">
      <Card className="p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              YOUR OPINION HAS BEEN ASSIGNED
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-takeups-text">
              Defend it in {state.settings.maxDefenseChars} characters or less.
            </h1>
            <p className="mt-2 text-sm text-takeups-muted">
              {state.readyCount}/{state.activeCount} players locked in.
            </p>
          </div>
          <Timer endsAt={state.writingEndsAt} label="Writing Window" />
        </div>
      </Card>
      {state.isSpectator ? (
        <Card className="p-8 text-center text-takeups-muted">
          You are observing this round. New players join the stand next round.
        </Card>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <StandCard
                key={assignment.matchupId}
                assignment={assignment}
                maxChars={state.settings.maxDefenseChars}
                disabled={locked}
                onDraft={onDraft}
              />
            ))}
          </div>
          <motion.div layout className="sticky bottom-4 z-20 flex justify-end">
            <div className="rounded-lg border border-takeups-border bg-takeups-elevated/95 p-3 shadow-2xl backdrop-blur">
              {locked ? (
                <Button type="button" variant="gold" onClick={onUnready} icon={<Unlock size={16} />}>
                  Unlock
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  disabled={!valid}
                  onClick={onReady}
                  icon={<Lock size={16} />}
                >
                  Ready
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
