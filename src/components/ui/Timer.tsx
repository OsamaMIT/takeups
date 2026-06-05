"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Timer({
  endsAt,
  label,
  className
}: {
  endsAt?: number;
  label?: string;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);
  const seconds = Math.max(0, Math.ceil(((endsAt ?? now) - now) / 1000));
  const display = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  }, [seconds]);

  return (
    <motion.div
      animate={!reduceMotion && seconds <= 10 && seconds > 0 ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      className={cn("text-center", className)}
    >
      {label ? (
        <div className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-takeups-muted">
          {label}
        </div>
      ) : null}
      <div
        className={cn(
          "font-mono text-5xl font-semibold tabular-nums text-takeups-text md:text-7xl",
          seconds <= 10 && "text-takeups-red"
        )}
      >
        {display}
      </div>
    </motion.div>
  );
}
