import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SVGProps } from "react";

// Define the MountainIcon function with proper types for props
function MountainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default function Component() {
  return (
    <header className="flex h-20 z-50 fixed w-full shrink-0 items-center px-4 md:px-6 bg-transparent">
      <Link href="#" className="mr-6 flex items-center" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">VeilX</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          About Us
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Contact
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary">Sign In</Button>
        <Button>Sign Up</Button>
        <Button className="bg-white text-black hover:bg-red-600 hover:text-white">
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
