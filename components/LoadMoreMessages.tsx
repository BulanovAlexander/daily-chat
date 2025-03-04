"use client";

import * as React from "react";

import { toast } from "sonner";

import { getFromAndTo } from "@/lib/utils";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { createClient } from "@/lib/supabase/client";
import { useMessages } from "@/lib/store/messages";

import { Button } from "@/components/ui/button";

export function LoadMoreMessages() {
  const page = useMessages((state) => state.page);
  const hasMore = useMessages((state) => state.hasMore);
  const setMessages = useMessages((state) => state.setMessages);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("daily_chat_messages")
      .select("*, daily_chat_users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };

  if (hasMore)
    return (
      <Button className="w-full" variant="outline" onClick={fetchMore}>
        Загрузить ещё
      </Button>
    );

  return <></>;
}
