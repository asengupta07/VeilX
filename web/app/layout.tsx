import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/component/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });
const darkMode = true;

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
    <html lang="en" className={`${darkMode ? "dark" : ""}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <Navbar />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
