import type {
  Matchup,
  MatchupId,
  MatchupResult,
  Player,
  PlayerId,
  RoomState,
  RoundStats,
  Topic,
  VoteOptionId
} from "@/types/game";

export function percentage(votes: number, totalVotes: number): number {
  if (totalVotes === 0) return 50;
  return Math.round((votes / totalVotes) * 100);
}

export function scoreMatchup(args: {
  matchup: Matchup;
  topic: Topic;
  players: Record<PlayerId, Player>;
  submissions: Record<PlayerId, string>;
  votes: Record<PlayerId, VoteOptionId>;
}): MatchupResult {
  const { matchup, topic, players, submissions, votes } = args;
  const optionA = matchup.optionByPlayer[matchup.playerA];
  const optionB = matchup.optionByPlayer[matchup.playerB];
  const votesCast = Object.values(votes);
  const votesA = votesCast.filter((vote) => vote === optionA).length;
  const votesB = votesCast.filter((vote) => vote === optionB).length;
  const totalVotes = votesA + votesB;
  const percentA = percentage(votesA, totalVotes);
  const percentB = totalVotes === 0 ? 50 : 100 - percentA;
  const pointsA = totalVotes === 0 ? 50 : percentA;
  const pointsB = totalVotes === 0 ? 50 : percentB;
  const winnerId =
    pointsA === pointsB ? null : pointsA > pointsB ? matchup.playerA : matchup.playerB;

  return {
    matchupId: matchup.id,
    topic,
    playerA: players[matchup.playerA],
    playerB: players[matchup.playerB],
    optionA,
    optionB,
    sideA: matchup.sideByPlayer[matchup.playerA],
    sideB: matchup.sideByPlayer[matchup.playerB],
    defenseA: submissions[matchup.playerA] ?? "",
    defenseB: submissions[matchup.playerB] ?? "",
    votesA,
    votesB,
    totalVotes,
    percentA,
    percentB,
    pointsA,
    pointsB,
    winnerId
  };
}

export function applyMatchupScore(state: RoomState, result: MatchupResult): RoomState {
  return {
    ...state,
    matchupResults: {
      ...state.matchupResults,
      [result.matchupId]: result
    },
    roundScores: {
      ...state.roundScores,
      [result.playerA.id]: (state.roundScores[result.playerA.id] ?? 0) + result.pointsA,
      [result.playerB.id]: (state.roundScores[result.playerB.id] ?? 0) + result.pointsB
    },
    totalScores: {
      ...state.totalScores,
      [result.playerA.id]: (state.totalScores[result.playerA.id] ?? 0) + result.pointsA,
      [result.playerB.id]: (state.totalScores[result.playerB.id] ?? 0) + result.pointsB
    }
  };
}

export function computeRoundStats(state: RoomState): RoundStats {
  const results = Object.values(state.matchupResults);
  const namedLabel = (result: MatchupResult) =>
    `${result.playerA.name} vs ${result.playerB.name}`;
  const settled = results.filter((result) => result.totalVotes > 0);

  const byMargin = [...settled].sort(
    (a, b) => Math.abs(b.percentA - b.percentB) - Math.abs(a.percentA - a.percentB)
  );
  const closest = [...settled].sort(
    (a, b) => Math.abs(a.percentA - a.percentB) - Math.abs(b.percentA - b.percentB)
  );
  const activePlayers = Object.values(state.players);
  const consistency = activePlayers
    .map((player) => {
      const playerResults = results.filter(
        (result) => result.playerA.id === player.id || result.playerB.id === player.id
      );
      const scores = playerResults.map((result) =>
        result.playerA.id === player.id ? result.pointsA : result.pointsB
      );
      const spread = scores.length ? Math.max(...scores) - Math.min(...scores) : 999;
      return { player, spread, score: state.roundScores[player.id] ?? 0 };
    })
    .sort((a, b) => a.spread - b.spread || b.score - a.score)[0];
  const highScore = activePlayers
    .map((player) => ({ player, score: state.roundScores[player.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)[0];

  return {
    biggestLandslide: byMargin[0]
      ? {
          matchupId: byMargin[0].matchupId as MatchupId,
          label: namedLabel(byMargin[0]),
          margin: Math.abs(byMargin[0].percentA - byMargin[0].percentB)
        }
      : undefined,
    closestDebate: closest[0]
      ? {
          matchupId: closest[0].matchupId as MatchupId,
          label: namedLabel(closest[0]),
          margin: Math.abs(closest[0].percentA - closest[0].percentB)
        }
      : undefined,
    mostConsistentPlayer: consistency
      ? {
          playerId: consistency.player.id,
          name: consistency.player.name,
          score: consistency.score
        }
      : undefined,
    highestSingleRoundScore: highScore
      ? {
          playerId: highScore.player.id,
          name: highScore.player.name,
          score: highScore.score
        }
      : undefined
  };
}
