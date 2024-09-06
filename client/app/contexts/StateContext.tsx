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
  toWei,
  defineChain,
  waitForReceipt,
} from "thirdweb";
const chain = defineChain(43113);

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
export function ConnectIt() {
  const { theme } = useTheme();
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={`${theme === "dark" ? "dark" : "light"}`}
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
  buyData: (amount: string) => Promise<void>;
  distributeReward: (address: string, amount: string) => Promise<void>;
}
const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateContextProvider({ children }: { children: ReactNode }) {
  const activeAccount = useActiveAccount();
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  useEffect(() => {
    if (activeAccount) {
      setAccount(activeAccount);
      setAddress(activeAccount.address);
    }
  }, [activeAccount]);
  useEffect(() => {
    async function contractInit() {
      if (account) {
        const contract = await getContract({
          client,
          chain: chain,
          address: "0x91cD7Ce64D50cc4BcA801D159CfF3745249638aD",
        });
        setContract(contract);
      }
    }
    contractInit();
  }, [account]);
  async function buyData(amount: string) {
    const transaction = await prepareContractCall({
      contract,
      method: "function buyData() payable",
      params: [],
      value: toWei(amount),
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });
    const receipt = await waitForReceipt({
      client,
      chain,
      transactionHash,
    });
    console.log(receipt);
  }
  async function distributeReward(address: string, amount: string) {
    const transaction = await prepareContractCall({
      contract,
      method: "function distributeReward(address, uint256)",
      params: [address, toWei(amount)],
    });
    const tx = await sendTransaction({
      transaction,
      account,
    });

    const receipt = await waitForReceipt({
      client,
      chain,
      transactionHash: tx.transactionHash,
    });
    console.log(receipt);
  }
  return (
    <StateContext.Provider
      value={{ address, contract, account, buyData, distributeReward }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};
