"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatRelative } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ChatThreadProps {
  messages: Message[];
  currentUserId: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// ChatThread
// ---------------------------------------------------------------------------
export default function ChatThread({
  messages,
  currentUserId,
  className,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="flex flex-col gap-3 p-4">
        {messages.map((message) => {
          const isSent = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1",
                isSent ? "items-end" : "items-start"
              )}
            >
              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  isSent
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                )}
              >
                {message.content}
              </div>

              {/* Timestamp */}
              <span
                className={cn(
                  "px-1 text-[10px] text-muted-foreground/70",
                  isSent ? "text-right" : "text-left"
                )}
              >
                {formatRelative(message.timestamp)}
              </span>
            </div>
          );
        })}

        {/* Invisible scroll anchor */}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </ScrollArea>
  );
}
