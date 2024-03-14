'use client'
import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import { useState } from 'react';
import lighthouse from "@lighthouse-web3/sdk"
import { useWallet } from '@/context/walletcontext';
import { ethers } from 'ethers';
import { purchaseContract } from '@/utils/contract';
import { deployContract } from '@/utils/contract';
function page() {
    const [file, setFile] = useState(null)
    const [contract, setContract] = useState('')

  const [fileURL, setFileURL] = useState(null)

    const apiKey = 'e504cd89.d619030881094014b1733dda637c4603'
    const walletAddress=useWallet();

  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
console.log('p ',walletAddress.walletAddress)
        const signerAddress = String(walletAddress.walletAddress);
        console.log("so ",signerAddress)
        const { message } = (await lighthouse.getAuthMessage(signerAddress)).data
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        })
        return { signature, signerAddress }
      } catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }
    } else {
      console.log("Please install Wallet!")
      return null
    }
  }

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
    console.log(percentageDone)
  }

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const signerAddress = String(walletAddress.walletAddress);
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address
    };
  };

  const decrypt = async () => {
    try {
      const cid = "QmWU6WqYHQKwzoh2VskyswPGLPCTWDhsakMgtn8jK46rDd";
      const { publicKey, signedMessage } = await encryptionSignature();
      const keyObject = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signedMessage
      );
  
      const fileType = "image/jpeg";
      const decrypted = await lighthouse.decryptFile(
        cid,
        keyObject.data.key,
        fileType
      );
      
      console.log('decrypt bro', decrypted);
      
      const url = URL.createObjectURL(decrypted);
      console.log(url);
      
      setFileURL(url);
    } catch (error) {
      console.error('Error during decryption:', error);
    }
  };
  
  const accessControl = async () => {
    try {
      const cid = "QmR5GquwoNgf77Jen5p1ArMa3GqpdTBVzrHrxvY2SzMWRC"
      const conditions = [
        {
            id: 1,
            chain: "Calibration",
            standardContractType: "Custom",
            method: "isActive",
            contractAddress: '0x9093638b20Ce78e4d93Bfed3814f2403776FcCE5',//we need to get the contract from the owner once deploys it
            returnValueTest: {
                comparator: "==",
                value: "1"
            },
            parameters: [":userAddress"],
            inputArrayType: ["address"],
            outputType: "int256",
        },
    ];
      const aggregator = "([1])"
  
      // const signedMessage = await signAuthMessage()
      const { publicKey, signedMessage } = await encryptionSignature();

      const response = await lighthouse.applyAccessCondition(
        publicKey,
        cid,
        signedMessage,
        conditions,
        aggregator
      )
  
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }


const deploy=async()=>{
  let contract;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const priceWei = ethers.utils.parseEther("0.2").toString();
  contract = await deployContract(signer, "QmR5GquwoNgf77Jen5p1ArMa3GqpdTBVzrHrxvY2SzMWRC", '2000000000000000000');
  setContract(contract.address);
  console.log(contract.address, ' hi ', contract)
}

  const uploadEncryptedFile = async () => {
    if (!file) {
      console.error("No file selected.")
      return
    }

    try {
      const encryptionAuth = await signAuthMessage()
      if (!encryptionAuth) {
        console.error("Failed to sign the message.")
        return
      }

      const {publicKey, signedMessage} = await encryptionSignature();

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        publicKey,
        signedMessage,
        progressCallback
      )
      console.log("Encrypted File Status:", output)
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      )
    } catch (error) {
      console.error("Error uploading encrypted file:", error)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadEncryptedFile} disabled={!file}>
        UploadEncrypt
      </button>
      <div>

      <button onClick={()=>decrypt()}>decrypt</button>
      {
        fileURL?
          <a href={fileURL} target="_blank">viewFile</a>
        :
          <div className='m-2'>not avaible bro</div>
      }
      </div>
 <div>
 {/* <button onClick={()=>accessControl()}>Accesscontrol</button> */}
 <button onClick={()=>deploy()}>deploy</button>
 </div>
    </div>
  )
}

export default page

