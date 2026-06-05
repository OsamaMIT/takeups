import { Hash } from "lucide-react";

export function RoomCodeBadge({ roomCode }: { roomCode: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-md border border-takeups-border bg-takeups-elevated px-4 py-3">
      <Hash size={18} className="text-takeups-blue" />
      <span className="font-mono text-2xl font-bold tracking-[0.22em] text-takeups-text">
        {roomCode}
      </span>
    </div>
  );
}
