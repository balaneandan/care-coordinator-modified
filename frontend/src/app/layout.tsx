import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Your Partner in Efficient Healthcare Scheduling | CareCoordinator",
  description:
    "The ultimate solution for effortlessly managing your healthcare appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
