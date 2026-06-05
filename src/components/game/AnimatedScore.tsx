"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const start = displayRef.current;
    const delta = value - start;
    const started = performance.now();
    const duration = 600;
    let frame = 0;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - started) / duration);
      const next = Math.round(start + delta * progress);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  return (
    <motion.span layout className="font-mono tabular-nums">
      {reduceMotion ? value : display}
    </motion.span>
  );
}
