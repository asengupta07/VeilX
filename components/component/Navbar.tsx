import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="flex fixed top-0 left-0 w-full p-2 border-b border-gray-400 items-center justify-between bg-white">
      <div className="basic-options flex justify-between gap-10 text-lg ">
        <div className="cursor-pointer rounded-md p-3 hover:text-red-600 font-semibold ">
          About
        </div>
        <div className="cursor-pointer rounded-md p-3 hover:text-red-600  font-semibold">
          Terms & Conditions
        </div>
        <div className="cursor-pointer rounded-md p-3 hover:text-red-600  font-semibold">
          Pricing
        </div>
      </div>

      <div className="logo-box flex items-center text-2xl">
        <Image
          className="hover:cursor-pointer"
          src="/Vercel.png"
          width={110}
          height={110}
          alt="main-logo goes here"
        />
      </div>

      <div className="login flex items-center gap-4">
        <Button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700  font-medium">
          SIGN UP
        </Button>
        <Button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium">
          SIGN IN
        </Button>
        <Button className="text-black px-4 py-2 rounded-lg hover:text-white font-bold hover:bg-red-600 border-2 border-grey">
          CONNECT WALLET
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
