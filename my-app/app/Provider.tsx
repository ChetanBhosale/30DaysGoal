"use client";

import { store } from "@/store/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

interface ProviderPros {
  children?: ReactNode;
}

export function CustomProvider({ children }: ProviderPros) {
  return <Provider store={store}>{children}</Provider>;
}
