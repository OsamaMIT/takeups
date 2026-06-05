"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CopyInviteButton({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);
  async function copyInvite() {
    const url = `${window.location.origin}/room/${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <Button
      type="button"
      onClick={copyInvite}
      icon={copied ? <Check size={16} /> : <Copy size={16} />}
      variant={copied ? "gold" : "secondary"}
    >
      {copied ? "Copied" : "Copy Invite"}
    </Button>
  );
}
