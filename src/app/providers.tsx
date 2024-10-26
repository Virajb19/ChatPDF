"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={query}>
      <SessionProvider>
        <RecoilRoot>
          {children}
          </RecoilRoot>
      </SessionProvider>
    </QueryClientProvider>
  )
}
