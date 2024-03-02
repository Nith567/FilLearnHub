import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useWallet } from '@/app/context/walletcontext';

const ConnectWallet = ({ onWalletConnect }) => {
  const { updateWalletAddress, walletAddress } = useWallet();

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const targetChainId = 314159; 
  const [isConnected, setIsConnected] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!window?.ethereum || !window?.ethereum?.selectedAddress) return;

    const web3Instance = new Web3(window.ethereum);
    const selectedAddress = window.ethereum.selectedAddress;

    setWeb3(web3Instance);
    setAccount(selectedAddress);
    setIsConnected(true);
    updateWalletAddress(selectedAddress);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
        console.log("connected wrong")
      alert("You need an Ethereum-compatible wallet to proceed");
      return;
    }

    try {
      setIsConnecting(true);
      setIsSwitchingNetwork(false);

      const web3Instance = new Web3(window.ethereum);

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x4CB2F',
            chainName: 'Filecoin - Calibration testnet',
            nativeCurrency: {
              name: 'FILHub',
              symbol: 'tFIL',
              decimals: 18,
            },
            rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
            blockExplorerUrls: [
              'https://calibration.filscan.io',
            ],
          },
        ],
      });

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });

      window.ethereum.on('accountsChanged', () => window.location.reload(false));
      window.ethereum.on('chainChanged', () => {
        setIsSwitchingNetwork(true);
        setIsConnected(false);
        window.location.reload(false);
      });

      const accounts = await web3Instance.eth.getAccounts();
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      onWalletConnect(true);
      setIsConnecting(false);
      setIsConnected(true);
      updateWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      onWalletConnect(false);
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const handleDisconnect = () => setDisconnecting(true);

  const confirmDisconnect = async () => {
    if (window?.ethereum && isConnected) {
      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: [{ eth_accounts: {} }],
        });
        setIsConnected(false);
        setDisconnecting(false);
        setShowDropdown(false);
        window.location.reload(false);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        setDisconnecting(false);
      }
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-orange-200 hover:bg-orange-400 border border-white text-white font-bold py-2 px-4 rounded ${disconnecting ? 'cursor-not-allowed' : ''}`}
          >
            {disconnecting ? 'Disconnecting...' : `Connected: ${account?.slice(0, 4)}...${account?.slice(-4)}`}
          </button>
          {showDropdown && (
            <div className="absolute mt-2 py-2 w-48 bg-white border rounded shadow-xl">
              <button
                onClick={confirmDisconnect}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting || isSwitchingNetwork}
          className={`bg-orange-200 hover:bg-orange-700 border border-white text-white font-bold py-2 px-4 rounded ${isConnecting || isSwitchingNetwork ? 'cursor-not-allowed' : ''}`}
        >
          {isConnecting
            ? 'Connecting...'
            : isSwitchingNetwork
            ? 'Switching networks...'
            : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
