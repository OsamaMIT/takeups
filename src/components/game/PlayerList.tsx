import { Crown, Eye, Radio, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PublicPlayer } from "@/types/game";

export function PlayerList({
  players,
  spectators,
  isHost,
  selfId,
  onKick
}: {
  players: PublicPlayer[];
  spectators: PublicPlayer[];
  isHost: boolean;
  selfId: string | null;
  onKick: (playerId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
          Active Players
        </h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex min-h-14 items-center gap-3 rounded-md border border-takeups-border bg-takeups-elevated/75 px-3"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md font-mono text-xs font-bold text-black"
                style={{ backgroundColor: player.color ?? "#4F8CFF" }}
              >
                {player.avatar ?? player.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold text-takeups-text">{player.name}</span>
                  {player.isHost ? <Crown size={14} className="text-takeups-gold" aria-label="Host" /> : null}
                  {player.ready ? (
                    <span className="rounded border border-takeups-success/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-takeups-success">
                      Locked
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-takeups-muted">
                  <Radio size={12} />
                  {player.connected ? "Online" : "Disconnected"}
                </div>
              </div>
              {isHost && player.id !== selfId && !player.isHost ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 min-h-9 w-9 px-0"
                  aria-label={`Kick ${player.name}`}
                  onClick={() => onKick(player.id)}
                  icon={<UserMinus size={15} />}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {spectators.length ? (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
            Spectators
          </h3>
          <div className="space-y-2">
            {spectators.map((player) => (
              <div
                key={player.id}
                className="flex min-h-12 items-center gap-3 rounded-md border border-takeups-border bg-takeups-panel/70 px-3"
              >
                <Eye size={15} className="text-takeups-muted" />
                <span className="flex-1 truncate text-sm text-takeups-text">{player.name}</span>
                {player.isHost ? <Crown size={14} className="text-takeups-gold" /> : null}
                <span className="text-xs text-takeups-muted">
                  {player.connected ? "Online" : "Disconnected"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
