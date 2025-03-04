import * as React from "react";

export function ChatAbout() {
  return (
    <div className="m-auto max-w-[500px] p-4">
      <h1 className="mb-2 font-bold text-3xl text-center">
        Добро Пожаловать в Daily&nbsp;Chat
      </h1>
      <p className="text-center">
        Это приложение для общения в чате, которое поддерживает базу данных
        «supabase» в режиме реального времени. Чтобы отправить сообщение,
        войдите в систему.
      </p>
    </div>
  );
}
