"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Search,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/stores/auth-store";
import {
  useThreadsByUser,
  useMessagesByThread,
} from "@/lib/services/hooks";
import { getUserById, addMessage, updateThreadLastMessage } from "@/lib/mock-data";
import { cn, formatRelative, getInitials } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import ChatThread from "@/components/communication/chat-thread";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentMessagesPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  const queryClient = useQueryClient();
  const { data: threads, isLoading: threadsLoading } = useThreadsByUser(userId || null);

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const { data: threadMessages, isLoading: messagesLoading } =
    useMessagesByThread(selectedThreadId);

  // Selected thread metadata
  const selectedThread = useMemo(() => {
    if (!threads || !selectedThreadId) return null;
    return threads.find((t) => t.id === selectedThreadId) ?? null;
  }, [threads, selectedThreadId]);

  // Get the other participant in the selected thread
  const otherParticipant = useMemo(() => {
    if (!selectedThread) return null;
    const otherId = selectedThread.participants.find((p) => p !== userId);
    return otherId ? getUserById(otherId) : null;
  }, [selectedThread, userId]);

  // Filter threads by search
  const filteredThreads = useMemo(() => {
    if (!threads) return [];
    const q = search.toLowerCase().trim();
    if (!q) return threads;
    return threads.filter((thread) => {
      const otherId = thread.participants.find((p) => p !== userId);
      const other = otherId ? getUserById(otherId) : null;
      return (
        thread.subject.toLowerCase().includes(q) ||
        (other?.name.toLowerCase().includes(q) ?? false) ||
        thread.lastMessage.toLowerCase().includes(q)
      );
    });
  }, [threads, search, userId]);

  // Handle selecting a thread
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setMobileShowChat(true);
    setNewMessage("");
    setMessageSent(false);
  };

  // Handle back to thread list (mobile)
  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedThreadId || !otherParticipant) return;
    const now = new Date().toISOString();
    addMessage({
      id: `msg-${Date.now()}`,
      senderId: userId,
      receiverId: otherParticipant.id,
      threadId: selectedThreadId,
      content: newMessage.trim(),
      timestamp: now,
      read: false,
    });
    updateThreadLastMessage(selectedThreadId, newMessage.trim(), now);
    queryClient.invalidateQueries({ queryKey: ['messages', 'thread', selectedThreadId] });
    queryClient.invalidateQueries({ queryKey: ['threads', userId] });
    setNewMessage("");
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 2000);
  }, [newMessage, selectedThreadId, otherParticipant, userId, queryClient]);

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ----- Loading state -----
  if (threadsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Messages" description="Communicate with your teachers and classmates" />
        <LoadingState type="card" count={3} />
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Messages" description="Communicate with your teachers and classmates" />
        <EmptyState
          icon={<MessageSquare className="size-6" />}
          title="No messages yet"
          description="Your conversations will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Messages" description="Communicate with your teachers and classmates" />

      {/* Two-column layout */}
      <div className="flex h-[calc(100vh-220px)] min-h-[500px] overflow-hidden rounded-lg border bg-card">
        {/* Thread list sidebar */}
        <div
          className={cn(
            "flex w-full flex-col border-r md:w-80 lg:w-96",
            mobileShowChat && "hidden md:flex"
          )}
        >
          {/* Search */}
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Thread list */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredThreads.map((thread) => {
                const otherId = thread.participants.find(
                  (p) => p !== userId
                );
                const other = otherId ? getUserById(otherId) : null;
                const isActive = selectedThreadId === thread.id;

                return (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={cn(
                      "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                      isActive && "bg-muted"
                    )}
                  >
                    {/* Avatar */}
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {other ? getInitials(other.name) : "?"}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm",
                            thread.unreadCount > 0
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground"
                          )}
                        >
                          {other?.name ?? "Unknown"}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatRelative(thread.lastMessageAt)}
                        </span>
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {thread.subject}
                      </p>

                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-xs",
                            thread.unreadCount > 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {thread.lastMessage}
                        </p>
                        {thread.unreadCount > 0 && (
                          <Badge className="size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredThreads.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No conversations found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message area */}
        <div
          className={cn(
            "flex flex-1 flex-col",
            !mobileShowChat && "hidden md:flex"
          )}
        >
          {selectedThread ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                {/* Back button (mobile) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="size-4" />
                </Button>

                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {otherParticipant
                    ? getInitials(otherParticipant.name)
                    : "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {otherParticipant?.name ?? "Unknown"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selectedThread.subject}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingState type="card" count={1} />
                  </div>
                ) : (
                  <ChatThread
                    messages={threadMessages ?? []}
                    currentUserId={userId}
                    className="h-full"
                  />
                )}
              </div>

              {/* Sent confirmation */}
              {messageSent && (
                <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Message sent successfully.
                </div>
              )}

              {/* Message input */}
              <div className="border-t p-3">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="min-h-[40px] max-h-[120px] resize-none"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="shrink-0"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No thread selected */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MessageSquare className="size-6" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a thread from the sidebar to view messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
