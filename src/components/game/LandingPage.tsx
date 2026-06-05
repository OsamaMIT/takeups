"use client";

import { motion } from "framer-motion";
import { ArrowRight, DoorOpen, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClientRoomCode, getStoredDisplayName, storeDisplayName } from "@/lib/session";
import { formatRoomCode } from "@/lib/utils";

const ROOM_CODE_LENGTH = 6;

const fakeStands = [
  ["ASSIGNED STAND", "Cereal is soup.", "Milk is broth with better branding."],
  ["DEFENSE REQUIRED", "Tall burgers should be banned.", "Dinner should not require load-bearing analysis."],
  ["LOCKED IN", "Autocorrect must testify.", "Every typo correction deserves a paper trail."]
];

export function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const hydrateStoredName = window.setTimeout(() => {
      setName((current) => current || getStoredDisplayName());
    }, 0);
    return () => window.clearTimeout(hydrateStoredName);
  }, []);

  function persistName(): boolean {
    const clean = name.trim().slice(0, 24);
    if (!clean) return false;
    storeDisplayName(clean);
    setName(clean);
    return true;
  }

  function createRoom() {
    if (!persistName()) return;
    router.push(`/room/${createClientRoomCode()}`);
  }

  function joinRoom() {
    const code = formatRoomCode(roomCode);
    if (code.length !== ROOM_CODE_LENGTH || !persistName()) return;
    router.push(`/room/${code}`);
  }

  return (
    <main className="min-h-screen overflow-hidden text-takeups-text">
      <BackgroundFX withImage />
      <section className="relative min-h-[92vh] px-4 py-8 md:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="font-heading text-2xl font-bold tracking-[0.32em]">TAKEUPS</div>
          <div className="hidden items-center gap-6 text-sm font-semibold text-takeups-muted md:flex">
            <a href="#how" className="hover:text-takeups-text">How it works</a>
            <a href="/about" className="hover:text-takeups-text">About</a>
          </div>
        </nav>
        <div className="mx-auto grid max-w-7xl gap-10 pt-20 lg:grid-cols-[1fr_26rem] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-takeups-gold">
              Private judgment chamber
            </p>
            <h1 className="mt-5 font-heading text-5xl font-semibold leading-[0.96] text-takeups-text md:text-7xl lg:text-8xl">
              Your opinion has been assigned.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-takeups-muted">
              A private-room party game where players defend ridiculous assigned stands in 200
              characters or less. The room judges the argument, not the belief.
            </p>
          </motion.div>
          <Card className="p-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-takeups-muted">
                Display Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                className="w-full rounded-md border border-takeups-border bg-takeups-bg px-4 py-3 text-takeups-text outline-none focus:border-takeups-blue"
                placeholder="Enter your name"
              />
            </label>
            <Button
              type="button"
              onClick={createRoom}
              variant="primary"
              className="mt-4 w-full"
              icon={<DoorOpen size={17} />}
            >
              Create Room
            </Button>
            <div className="my-5 h-px bg-takeups-border" />
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-takeups-muted">
                Room Code
              </span>
              <input
                value={roomCode}
                onChange={(event) =>
                  setRoomCode(formatRoomCode(event.target.value).slice(0, ROOM_CODE_LENGTH))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") joinRoom();
                }}
                className="w-full rounded-md border border-takeups-border bg-takeups-bg px-4 py-3 font-mono text-lg tracking-[0.2em] text-takeups-text outline-none focus:border-takeups-blue"
                placeholder="A7K9Q2"
                maxLength={ROOM_CODE_LENGTH}
              />
            </label>
            <Button
              type="button"
              onClick={joinRoom}
              variant="secondary"
              className="mt-4 w-full"
              icon={<ArrowRight size={17} />}
              disabled={formatRoomCode(roomCode).length !== ROOM_CODE_LENGTH}
            >
              Join Room
            </Button>
          </Card>
        </div>
        <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
          {fakeStands.map(([label, stand, defense], index) => (
            <motion.div
              key={stand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
            >
              <Card className="h-full p-4">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
                  {label}
                </div>
                <div className="mt-3 font-heading text-xl font-semibold text-takeups-text">
                  {stand}
                </div>
                <p className="mt-4 text-sm leading-6 text-takeups-muted">
                  &quot;{defense}&quot;
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="how" className="px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl border-t border-takeups-border pt-12">
          <div className="mb-8 flex items-center gap-3 text-takeups-blue">
            <ShieldCheck size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.28em]">How it works</span>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["1", "Create a private room."],
              ["2", "The host starts the round."],
              ["3", "Two assigned stands arrive in secret."],
              ["4", "The room votes one matchup at a time."]
            ].map(([number, text]) => (
              <Card key={number} className="p-5">
                <div className="font-mono text-3xl font-bold text-takeups-gold">{number}</div>
                <p className="mt-4 text-sm leading-6 text-takeups-muted">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
