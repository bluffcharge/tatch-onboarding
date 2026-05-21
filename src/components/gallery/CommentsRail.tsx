"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ChevronsRight,
  MessageSquareMore,
  Send,
  Trash2,
  User,
} from "lucide-react";
import {
  AUTHOR_COLOR,
  formatTimeAgo,
  getStoredAuthor,
  localStore,
  setStoredAuthor,
  type Author,
  type Comment,
} from "@/lib/comments";

const AUTHORS: Author[] = ["Rob", "Arm", "Ed", "Other"];

type Props = {
  routeHref: string;
  routeTitle: string;
  collapsed: boolean;
  onToggle: () => void;
};

export function CommentsRail({ routeHref, routeTitle, collapsed, onToggle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate author from localStorage on mount.
  useEffect(() => {
    setAuthor(getStoredAuthor());
  }, []);

  const refresh = useCallback(async () => {
    const list = await localStore.list(routeHref);
    setComments(list);
  }, [routeHref]);

  // Load when route changes + subscribe to cross-tab/iframe storage events.
  useEffect(() => {
    refresh();
    const unsub = localStore.subscribe(() => refresh());
    return unsub;
  }, [refresh]);

  const onPickAuthor = useCallback((a: Author) => {
    setAuthor(a);
    setStoredAuthor(a);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const canSubmit = author !== null && draft.trim().length > 0;

  const submit = useCallback(async () => {
    if (!canSubmit || !author) return;
    await localStore.add({ routeHref, author, body: draft.trim() });
    setDraft("");
    await refresh();
  }, [canSubmit, author, draft, routeHref, refresh]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  const counts = useMemo(() => comments.length, [comments]);

  if (collapsed) {
    return (
      <aside className="flex w-9 shrink-0 flex-col items-center border-l border-border-subtle bg-canvas py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open comments rail"
          title="Show comments"
          className="relative grid h-9 w-9 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <MessageSquareMore size={14} strokeWidth={1.75} />
          {counts > 0 && (
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-[16px] place-items-center rounded-pill bg-royal-400 px-1 text-[9px] font-bold text-white">
              {counts}
            </span>
          )}
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden border-l border-border-subtle bg-canvas">
      <header className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquareMore size={13} strokeWidth={1.75} className="text-ink-caption" />
          <p className="t-mono-label">Comments {counts > 0 && `· ${counts}`}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse comments rail"
          title="Hide"
          className="grid h-7 w-7 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <ChevronsRight size={14} strokeWidth={1.75} />
        </button>
      </header>

      {/* Composer */}
      <div className="border-b border-border-subtle px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="t-mono-label">Posting as</p>
          {author && (
            <span className="text-[11px] text-ink-disabled">
              Tap a name to switch
            </span>
          )}
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Author">
          {AUTHORS.map((a) => {
            const active = author === a;
            return (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onPickAuthor(a)}
                className={[
                  "inline-flex h-7 items-center gap-1.5 rounded-pill border px-2.5 text-[12px] font-medium transition-colors duration-fast ease-snap",
                  active
                    ? "border-royal-400 bg-royal-50 text-royal-700 dark:bg-royal-900 dark:text-white"
                    : "border-border bg-card text-ink-body hover:bg-subtle",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "grid h-4 w-4 place-items-center rounded-pill text-[9px] font-semibold text-white",
                    AUTHOR_COLOR[a],
                  ].join(" ")}
                >
                  {a[0]}
                </span>
                {a}
              </button>
            );
          })}
        </div>

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          disabled={!author}
          placeholder={author ? `Leave a note for the team about “${routeTitle}”…` : "Pick a name first."}
          rows={3}
          className="block w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-[13px] text-ink-title placeholder:text-ink-disabled outline-none focus:border-royal-400 focus:shadow-[0_0_0_2px_var(--royal-100)] disabled:opacity-60"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-disabled">⌘/Ctrl + Enter to post</span>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[color:var(--btn-ink-bg)] px-3 text-[12px] font-semibold text-[color:var(--btn-ink-fg)] shadow-sm transition-colors duration-fast ease-snap hover:bg-[color:var(--btn-ink-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={11} strokeWidth={2} />
            Post
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {comments.length === 0 ? (
          <div className="grid h-full place-items-center py-12 text-center">
            <div>
              <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-pill bg-subtle text-ink-caption">
                <MessageSquareMore size={14} strokeWidth={1.75} />
              </div>
              <p className="t-caption">
                No comments on this screen yet.<br />Be the first to leave one.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                canDelete={c.author === author}
                onDelete={async () => {
                  await localStore.remove(c.id);
                  refresh();
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer disclaimer */}
      <footer className="border-t border-border-subtle px-4 py-2.5">
        <p className="text-[10.5px] leading-snug text-ink-disabled">
          <User size={10} strokeWidth={2} className="-mt-0.5 mr-1 inline" />
          Local-only for now — comments live in this browser. Cross-user sync is a 1-file backend swap (ask Claude).
        </p>
      </footer>
    </aside>
  );
}

function CommentItem({
  comment,
  canDelete,
  onDelete,
}: {
  comment: Comment;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-md border border-border-subtle bg-card p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={[
              "grid h-5 w-5 place-items-center rounded-pill text-[10px] font-semibold text-white",
              AUTHOR_COLOR[comment.author],
            ].join(" ")}
          >
            {comment.author[0]}
          </span>
          <span className="text-[12px] font-semibold text-ink-title">{comment.author}</span>
          <span className="text-[11px] text-ink-disabled">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete comment"
            className="grid h-6 w-6 place-items-center rounded-md text-ink-disabled hover:bg-subtle hover:text-error"
          >
            <Trash2 size={12} strokeWidth={1.75} />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink-body">{comment.body}</p>
    </li>
  );
}
