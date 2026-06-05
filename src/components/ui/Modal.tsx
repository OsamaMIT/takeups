"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function Modal({
  title,
  open,
  onClose,
  children
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg border border-takeups-border bg-takeups-elevated p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-takeups-text">{title}</h2>
          <Button
            type="button"
            variant="ghost"
            className="h-10 min-h-10 w-10 px-0"
            aria-label="Close modal"
            onClick={onClose}
            icon={<X size={18} />}
          />
        </div>
        {children}
      </motion.div>
    </div>
  );
}
