"use client"
import React, { createContext, useContext, useState } from 'react';

const WalletConnect = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const updateWalletAddress = (newAddress) => {
    setWalletAddress(newAddress);
  };

  return (
    < WalletConnect.Provider value={{ walletAddress, updateWalletAddress }}>
      {children}
    </ WalletConnect.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletConnect);
};