import * as React from "react";

import { Ellipsis } from "lucide-react";

import { useUser } from "@/lib/store/user";
import { useMessages } from "@/lib/store/messages";
import type { Imessage } from "@/lib/store/messages";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MessageMenu({ message }: { message: Imessage }) {
  const setActionMessage = useMessages((state) => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatMessage({ message }: { message: Imessage }) {
  const user = useUser((state) => state.user);

  return (
    <div className="flex gap-2">
      <Avatar>
        <AvatarImage src={message.daily_chat_users.avatar_url || ""} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-1 justify-between">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm">
              {message.daily_chat_users.full_name}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(message.created_at).toLocaleDateString()}
            </p>
            {message.is_edit && (
              <p className="text-xs text-gray-400">изменено</p>
            )}
          </div>
          {message.send_by === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-400">{message.text}</p>
      </div>
    </div>
  );
}
