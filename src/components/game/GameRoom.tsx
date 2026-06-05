"use client";

import usePartySocket from "partysocket/react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { ConnectionStatus } from "@/components/game/ConnectionStatus";
import { GameOver } from "@/components/game/GameOver";
import { Lobby } from "@/components/game/Lobby";
import { MatchupResult } from "@/components/game/MatchupResult";
import { RoundResult } from "@/components/game/RoundResult";
import { VotingPhase } from "@/components/game/VotingPhase";
import { WritingPhase } from "@/components/game/WritingPhase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toasts, type ToastMessage } from "@/components/ui/Toast";
import { encodeMessage } from "@/lib/messages";
import {
  getOrCreateSessionId,
  getPartyHost,
  getSoundMuted,
  getStoredDisplayName,
  setSoundMuted,
  storeDisplayName
} from "@/lib/session";
import type {
  Assignment,
  ClientMessage,
  GamePhase,
  PublicRoomState,
  RoomSettings,
  ServerMessage
} from "@/types/game";

export function GameRoom({ roomCode }: { roomCode: string }) {
  const [state, setState] = useState<PublicRoomState | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "open" | "closed">(
    "connecting"
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [muted, setMuted] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const phaseRef = useRef<GamePhase | null>(null);
  const draftFlushRef = useRef<number | null>(null);
  const pendingDraftsRef = useRef<Record<string, string>>({});
  const autoJoinRef = useRef(false);
  const storedAutoJoinNameRef = useRef<string | null>(null);
  const userEditedNameRef = useRef(false);

  const pushToast = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500);
  }, []);

  const playCue = useCallback(
    (phase: GamePhase) => {
      if (muted || typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const context = new AudioCtx();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value =
        phase === "voting" ? 330 : phase === "matchup_result" ? 220 : phase === "round_result" ? 440 : 260;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      window.setTimeout(() => context.close(), 180);
    },
    [muted]
  );

  const ws = usePartySocket({
    host: getPartyHost(),
    room: roomCode,
    onOpen() {
      setConnectionStatus("open");
    },
    onClose() {
      setConnectionStatus("closed");
    },
    onError() {
      setConnectionStatus("closed");
      pushToast("Connection failed. The room will keep trying to reconnect.");
    },
    onMessage(event) {
      const message = JSON.parse(event.data) as ServerMessage;
      if (message.type === "snapshot") {
        setState(message.state);
        setAssignments((current) => mergeAssignments(current, message.assignments));
        if (phaseRef.current && phaseRef.current !== message.state.phase) {
          playCue(message.state.phase);
        }
        phaseRef.current = message.state.phase;
        return;
      }
      if (message.type === "state") {
        setState(message.state);
        if (phaseRef.current && phaseRef.current !== message.state.phase) {
          playCue(message.state.phase);
        }
        phaseRef.current = message.state.phase;
      }
      if (message.type === "private_assignments") {
        setAssignments((current) => mergeAssignments(current, message.assignments));
      }
      if (message.type === "error") {
        pushToast(message.message);
      }
    }
  });

  useEffect(() => {
    const hydrateStoredSession = window.setTimeout(() => {
      const storedName = getStoredDisplayName();
      if (storedName && !userEditedNameRef.current) {
        storedAutoJoinNameRef.current = storedName;
      }
      setDisplayName((current) => current || storedName);
      setMuted(getSoundMuted());
      setSessionId(getOrCreateSessionId());
    }, 0);
    return () => window.clearTimeout(hydrateStoredSession);
  }, []);

  const send = useCallback(
    (message: ClientMessage) => {
      ws.send(encodeMessage(message));
    },
    [ws]
  );

  useEffect(() => {
    if (
      connectionStatus !== "open" ||
      autoJoinRef.current ||
      state?.selfId ||
      !displayName.trim() ||
      !sessionId ||
      storedAutoJoinNameRef.current !== displayName.trim()
    ) {
      return;
    }
    autoJoinRef.current = true;
    send({ type: "join_room", name: displayName.trim(), sessionId });
  }, [connectionStatus, displayName, send, sessionId, state?.selfId]);

  const join = useCallback(() => {
    const clean = displayName.trim().slice(0, 24);
    if (!clean) {
      pushToast("Enter a display name first.");
      return;
    }
    storeDisplayName(clean);
    const sid = sessionId || getOrCreateSessionId();
    setSessionId(sid);
    autoJoinRef.current = true;
    send({ type: "join_room", name: clean, sessionId: sid });
  }, [displayName, pushToast, send, sessionId]);

  const isHost = Boolean(state?.selfId && state.hostId === state.selfId);

  const updateDraft = useCallback(
    (matchupId: string, text: string) => {
      const value = text.slice(0, state?.settings.maxDefenseChars ?? 200);
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.matchupId === matchupId ? { ...assignment, draft: value } : assignment
        )
      );
      pendingDraftsRef.current[matchupId] = value;
      if (draftFlushRef.current) window.clearTimeout(draftFlushRef.current);
      draftFlushRef.current = window.setTimeout(() => {
        for (const [id, draft] of Object.entries(pendingDraftsRef.current)) {
          send({ type: "update_draft", matchupId: id, text: draft });
        }
        pendingDraftsRef.current = {};
      }, 250);
    },
    [send, state?.settings.maxDefenseChars]
  );

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  const shell = (
    <main className="min-h-screen px-4 py-5 text-takeups-text md:px-8">
      <BackgroundFX withImage={false} />
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              aria-label="Go to Takeups home"
              className="inline-block font-heading text-2xl font-bold tracking-[0.28em] outline-none transition-colors hover:text-takeups-blue focus-visible:text-takeups-blue"
            >
              TAKEUPS
            </Link>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
              Your opinion has been assigned.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ConnectionStatus status={connectionStatus} />
            <Button
              type="button"
              variant="ghost"
              className="h-10 min-h-10 w-10 px-0"
              aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
              onClick={toggleMuted}
              icon={muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={state?.phase ?? "join"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
          >
            {renderRoomContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Toasts toasts={toasts} onDismiss={(id) => setToasts((items) => items.filter((toast) => toast.id !== id))} />
    </main>
  );

  return shell;

  function renderRoomContent() {
    if (!state?.selfId) {
      return (
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <Card className="w-full p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              Enter Room {roomCode}
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-takeups-text">
              Identify yourself.
            </h1>
            <label className="mt-6 block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-takeups-muted">
                Display Name
              </span>
              <input
                value={displayName}
                onChange={(event) => {
                  userEditedNameRef.current = true;
                  storedAutoJoinNameRef.current = null;
                  setDisplayName(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") join();
                }}
                className="w-full rounded-md border border-takeups-border bg-takeups-bg px-4 py-3 text-takeups-text outline-none focus:border-takeups-blue"
                maxLength={24}
                autoFocus
              />
            </label>
            <Button type="button" variant="primary" className="mt-5 w-full" onClick={join}>
              Join Room
            </Button>
          </Card>
        </div>
      );
    }

    if (state.phase === "lobby") {
      return (
        <Lobby
          state={state}
          isHost={isHost}
          onStart={() => send({ type: "start_round" })}
          onSettings={(settings: Partial<RoomSettings>) => send({ type: "update_settings", settings })}
          onKick={(playerId) => send({ type: "kick_player", playerId })}
        />
      );
    }

    if (state.phase === "writing") {
      return (
        <WritingPhase
          state={state}
          assignments={assignments}
          onDraft={updateDraft}
          onReady={() => {
            pendingDraftsRef.current = {};
            send({
              type: "submit_defenses",
              defenses: Object.fromEntries(
                assignments.map((assignment) => [assignment.matchupId, assignment.draft])
              )
            });
          }}
          onUnready={() => send({ type: "unready" })}
        />
      );
    }

    if (state.phase === "voting") {
      return (
        <VotingPhase
          state={state}
          card={state.currentVotingCard}
          onVote={(matchupId, votedFor) => send({ type: "vote", matchupId, votedFor })}
        />
      );
    }

    if (state.phase === "matchup_result") {
      return <MatchupResult result={state.currentMatchupResult} />;
    }

    if (state.phase === "round_result") {
      return <RoundResult state={state} isHost={isHost} onNextRound={() => send({ type: "next_round" })} />;
    }

    return <GameOver state={state} isHost={isHost} onRestart={() => send({ type: "restart_game" })} />;
  }
}

function mergeAssignments(current: Assignment[], incoming: Assignment[]): Assignment[] {
  if (!current.length) return incoming;
  const localById = new Map(current.map((assignment) => [assignment.matchupId, assignment]));
  return incoming.map((assignment) => {
    const local = localById.get(assignment.matchupId);
    if (!local || assignment.locked) return assignment;
    return { ...assignment, draft: local.draft || assignment.draft };
  });
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
