"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Dim the screen behind the sheet (tapping the dimmed area closes it). */
  backdrop?: boolean;
  label: string;
  zIndex?: number;
  /** Sit on top of the tab bar instead of covering it. */
  aboveTabBar?: boolean;
};

export const TAB_BAR_HEIGHT = "calc(4rem + env(safe-area-inset-bottom))";

const ANIMATION_MS = 280;

/** A native-feeling sheet that slides up from the bottom. Swipe the handle down to close. */
export function BottomSheet({ open, onClose, children, backdrop = false, label, zIndex = 40, aboveTabBar = false }: Props) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

  // Keep showing the last content while the sheet animates closed.
  const lastChildren = useRef(children);
  if (open) lastChildren.current = children;

  useEffect(() => {
    if (open) {
      setMounted(true);
      setDragY(0);
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > 90) onClose();
    else setDragY(0);
  };

  const dragging = dragStart.current !== null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 overflow-hidden"
      style={{ zIndex, bottom: aboveTabBar ? TAB_BAR_HEIGHT : 0 }}
    >
      {backdrop && (
        <div
          className="pointer-events-auto absolute inset-0 bg-ink/35 transition-opacity"
          style={{ opacity: shown ? 1 : 0, transitionDuration: `${ANIMATION_MS}ms` }}
          onClick={onClose}
        />
      )}
      <section
        role="dialog"
        aria-label={label}
        className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto flex max-h-[78dvh] max-w-xl flex-col rounded-t-[28px] bg-paper shadow-sheet"
        style={{
          transform: shown ? `translateY(${dragY}px)` : "translateY(105%)",
          transition: dragging ? "none" : `transform ${ANIMATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        }}
      >
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1.5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="h-1.5 w-10 rounded-full bg-line" />
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 ${aboveTabBar ? "" : "pb-safe"}`}>
          <div className="pb-5">{open ? children : lastChildren.current}</div>
        </div>
      </section>
    </div>
  );
}
