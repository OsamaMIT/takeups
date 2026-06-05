"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { MatchupResult as MatchupResultType } from "@/types/game";

export function MatchupResult({ result }: { result?: MatchupResultType }) {
  if (!result) return <Card className="p-8 text-center text-takeups-muted">Counting votes.</Card>;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-takeups-border bg-takeups-elevated px-5 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
            THE ROOM HAS DECIDED
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-takeups-text md:text-5xl">
            {result.topic.prompt}
          </h1>
        </div>
        <div className="grid md:grid-cols-2">
          <ResultSide
            name={result.playerA.name}
            side={result.sideA}
            defense={result.defenseA}
            percent={result.percentA}
            points={result.pointsA}
            votes={result.votesA}
            accent="blue"
          />
          <ResultSide
            name={result.playerB.name}
            side={result.sideB}
            defense={result.defenseB}
            percent={result.percentB}
            points={result.pointsB}
            votes={result.votesB}
            accent="red"
          />
        </div>
      </Card>
    </div>
  );
}

function ResultSide({
  name,
  side,
  defense,
  percent,
  points,
  votes,
  accent
}: {
  name: string;
  side: string;
  defense: string;
  percent: number;
  points: number;
  votes: number;
  accent: "blue" | "red";
}) {
  const color = accent === "blue" ? "bg-takeups-blue" : "bg-takeups-red";
  return (
    <div className="border-takeups-border p-5 first:border-b md:first:border-b-0 md:first:border-r">
      <div className="text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
        Revealed Author
      </div>
      <h2 className="mt-2 font-heading text-2xl font-semibold text-takeups-text">{name}</h2>
      <div className="mt-3 rounded-md border border-takeups-border bg-takeups-bg p-3 text-sm font-semibold text-takeups-muted">
        {side}
      </div>
      <blockquote className="mt-5 min-h-32 rounded-md border border-takeups-border bg-takeups-bg p-4 font-heading text-xl font-semibold text-takeups-text">
        &quot;{defense}&quot;
      </blockquote>
      <div className="mt-5">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-mono text-4xl font-bold text-takeups-text">{percent}%</span>
          <span className="font-mono text-lg font-semibold text-takeups-gold">+{points}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-takeups-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${color}`}
          />
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-takeups-muted">
          {votes} vote{votes === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
