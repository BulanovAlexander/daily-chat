import { createClient } from "@/lib/supabase/server";
import InitUser from "@/lib/store/initUser";

import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatAbout } from "@/components/ChatAbout";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getSession();

  return (
    <>
      <div className="mx-auto max-w-3xl h-[100svh] md:py-10">
        <div className="relative border rounded-md flex flex-col h-full">
          <ChatHeader user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <>
              <ChatAbout />
            </>
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
