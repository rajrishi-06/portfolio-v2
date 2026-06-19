import { Terminal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";

export function ChatMessage({
  role,
  content,
  streaming = false,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          isUser
            ? "bg-overlay/[0.06] text-faint"
            : "bg-accent/15 text-accent-bright ring-1 ring-accent-bright/20",
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Terminal className="h-3.5 w-3.5" />
        )}
      </span>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-accent text-white"
            : "rounded-tl-sm border border-overlay/10 bg-overlay/[0.03] text-muted",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : content ? (
          <Markdown text={content} />
        ) : (
          <TypingDots />
        )}
        {!isUser && streaming && content && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-accent-bright/80 align-middle" />
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5">
      {[0, 0.15, 0.3].map((d) => (
        <span
          key={d}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  );
}
