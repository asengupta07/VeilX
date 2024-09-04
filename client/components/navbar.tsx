"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ConnectIt } from "@/app/contexts/StateContext";
import Image from "next/image";
import { useTheme } from "next-themes";
import ThemeToggle from "./component/ThemeToggle";

export default function Component() {
  const pathname = usePathname();
  const router = useRouter();

  const isFixedNav = ["/", "/login", "/uploads", "/preview"].includes(pathname);

  return (
    <nav
      className={`${
        isFixedNav ? "fixed" : "relative"
      } h-[10vh] top-0 left-0 right-0 z-50 px-6 py-2 transition-all duration-300 ease-in-out bg-transparent flex items-center`}
    >
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src={
              useTheme().theme === "light"
                ? "/VeilX_Dark.png"
                : "/VeilX_Logo.png"
            }
            alt="Logo"
            width={100}
            height={100}
            className="aspect-video"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6 mr-auto ml-8">
          {["About Us", "How to Use", "Features", "Marketplace"].map((item) => (
            <Link
              key={item}
              href="#"
              className="relative text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100" />
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {pathname === "/login" ? (
            <Button
              variant="ghost"
              className="text-gray-800 hover:text-purple-700 hover:bg-purple-100 dark:text-white dark:hover:text-purple-200 dark:hover:bg-purple-800/20"
              onClick={() => router.push("/")}
            >
              Go Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-gray-800 hover:text-purple-700 hover:bg-purple-100 dark:text-white dark:hover:text-purple-200 dark:hover:bg-purple-800/20"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}

          <ConnectIt />
        </div>
      </div>
    </nav>
  );
}
