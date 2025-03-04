"use client";

import * as React from "react";
import { useState } from "react";

import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";

import { ChatPresence } from "@/components/ChatPresence";
import { Button } from "@/components/ui/button";

export function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const hendleLoginWithGithub = async () => {
    const supabase = createClient();

    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: location.origin + "/auth/callback",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const hendleLogout = async () => {
    setPending(true);
    const supabase = createClient();
    const setUser = useUser.getState().setUser;

    try {
      await supabase.auth.signOut();
      setUser(undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
      router.refresh();
    }
  };

  return (
    <div className="h-20">
      <div className="border-b flex items-center justify-between h-full p-5">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <ChatPresence />
        </div>

        {user ? (
          <Button onClick={hendleLogout}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Выйти
          </Button>
        ) : (
          <Button onClick={hendleLoginWithGithub}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Войти
          </Button>
        )}
      </div>
    </div>
  );
}
