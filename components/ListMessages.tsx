"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";

import { toast } from "sonner";
import { ArrowDown } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useMessages } from "@/lib/store/messages";
import type { Imessage } from "@/lib/store/messages";

import { ChatMessage } from "@/components/ChatMessage";
import { DeleteAlert, EditAlert } from "@/components/ChatMessageActions";
import { LoadMoreMessages } from "@/components/LoadMoreMessages";

export function ListMessages() {
  const scrollRef = useRef(null) as React.RefObject<HTMLDivElement | null>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const { messageIds, messages, addMessage, deleteMessage, updateMessage } =
    useMessages((state) => state);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "daily_chat_messages" },
        async (payload) => {
          if (!messageIds.includes(payload.new.id)) {
            const { data, error } = await supabase
              .from("daily_chat_users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                daily_chat_users: data,
              };

              addMessage(newMessage as Imessage);
            }
          }

          const scrollContainer = scrollRef.current;

          if (
            scrollContainer &&
            scrollContainer.scrollTop <
              scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "daily_chat_messages" },
        (payload) => {
          deleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "daily_chat_messages" },
        (payload) => {
          updateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [
    messages,
    userScrolled,
    addMessage,
    deleteMessage,
    messageIds,
    supabase,
    updateMessage,
  ]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, userScrolled]);

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScrolled(isScroll);
    }

    if (
      scrollContainer &&
      scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
    ) {
      setNotification(0);
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setNotification(0);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 flex flex-col h-full overflow-y-auto p-5"
      onScroll={handleScroll}
    >
      <div className="flex-1">
        <LoadMoreMessages />
      </div>
      <div className="space-y-7">
        {messages.map((message) => {
          return <ChatMessage key={message.id} message={message} />;
        })}
      </div>

      {userScrolled && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          {notification ? (
            <div
              className="mx-auto rounded-sm p-2 text-xs bg-primary text-white cursor-pointer transition hover:scale-110"
              onClick={scrollDown}
            >
              Новое сообщение:
              <span className="font-bold"> {notification}</span>
            </div>
          ) : (
            <div
              className="mx-auto rounded-full flex items-center justify-center w-10 h-10 bg-primary text-white cursor-pointer transition hover:scale-110"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}

      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
