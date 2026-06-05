"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GameRoom } from "@/components/game/GameRoom";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Card } from "@/components/ui/Card";
import { formatRoomCode } from "@/lib/utils";

export function RoomFromPath() {
  const [roomCode, setRoomCode] = useState<string | null>(null);

  useEffect(() => {
    const readRoomCode = window.setTimeout(() => {
      const url = new URL(window.location.href);
      const pathCode = url.pathname.split("/").filter(Boolean)[1] ?? "";
      const queryCode = url.searchParams.get("code") ?? "";
      setRoomCode(formatRoomCode(pathCode || queryCode));
    }, 0);
    return () => window.clearTimeout(readRoomCode);
  }, []);

  if (roomCode === null) {
    return (
      <main className="min-h-screen px-4 py-5 text-takeups-text md:px-8">
        <BackgroundFX withImage={false} />
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <Card className="w-full p-6 text-center text-takeups-muted">Preparing room.</Card>
        </div>
      </main>
    );
  }

  if (!roomCode) {
    return (
      <main className="min-h-screen px-4 py-5 text-takeups-text md:px-8">
        <BackgroundFX withImage={false} />
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <Card className="w-full p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-takeups-muted">
              Room Link Required
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-takeups-text">
              Enter from an invite link.
            </h1>
            <p className="mt-3 text-sm leading-6 text-takeups-muted">
              Create or join a room from the landing page.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-md border border-takeups-border px-4 py-3 text-sm font-bold text-takeups-text hover:border-takeups-blue"
            >
              Back to lobby
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return <GameRoom roomCode={roomCode} />;
}
