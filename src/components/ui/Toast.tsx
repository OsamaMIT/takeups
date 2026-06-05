"use client";

import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export type ToastMessage = {
  id: string;
  message: string;
};

export function Toasts({
  toasts,
  onDismiss
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="flex items-start gap-3 rounded-lg border border-takeups-red/50 bg-takeups-elevated p-4 shadow-redglow"
          >
            <AlertTriangle className="mt-0.5 text-takeups-red" size={18} aria-hidden />
            <p className="flex-1 text-sm text-takeups-text">{toast.message}</p>
            <Button
              variant="ghost"
              className="h-8 min-h-8 w-8 px-0"
              aria-label="Dismiss error"
              onClick={() => onDismiss(toast.id)}
              icon={<X size={14} />}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
