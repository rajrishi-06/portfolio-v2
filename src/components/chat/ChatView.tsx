import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Square, AlertCircle } from "lucide-react";
import { assistantConfig } from "@/data/chatConfig";
import { streamChat, type ChatMessage as Msg } from "@/lib/chatApi";
import { ChatMessage } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Markdown } from "./Markdown";

export function ChatView({
  active,
  onActivity,
}: {
  active: boolean;
  /** Called when the user starts a conversation, so a destructive close can warn first. */
  onActivity?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep pinned to the latest message while content streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streaming]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    onActivity?.();
    setError(null);
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content }];
    // Add the user turn + an empty assistant turn we'll stream into.
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(history, {
        signal: controller.signal,
        onDelta: (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: last.content + delta,
              };
            }
            return next;
          });
        },
      });
    } catch (err) {
      if (controller.signal.aborted) {
        // user pressed stop — keep whatever streamed so far
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        // Drop the empty assistant bubble if nothing came through.
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) return prev.slice(0, -1);
          return prev;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex-1 touch-pan-y space-y-4 overflow-y-auto px-4 py-4"
      >
        {/* Boot greeting (always shown) */}
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent-bright ring-1 ring-accent-bright/20">
            <span className="font-mono text-xs font-bold">~</span>
          </span>
          <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-overlay/10 bg-overlay/[0.03] px-3.5 py-2.5">
            <Markdown text={assistantConfig.greeting} />
          </div>
        </div>

        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}
            content={m.content}
            streaming={streaming && i === messages.length - 1}
          />
        ))}

        {empty && (
          <div className="pt-1">
            <SuggestedPrompts
              prompts={assistantConfig.starters}
              onPick={send}
              disabled={streaming}
            />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-overlay/10 p-3">
        <div className="flex items-end gap-2 rounded-xl border border-overlay/10 bg-overlay/[0.03] px-3 py-2 transition-colors focus-within:border-accent-bright/50">
          <span className="select-none pb-1.5 font-mono text-xs text-accent-bright/70">
            {assistantConfig.prompt}
          </span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about my work…"
            className="max-h-28 flex-1 resize-none bg-transparent py-1 text-[13.5px] text-ink placeholder:text-faint focus:outline-none"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-overlay/10 text-ink transition-colors hover:bg-overlay/20"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => send(input)}
              disabled={!input.trim()}
              aria-label="Send"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white transition-all hover:bg-accent-glow disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-1.5 px-1 text-center text-[10px] text-faint">
          AI twin · answers only about Raj's work · can be imperfect
        </p>
      </div>
    </div>
  );
}
