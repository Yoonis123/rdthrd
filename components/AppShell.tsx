"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AppStateProvider } from "./AppState";
import { MapView } from "./MapView";
import { TabBar } from "./TabBar";
import { PlaceSheet } from "./PlaceSheet";
import { PlaceEditor } from "./PlaceEditor";
import { Toast } from "./Toast";
import { SetupNeeded } from "./SetupNeeded";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onMap = pathname === "/";
  const [keyRejected, setKeyRejected] = useState(false);

  // Google calls this global function if it refuses our API key.
  useEffect(() => {
    window.gm_authFailure = () => setKeyRejected(true);
    return () => {
      delete window.gm_authFailure;
    };
  }, []);

  if (!API_KEY) return <SetupNeeded reason="missing" />;
  if (keyRejected) return <SetupNeeded reason="rejected" />;

  return (
    <APIProvider apiKey={API_KEY} region="GB" language="en-GB" libraries={["places", "marker"]}>
      <AppStateProvider>
        <div className="fixed inset-0 flex flex-col bg-cream">
          <main className="relative min-h-0 flex-1 overflow-hidden">
            {/* The map stays mounted on every tab; it's just hidden when you're elsewhere. */}
            <div
              className={onMap ? "absolute inset-0" : "pointer-events-none invisible absolute inset-0"}
              aria-hidden={!onMap}
            >
              <MapView />
            </div>
            {!onMap && (
              <div className="absolute inset-0 overflow-y-auto overscroll-contain bg-cream">{children}</div>
            )}
          </main>
          <TabBar />
        </div>
        <PlaceSheet visible={onMap} />
        <PlaceEditor />
        <Toast />
      </AppStateProvider>
    </APIProvider>
  );
}
