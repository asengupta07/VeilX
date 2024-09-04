"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ConnectIt } from "@/app/contexts/StateContext";

export default function Component() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Mapping items to their routes
  const navItems = [
    { name: "About Us", route: "/about" },
    { name: "How to Use", route: "/how-to-use" },
    { name: "Features", route: "/features" },
  ];
  
  return (
    <nav className="fixed h-[10vh] top-0 left-0 right-0 z-50 px-6 py-2 transition-all duration-300 ease-in-out bg-transparent flex items-center">
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-4">
          <svg
            className="text-purple-600 dark:text-purple-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            Veil<span className="text-purple-600 dark:text-purple-400">X</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-6 mr-auto ml-8">
          {navItems.map(({ name, route }) => (
            <Link
              key={name}
              href={route}
              className="relative text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
            >
              {name}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100" />
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
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