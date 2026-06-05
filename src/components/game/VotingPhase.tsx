"use client";

import { Gavel, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Timer } from "@/components/ui/Timer";
import type { PublicRoomState, PublicVotingCard } from "@/types/game";

export function VotingPhase({
  state,
  card,
  onVote
}: {
  state: PublicRoomState;
  card?: PublicVotingCard;
  onVote: (matchupId: string, optionId: string) => void;
}) {
  if (!card) {
    return <Card className="p-8 text-center text-takeups-muted">Preparing the next card.</Card>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              VOTING OPEN
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-takeups-text">
              THE ROOM IS JUDGING
            </h1>
            <p className="mt-2 text-sm text-takeups-muted">
              Card {state.currentVoteIndex + 1} of {state.votingTotal}
            </p>
          </div>
          <Timer endsAt={state.votingEndsAt} label="Voting Window" />
        </div>
      </Card>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        <Card className="overflow-hidden">
          <div className="border-b border-takeups-border bg-takeups-elevated px-5 py-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-takeups-muted">
              Assigned Debate
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-takeups-text md:text-4xl">
              {card.topicPrompt}
            </h2>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <VoteOption
              side={card.sideA}
              defense={card.defenseA}
              optionId={card.optionA}
              matchupId={card.matchupId}
              label="Stand A"
              disabled={!card.canVote || card.hasVoted}
              selected={card.votedFor === card.optionA}
              closed={card.hasVoted}
              onVote={onVote}
            />
            <VoteOption
              side={card.sideB}
              defense={card.defenseB}
              optionId={card.optionB}
              matchupId={card.matchupId}
              label="Stand B"
              disabled={!card.canVote || card.hasVoted}
              selected={card.votedFor === card.optionB}
              closed={card.hasVoted}
              onVote={onVote}
            />
          </div>
          {card.viewerIsOnStand ? (
            <div className="flex items-center justify-center gap-2 border-t border-takeups-border bg-takeups-red/10 px-4 py-4 text-center text-sm font-semibold text-takeups-red">
              <ShieldAlert size={17} />
              You are on the stand. The room is judging.
            </div>
          ) : card.hasVoted ? (
            <div className="border-t border-takeups-border bg-takeups-blue/10 px-4 py-4 text-center text-sm font-semibold text-takeups-blue">
              Vote recorded.
            </div>
          ) : null}
        </Card>
      </motion.div>
    </div>
  );
}

function VoteOption({
  label,
  side,
  defense,
  matchupId,
  optionId,
  disabled,
  selected,
  closed,
  onVote
}: {
  label: string;
  side: string;
  defense: string;
  matchupId: string;
  optionId: string;
  disabled: boolean;
  selected: boolean;
  closed: boolean;
  onVote: (matchupId: string, optionId: string) => void;
}) {
  return (
    <div className="flex min-h-80 flex-col border-takeups-border p-5 first:border-b md:first:border-b-0 md:first:border-r">
      <div className="text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">{label}</div>
      <div className="mt-3 rounded-md border border-takeups-border bg-takeups-bg p-3 text-sm font-semibold text-takeups-text">
        {side}
      </div>
      <blockquote className="mt-5 flex-1 font-heading text-2xl font-semibold leading-snug text-takeups-text">
        &quot;{defense}&quot;
      </blockquote>
      <Button
        type="button"
        variant="primary"
        disabled={disabled}
        onClick={() => onVote(matchupId, optionId)}
        icon={<Gavel size={16} />}
        className="mt-5 w-full"
      >
        {selected ? "Recorded" : closed ? "Closed" : `Vote ${label.slice(-1)}`}
      </Button>
    </div>
  );
}
