"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type AppState = {
  /** The place whose detail sheet is open on the map. */
  selectedPlaceId: string | null;
  selectPlace: (id: string | null) => void;
  /** The place being saved/edited in the tag + note editor. */
  editingPlaceId: string | null;
  openEditor: (id: string) => void;
  closeEditor: () => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlaceId, selectPlace] = useState<string | null>(null);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openEditor = useCallback((id: string) => setEditingPlaceId(id), []);
  const closeEditor = useCallback(() => setEditingPlaceId(null), []);
  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const value = useMemo(
    () => ({ selectedPlaceId, selectPlace, editingPlaceId, openEditor, closeEditor, toast, showToast }),
    [selectedPlaceId, editingPlaceId, openEditor, closeEditor, toast, showToast],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
