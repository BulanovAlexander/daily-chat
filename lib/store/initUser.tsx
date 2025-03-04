"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { useUser } from "./user";

import type { User } from "@supabase/supabase-js";

export default function InitUser({ user }: { user: User | undefined }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
