import * as React from "react";
import { Suspense } from "react";

import { LIMIT_MESSAGE } from "@/lib/constant";
import { createClient } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/initMessages";

import { ListMessages } from "@/components/ListMessages";

export async function ChatMessages() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("daily_chat_messages")
    .select("*, daily_chat_users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"loading..."}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
