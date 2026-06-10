"use client";

import { useEffect, useState } from "react";

/**
 * Prototype test mode — lets reviewers click every Continue without
 * satisfying validation (empty forms, no code, unresolved seat overage).
 * Toggled from the DevPalette flask; persisted in localStorage so it
 * survives navigation, and broadcast via the storage event so it reaches
 * canvas iframes the same way the theme does.
 */
const KEY = "tatch-op-test-mode";

export function readTestMode(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setTestMode(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event("op-test-mode"));
}

export function useTestMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(readTestMode());
    sync();
    window.addEventListener("storage", sync); // other tabs / parent ↔ iframe
    window.addEventListener("op-test-mode", sync); // same-document toggles
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("op-test-mode", sync);
    };
  }, []);
  return on;
}
