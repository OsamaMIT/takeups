"use client";

import { motion } from "framer-motion";
import { CharacterCounter } from "@/components/game/CharacterCounter";
import { Card } from "@/components/ui/Card";
import type { Assignment } from "@/types/game";

export function StandCard({
  assignment,
  maxChars,
  disabled,
  onDraft
}: {
  assignment: Assignment;
  maxChars: number;
  disabled: boolean;
  onDraft: (matchupId: string, text: string) => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="border-b border-takeups-border bg-takeups-elevated px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
            ASSIGNED STAND
          </div>
          <h3 className="mt-2 font-heading text-xl font-semibold text-takeups-text">
            {assignment.topicPrompt}
          </h3>
        </div>
        <div className="space-y-4 p-4">
          <div className="rounded-md border border-takeups-blue/40 bg-takeups-blue/10 p-3 text-sm font-semibold text-takeups-text">
            {assignment.assignedSide}
          </div>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
              DEFENSE REQUIRED
            </span>
            <textarea
              value={assignment.draft}
              maxLength={maxChars}
              disabled={disabled}
              onChange={(event) => onDraft(assignment.matchupId, event.target.value)}
              className="min-h-32 w-full resize-none rounded-md border border-takeups-border bg-takeups-bg px-3 py-3 text-sm text-takeups-text outline-none transition placeholder:text-takeups-muted focus:border-takeups-blue disabled:opacity-70"
              placeholder="Make the impossible sound reasonable."
              aria-label={`Defense for ${assignment.assignedSide}`}
            />
          </label>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-takeups-muted">
              {assignment.locked ? "LOCKED IN" : "Draft"}
            </span>
            <CharacterCounter value={assignment.draft} max={maxChars} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
