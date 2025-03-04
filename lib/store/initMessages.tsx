"use client";

import * as React from "react";
import { useRef, useEffect } from "react";

import { useMessages } from "./messages";
import type { Imessage } from "./messages";
import { LIMIT_MESSAGE } from "../constant";

export default function InitMessages({ messages }: { messages: Imessage[] }) {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages, hasMore });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
