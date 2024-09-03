"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  use,
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
const chain = defineChain({
  id: 99222,
  rpc: "https://solid-space-invention-xv99v7wpq6v36pq6-9650.app.github.dev/ext/bc/VeilX/rpc",
  nativeCurrency: {
    name: "VeilX",
    symbol: "VX",
    decimals: 18,
  },
});

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
      chain={chain}
      connectButton={{
        label: "Connect Wallet",
      }}
    />
  );
}
interface StateContextType {
  address: string;
  contract: any;
  account: any;
  buyData: (amount: number) => Promise<void>;
  distributeFunds: (address: string, amount: number) => Promise<void>;
}
const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  useEffect(() => {
    if (useActiveAccount()) {
      setAccount(useActiveAccount());
      setAddress(account.address);
    }
  }, [useActiveAccount()]);
  useEffect(() => {
    async function contractInit() {
      if (account) {
        const contract = await getContract({
          client,
          chain: chain,
          address: "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922",
        });
        setContract(contract);
      }
    }
    contractInit();
  }, [account]);

  
}
