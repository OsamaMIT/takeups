"use client";

import { motion, useReducedMotion } from "framer-motion";

export function BackgroundFX({ withImage = false }: { withImage?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-takeups-bg">
      {withImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/takeups-judgment-chamber.png')" }}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,140,255,0.25),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,79,109,0.18),transparent_30%),linear-gradient(180deg,rgba(5,6,10,0.42),#05060A_76%)]" />
      <motion.div
        animate={reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "80px 80px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.17]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,247,251,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.04)_34%,transparent_44%)]" />
      <div className="noise absolute inset-0 opacity-[0.07]" />
    </div>
  );
}
