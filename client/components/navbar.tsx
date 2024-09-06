"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ConnectIt } from "@/app/contexts/StateContext";
import Image from "next/image";
import { useTheme } from "next-themes";
import ThemeToggle from "./component/ThemeToggle";
import { useAuth } from "@/app/contexts/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Component() {
  const pathname = usePathname();
  const router = useRouter();
  const isFixedNav = ["/", "/login", "/uploads", "/preview"].includes(pathname);
  const { token, username, logout } = useAuth();
  const { theme } = useTheme();

  const navLinks = [
    { name: "About Us", route: "/about" },
    { name: "How to Use", route: "/how-to-use" },
    { name: "Features", route: "/features" },
    { name: "Marketplace", route: "/marketplace" },
  ];

  return (
    <nav
      className={`${
        isFixedNav ? "fixed" : "relative"
      } h-[10vh] top-0 left-0 right-0 z-50 px-6 py-2 transition-all duration-300 ease-in-out bg-transparent flex items-center`}
    >
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src={theme === "light" ? "/VeilX_Dark.png" : "/VeilX_Logo.png"}
            alt="Logo"
            width={100}
            height={100}
            className="aspect-video"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6 mr-auto ml-8">
          {navLinks.map(({ name, route }) => (
            <Link
              key={name}
              href={route}
              className={`relative transition-colors duration-300 ${
                pathname === route
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {name}
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform transition-transform duration-300 origin-left ${
                  pathname === route
                    ? "scale-x-100"
                    : "scale-x-0 hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                {username}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="pointer-events-auto"
                  onClick={() => router.push("/my-docs")}
                >
                  My Docs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="pointer-events-auto"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : pathname === "/login" ? (
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
