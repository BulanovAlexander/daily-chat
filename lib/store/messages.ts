import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  daily_chat_users: {
    avatar_url: string | null;
    created_at: string;
    full_name: string | null;
    email: string | null;
    id: string;
  };
};

interface MessagesState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  messageIds: string[];
  actionMessage: Imessage | undefined;
  addMessage: (message: Imessage) => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage | undefined) => void;
  setMessageIds: (messageId: string) => void;
  setMessages: (messages: Imessage[]) => void;
}

export const useMessages = create<MessagesState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  messageIds: [],
  actionMessage: undefined,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  deleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((m) => m.id !== messageId),
      };
    }),
  updateMessage: (message) =>
    set((state) => {
      return {
        messages: state.messages.filter((m) => {
          if (m.id === message.id) {
            m.text = message.text;
            m.is_edit = message.is_edit;
          }

          return m;
        }),
      };
    }),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  setMessageIds: (messageId) =>
    set((state) => ({ messageIds: [...state.messageIds, messageId] })),
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    })),
}));
