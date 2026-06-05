import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectionStatus({ status }: { status: "connecting" | "open" | "closed" }) {
  const connected = status === "open";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
        connected
          ? "border-takeups-success/40 text-takeups-success"
          : "border-takeups-red/40 text-takeups-red"
      )}
    >
      {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
      {connected ? "Connected" : status === "connecting" ? "Reconnecting" : "Disconnected"}
    </div>
  );
}
