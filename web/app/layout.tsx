import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/component/ThemeToggle";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeilX",
  description: "RE-DACT YOUR DATA and Earn Rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <ThemeProvider attribute="class">
            <Navbar />
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
