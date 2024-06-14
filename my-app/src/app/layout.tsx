import type { Metadata } from "next";
import { Inter, Roboto, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ReduxProvider from "../store/ReduxProvider";
import Custom from "@/components/Custom/CustomProvider";
import CustomProgress from "./CustomProgress";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "GetGoals.ai",
  description:
    "An Application which can help you to create and achieve your goals!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Custom>
              <Navbar />
              <CustomProgress />
              {children}
              <Toaster />
            </Custom>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
