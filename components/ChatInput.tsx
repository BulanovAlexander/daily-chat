"use client";

import * as React from "react";

import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/store/user";
import { useMessages } from "@/lib/store/messages";
import type { Imessage } from "@/lib/store/messages";

import { Input } from "@/components/ui/input";

export function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessage = useMessages((state) => state.addMessage);
  const setMessageIds = useMessages((state) => state.setMessageIds);

  const supabase = createClient();

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        daily_chat_users: {
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          full_name: user?.user_metadata.full_name,
          email: user?.email,
          id: user?.id,
        },
      };

      addMessage(newMessage as Imessage);
      setMessageIds(newMessage.id);

      const { error } = await supabase
        .from("daily_chat_messages")
        .insert({ text });

      if (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    } else {
      toast("Сообщение не должно быть пустым");
    }
  };

  return (
    <div className="border-t p-5">
      <Input
        placeholder="Сообщение..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
