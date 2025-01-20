"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner'
import { TooltipProvider } from '~/components/ui/tooltip'

const query = new QueryClient({
   defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000
    }
   }
})

function ThemedToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-center"
      richColors
      theme={theme === "dark" ? "dark" : "light"}
    />
  )
}

export default function Providers({ children, ...props }: ThemeProviderProps) {

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange {...props}>
    <QueryClientProvider client={query}>
      <SessionProvider>
        <TooltipProvider>
          <ThemedToaster />
             {children}
          </TooltipProvider>
        </SessionProvider>
      </QueryClientProvider>
      </NextThemesProvider>
  )
}