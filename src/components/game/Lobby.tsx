"use client";

import { Settings, Swords } from "lucide-react";
import { useState } from "react";
import { CopyInviteButton } from "@/components/game/CopyInviteButton";
import { HostSettingsPanel } from "@/components/game/HostSettingsPanel";
import { PlayerList } from "@/components/game/PlayerList";
import { RoomCodeBadge } from "@/components/game/RoomCodeBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { PublicRoomState, RoomSettings } from "@/types/game";

export function Lobby({
  state,
  isHost,
  onStart,
  onSettings,
  onKick
}: {
  state: PublicRoomState;
  isHost: boolean;
  onStart: () => void;
  onSettings: (settings: Partial<RoomSettings>) => void;
  onKick: (playerId: string) => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const enoughPlayers = state.players.filter((player) => player.connected).length >= state.minPlayers;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_25rem]">
      <Card className="p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              Private Room
            </p>
            <div className="mt-3">
              <RoomCodeBadge roomCode={state.roomCode} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyInviteButton roomCode={state.roomCode} />
            {isHost ? (
              <Button
                type="button"
                variant="secondary"
                icon={<Settings size={16} />}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-8 border-t border-takeups-border pt-6">
          <h1 className="font-heading text-3xl font-semibold text-takeups-text md:text-5xl">
            YOUR OPINION HAS BEEN ASSIGNED
          </h1>
          <p className="mt-3 max-w-2xl text-takeups-muted">
            The host starts the round. Each player receives two private stands and the room
            judges the defenses one card at a time.
          </p>
        </div>
        <div className="mt-8 rounded-md border border-takeups-border bg-takeups-elevated p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
                Start Condition
              </div>
              <div className="mt-1 text-sm text-takeups-text">
                {enoughPlayers
                  ? "Minimum player count met."
                  : `Waiting for ${state.minPlayers - state.players.filter((p) => p.connected).length} more connected player(s).`}
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              disabled={!isHost || !enoughPlayers}
              onClick={onStart}
              icon={<Swords size={17} />}
            >
              Start Round
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <PlayerList
          players={state.players}
          spectators={state.spectators}
          isHost={isHost}
          selfId={state.selfId}
          onKick={onKick}
        />
      </Card>
      <Modal title="Room Settings" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <HostSettingsPanel settings={state.settings} disabled={!isHost} onChange={onSettings} />
      </Modal>
    </div>
  );
}
