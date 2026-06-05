export type PlayerId = string;
export type MatchupId = string;
export type TopicId = string;
export type VoteOptionId = string;

export type GamePhase =
  | "lobby"
  | "writing"
  | "voting"
  | "matchup_result"
  | "round_result"
  | "game_over";

export type TopicIntensity = "spicy" | "absurd";

export type Player = {
  id: PlayerId;
  sessionId: string;
  name: string;
  connected: boolean;
  isHost: boolean;
  joinedAt: number;
  avatar?: string;
  color?: string;
};

export type RevealedPlayer = Pick<
  Player,
  "id" | "name" | "connected" | "isHost" | "joinedAt" | "avatar" | "color"
>;

export type Topic = {
  id: TopicId;
  prompt: string;
  sideA: string;
  sideB: string;
  pack?: string;
  intensity?: TopicIntensity;
};

export type CustomTopic = Pick<Topic, "id" | "prompt" | "sideA" | "sideB">;

export type Matchup = {
  id: MatchupId;
  topicId: TopicId;
  playerA: PlayerId;
  playerB: PlayerId;
  sideByPlayer: Record<PlayerId, string>;
  optionByPlayer: Record<PlayerId, VoteOptionId>;
};

export type RoomSettings = {
  writingSeconds: number;
  votingSeconds: number;
  maxDefenseChars: number;
  roundsToPlay: number | null;
  anonymousVoting: boolean;
  allowSpectators: boolean;
  allowLateJoin: boolean;
  topicPacks: string[];
  customTopics: CustomTopic[];
  intensity: TopicIntensity;
};

export type MatchupResult = {
  matchupId: MatchupId;
  topic: Topic;
  playerA: RevealedPlayer;
  playerB: RevealedPlayer;
  optionA: VoteOptionId;
  optionB: VoteOptionId;
  sideA: string;
  sideB: string;
  defenseA: string;
  defenseB: string;
  votesA: number;
  votesB: number;
  totalVotes: number;
  percentA: number;
  percentB: number;
  pointsA: number;
  pointsB: number;
  winnerId: PlayerId | null;
};

export type RoundStats = {
  biggestLandslide?: {
    matchupId: MatchupId;
    label: string;
    margin: number;
  };
  closestDebate?: {
    matchupId: MatchupId;
    label: string;
    margin: number;
  };
  mostConsistentPlayer?: {
    playerId: PlayerId;
    name: string;
    score: number;
  };
  highestSingleRoundScore?: {
    playerId: PlayerId;
    name: string;
    score: number;
  };
};

export type RoomState = {
  roomCode: string;
  hostId: PlayerId | null;
  phase: GamePhase;
  players: Record<PlayerId, Player>;
  spectators: Record<PlayerId, Player>;
  settings: RoomSettings;
  roundNumber: number;
  writingEndsAt?: number;
  votingEndsAt?: number;
  matchupResultEndsAt?: number;
  matchups: Matchup[];
  votingOrder: MatchupId[];
  usedTopicIds: TopicId[];
  currentVoteIndex: number;
  submissions: Record<MatchupId, Record<PlayerId, string>>;
  drafts: Record<PlayerId, Record<MatchupId, string>>;
  readyPlayers: Record<PlayerId, boolean>;
  votes: Record<MatchupId, Record<PlayerId, VoteOptionId>>;
  matchupResults: Record<MatchupId, MatchupResult>;
  roundScores: Record<PlayerId, number>;
  totalScores: Record<PlayerId, number>;
  roundStats: RoundStats;
  createdAt: number;
  updatedAt: number;
};

export type PublicPlayer = Pick<
  Player,
  "id" | "name" | "connected" | "isHost" | "joinedAt" | "avatar" | "color"
> & {
  score: number;
  roundScore: number;
  ready: boolean;
};

export type PublicVotingCard = {
  matchupId: MatchupId;
  topicPrompt: string;
  optionA: VoteOptionId;
  optionB: VoteOptionId;
  sideA: string;
  sideB: string;
  defenseA: string;
  defenseB: string;
  canVote: boolean;
  hasVoted: boolean;
  votedFor?: VoteOptionId;
  viewerIsOnStand: boolean;
  revealed?: {
    playerA: PublicPlayer;
    playerB: PublicPlayer;
  };
};

export type Assignment = {
  matchupId: MatchupId;
  topicPrompt: string;
  assignedSide: string;
  draft: string;
  submission?: string;
  locked: boolean;
};

export type PublicRoomState = {
  roomCode: string;
  hostId: PlayerId | null;
  phase: GamePhase;
  selfId: PlayerId | null;
  isSpectator: boolean;
  players: PublicPlayer[];
  spectators: PublicPlayer[];
  settings: RoomSettings;
  roundNumber: number;
  writingEndsAt?: number;
  votingEndsAt?: number;
  readyCount: number;
  activeCount: number;
  minPlayers: number;
  currentVoteIndex: number;
  votingTotal: number;
  currentVotingCard?: PublicVotingCard;
  currentMatchupResult?: MatchupResult;
  roundScores: Record<PlayerId, number>;
  totalScores: Record<PlayerId, number>;
  leaderboard: PublicPlayer[];
  roundStats: RoundStats;
  finalRoundReached: boolean;
  updatedAt: number;
};

export type ClientMessage =
  | { type: "join_room"; name: string; sessionId?: string }
  | { type: "start_round" }
  | { type: "update_draft"; matchupId: string; text: string }
  | { type: "submit_defenses"; defenses: Record<string, string> }
  | { type: "ready" }
  | { type: "unready" }
  | { type: "vote"; matchupId: string; votedFor: string }
  | { type: "next_round" }
  | { type: "update_settings"; settings: Partial<RoomSettings> }
  | { type: "kick_player"; playerId: string }
  | { type: "restart_game" };

export type ServerMessage =
  | {
      type: "snapshot";
      state: PublicRoomState;
      assignments: Assignment[];
      card: PublicVotingCard | null;
    }
  | { type: "state"; state: PublicRoomState }
  | { type: "private_assignments"; assignments: Assignment[] }
  | { type: "phase_changed"; phase: GamePhase }
  | { type: "current_vote"; card: PublicVotingCard | null }
  | { type: "matchup_result"; result: MatchupResult }
  | { type: "error"; message: string };
