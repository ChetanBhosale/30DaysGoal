"use client";

import type { Metadata } from "next";
import { Asap, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { CustomProvider } from "./Provider";
import Custom from "@/components/hooks/Custom";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
const asap = Asap({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${asap.className}`}>
        <SessionProvider>
          <CustomProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Custom>
                {children}
                <Toaster />
              </Custom>
            </ThemeProvider>
          </CustomProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
