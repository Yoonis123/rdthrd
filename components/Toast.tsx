"use client";

import { useAppState } from "./AppState";

export function Toast() {
  const { toast } = useAppState();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center pt-safe"
    >
      {toast && (
        <div
          key={toast}
          className="mt-3 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream shadow-float"
          style={{ animation: "pop-in 220ms ease-out" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
