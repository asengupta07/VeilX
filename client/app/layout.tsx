import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/component/ThemeToggle";
import { ThirdwebProvider } from "thirdweb/react";
import { StateContextProvider } from "@/app/contexts/StateContext";
import { AuthProvider } from "./contexts/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeilX",
  description: "RE-DACT your data and Earn Rewards",
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
          <StateContextProvider>
            <ThemeProvider attribute="class">
              <AuthProvider>
                <Navbar />
                {children}
              </AuthProvider>
            </ThemeProvider>
          </StateContextProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
