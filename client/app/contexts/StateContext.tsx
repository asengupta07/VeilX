"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/client";
import { useTheme } from "next-themes";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
  defineChain,
} from "thirdweb";
import { ethers, formatEther } from "ethers";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
export function ConnectIt() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={`${useTheme().theme === "dark" ? "dark" : "light"}`}
      connectModal={{
        size: "wide",
        title: "Connect to VeilX",
        showThirdwebBranding: false,
      }}
      chain={defineChain(43113)}
      connectButton={{
        label: "Connect Wallet",
      }}
    />
  );
}
