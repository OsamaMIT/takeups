import { cn } from "@/lib/utils";

export function CharacterCounter({ value, max }: { value: string; max: number }) {
  const remaining = max - value.length;
  return (
    <div
      className={cn(
        "font-mono text-xs font-semibold tabular-nums",
        remaining < 0 ? "text-takeups-red" : remaining < 20 ? "text-takeups-gold" : "text-takeups-muted"
      )}
    >
      {value.length}/{max}
    </div>
  );
}
