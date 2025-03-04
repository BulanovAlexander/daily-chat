"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";

export function ChatPresence() {
  const user = useUser((state) => state.user);
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (!user) {
      setOnlineUsers(0);
      return;
    }

    const channel = supabase.channel("presence");
    channel
      .on("presence", { event: "sync" }, () => {
        const userIds = [];

        for (const id in channel.presenceState()) {
          // @ts-expect-error eslint-disable-next-line
          userIds.push(channel.presenceState()[id][0].user_id);
        }

        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user]);

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-sm text-gray-400">{onlineUsers} в сети</h2>
        </>
      ) : (
        <>
          <div className="w-4 h-4"></div>
          <h2 className="text-sm text-gray-400"></h2>
        </>
      )}
    </div>
  );
}
