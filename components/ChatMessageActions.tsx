"use client";

import * as React from "react";
import { useRef } from "react";
import { toast } from "sonner";

import { useMessages } from "@/lib/store/messages";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function DeleteAlert() {
  const actionMessage = useMessages((state) => state.actionMessage);
  const deleteMessage = useMessages((state) => state.deleteMessage);

  const handleDeleteMessage = async () => {
    if (!actionMessage) return;

    deleteMessage(actionMessage.id);

    const supabase = createClient();
    const { error } = await supabase
      .from("daily_chat_messages")
      .delete()
      .eq("id", actionMessage.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Сообщение удалено");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие невозможно отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Хорошо
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const inputRef = useRef(null) as React.RefObject<HTMLInputElement | null>;
  const actionMessage = useMessages((state) => state.actionMessage);
  const updateMessage = useMessages((state) => state.updateMessage);

  const handleEditMessage = async () => {
    const text = inputRef.current?.value;
    if (text && actionMessage) {
      updateMessage({ ...actionMessage, text, is_edit: true });

      const supabase = createClient();
      const { error } = await supabase
        .from("daily_chat_messages")
        .update({ text, is_edit: true })
        .eq("id", actionMessage.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Сообщение обновлено");
      }

      document.getElementById("trigger-edit")?.click();
    } else {
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-delete")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать сообщение</DialogTitle>
        </DialogHeader>

        <Input ref={inputRef} id="name" defaultValue={actionMessage?.text} />

        <DialogFooter>
          <Button onClick={handleEditMessage}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
