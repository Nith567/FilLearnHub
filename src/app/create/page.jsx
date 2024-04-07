'use client'
import React from 'react'
import { Database } from "@tableland/sdk";
import { useState,useCallback } from 'react';
import lighthouse, { upload } from "@lighthouse-web3/sdk"
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { deployContract } from '@/utils/contract';
import { Registry } from "@tableland/sdk";

function page() {
  const {wallets} = useWallets();
    const [file, setFile] = useState(null)
    const [contracts, setContract] = useState('')
    const [title, setTitle] = useState('');
    const [metadata, setMetadata] = useState('');
    const [outputHash, setoutputHash] = useState('');
    const [price, setPrice] = useState('');
    const [fileURL, setFileURL] = useState(null)
    const apiKey = 'e504cd89.d619030881094014b1733dda637c4603'
    const {ready, authenticated, login,user,signMessage} = usePrivy();

    const progressCallback = (progressData) => {
      let percentageDone =
        100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
      console.log(percentageDone)
    }
    const disableLogin = !ready || (ready && authenticated);
    const initializeSigner=useCallback(async()=> {
      const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
      if (!embeddedWallet) {
        console.error('Embedded wallet not found');
        return null;
      }
      console.log(embeddedWallet.chainId);

      await embeddedWallet.switchChain(314159);
      const providers = await embeddedWallet.getEthersProvider();
      return providers.getSigner();
    },[wallets])
    

 const signAuthMessages = async () => {

   const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
      try {
        if (!embeddedWallet) {
          console.error('Embedded wallet not found');
          return null;
        }
        else{
        await embeddedWallet.switchChain(314159);
        const providers = await embeddedWallet.getEthersProvider();
         const signerAddressS= providers.getSigner();
         const signerAddress=await  signerAddressS.getAddress(); 
        const {message}  = (await lighthouse.getAuthMessage(signerAddress)).data
        console.log(message);

        // const accounts = await wallet.provider.request({
        //   method: 'eth_requestAccounts',
        // });
        const signatures = await signMessage(message)
        return ({
          publicKey:signerAddress,
          signMessage:signatures
        })
      } 
    }
      catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }

  }
   const accessControls = async (cid,contractAddress) => {
    try {
    //   const cid = "QmR5GquwoNgf77Jen5p1ArMa3GqpdTBVzrHrxvY2SzMWRC"
      const conditions = [
        {
            id: 314159,
            chain: "Calibration",
            standardContractType: "Custom",
            method: "isActive",
            contractAddress: contractAddress,//'0x9093638b20Ce78e4d93Bfed3814f2403776FcCE5',//we need to get the contract from the owner once deploys it
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

      const { publicKey, signMessage } = await signAuthMessages();

      const response = await lighthouse.applyAccessCondition(
        publicKey,
        cid,
        signMessage,
        conditions,
        aggregator
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  
    const uploadEncryptedFile = async () => {
      if (!file) {
        console.error("No file selected.")
        return
      }
      try {
        const {publicKey, signMessage} = await signAuthMessages();
        const output = await lighthouse.uploadEncrypted(
          file,
         apiKey,
          publicKey,
          signMessage,
          progressCallback
        )
       console.log("Encrypted File Status:", output.data[0].Hash)
       setoutputHash( output.data[0].Hash)
      } catch (error) {
        console.error("Error uploading encrypted file:", error)
      }
    }




  

  const uploadOnce=async()=>{
    const signer=await initializeSigner();
    const db = new Database({ signer });
    const prefix = "demolearn";
    const { meta: create } = await 
   db.prepare(`CREATE TABLE ${prefix} (id integer primary key,contract text, title text, metadata text,price int,owner text,cid text);`)
       .run();
    
    await create.txn?.wait();
    let tableNams = create.txn?.names[0]
    console.log(tableNams)
  }

const sets=async(e)=>{
  const signer=await initializeSigner();
  const registry = new Registry({ signer });
  const tx = await registry.setController({
    tableName: "demolearn_314159_829",
    controller: "0x778b93fdfbce56f43cfcd5b1856b5f2ab28de962",
  });
}

const uploadData=async(e)=>{
  e.preventDefault();

      const signer=await initializeSigner();
      const db = new Database({ signer });
  const owner=await signer.getAddress();
  console.log(" so here , ", owner)

  const priceWei = ethers.utils.parseEther(price).toString();
  // let contract= await deployContract(signer, outputHash,priceWei);
  let contract= await deployContract(signer, outputHash,priceWei);
  setContract(contract.address);
  console.log(contract.address)

  const { meta: insert } = await db.prepare(`INSERT INTO demolearn_314159_829 (contract,title,metadata, price, owner, cid) VALUES (?, ?, ?, ?, ?, ?)`).bind(`${contract.address}`,title,metadata,price,owner,outputHash)
  .run();
let ct= await insert.txn?.wait();
console.log("Transaction Complete!")
await accessControls(outputHash,contracts)

console.log(ct)
}


  const handleFileChange = (e) => {
    const selectedFile = e.target.files
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <>
    <div className="App">
     
<div>
        <input type="file" onChange={handleFileChange} />
        </div>

<div>
  
{ready && !authenticated && (
      <button disabled={disableLogin} onClick={login}>
        Log in
      </button>
    )}
</div>
     <button className='m-2 p-3 bg-red-500' onClick={uploadEncryptedFile}>uploadencrypt</button>
     <button className='m-2 p-3 bg-red-500' onClick={uploadOnce}>tableuploadonce</button>
     <button className='m-2 p-3 bg-red-500' onClick={sets}>sets</button>
     

fuck
     {/* <button onClick={sets}>setcontroler</button> */}
     <button className='m-2 p-3 bg-red-500' onClick={signAuthMessages}>signauthmessages</button>




      <div>
        <div>
        <form onSubmit={uploadData} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="metadata" className="block font-medium text-gray-700">Metadata</label>
          <input type="text" id="metadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium text-gray-700">Price</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Submit</button>
      </form>
        </div>
{/* 
      <button onClick={()=>decrypt()}>decrypt</button>
      {
        fileURL?
          <a href={fileURL} target="_blank">viewFile</a>
        :
          <div className='m-2'>not available</div>
      } */}

      </div>
    </div>
    </>
  )
}

export default page

