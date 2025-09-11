"use client";

import { useEffect } from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Extra classes for the dialog panel (use for padding, etc.) */
  panelClassName?: string;
  /** sm | md | lg width presets */
  width?: "sm" | "md" | "lg";
};
// Modal.tsx (or wherever your Modal lives)
export function Modal({ open, onClose, children }: {
  open: boolean; onClose: () => void; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex min-h-screen items-start sm:items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
          {/* inner padding + scroll if needed */}
          <div className="max-h-[85vh] overflow-auto p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
