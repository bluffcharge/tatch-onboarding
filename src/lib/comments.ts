/**
 * Design-comment store.
 * Backend abstraction so we can swap localStorage → Vercel KV / Upstash
 * by replacing this file's impl without touching the UI.
 */

export type Author = "Arm" | "Ed" | "Rob" | "Other";

export type Comment = {
  id: string;
  routeHref: string;
  author: Author;
  body: string;
  /** ms since epoch */
  createdAt: number;
};

export interface CommentStore {
  list(routeHref: string): Promise<Comment[]>;
  add(input: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
  remove(id: string): Promise<void>;
  /** Subscribe to changes (storage events for cross-tab + cross-iframe). */
  subscribe(cb: () => void): () => void;
}

const STORAGE_KEY = "tatch-comments-v1";

function readAll(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export const localStore: CommentStore = {
  async list(routeHref) {
    return readAll()
      .filter((c) => c.routeHref === routeHref)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  async add(input) {
    const c: Comment = {
      id: uid(),
      createdAt: Date.now(),
      ...input,
    };
    const all = readAll();
    all.push(c);
    writeAll(all);
    return c;
  },
  async remove(id) {
    const all = readAll().filter((c) => c.id !== id);
    writeAll(all);
  },
  subscribe(cb) {
    if (typeof window === "undefined") return () => {};
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) cb();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  },
};

/* --- Author preference (which name is "me" in this browser) ---------- */

const AUTHOR_KEY = "tatch-comments-author";

export function getStoredAuthor(): Author | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(AUTHOR_KEY) as Author | null;
  return v === "Arm" || v === "Ed" || v === "Rob" || v === "Other" ? v : null;
}

export function setStoredAuthor(a: Author) {
  try { localStorage.setItem(AUTHOR_KEY, a); } catch {}
}

/* --- Avatar palette per author (small visual identity) --------------- */

export const AUTHOR_COLOR: Record<Author, string> = {
  Rob:   "bg-[#8145FF]", // royal-400
  Arm:   "bg-[#00BBFF]", // sky
  Ed:    "bg-[#FF40F5]", // peony
  Other: "bg-[#7B7F8C]", // grey-600
};

/* --- Helpers --------------------------------------------------------- */

export function formatTimeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const s = Math.round(diff / 1000);
  if (s < 60)        return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60)        return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24)        return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
