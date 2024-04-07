'use client'
import { useCallback, useEffect,useState } from "react";
import lighthouse, { upload } from "@lighthouse-web3/sdk"
import { PushAPI } from '@pushprotocol/restapi';
import axios from 'axios';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import { purchaseContract } from "@/utils/contract";
import { ethers } from 'ethers';
export default function Home({ params }) {
    const id = params.id;
    const [apiData, setApiData] = useState([]);
    const {wallets} = useWallets();
    const [fileURL, setFileURL] = useState(null)
    const {ready, authenticated, login,user,signMessage} = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20demolearn_314159_829%20where%20id%3D${id}`)
      setApiData(response.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [id]);

const initializeSigner=useCallback(async()=> {
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  if (!embeddedWallet) {
    console.error('Embedded wallet not found');
    return null;
  }
  await embeddedWallet.switchChain(314159);
  const providers = await embeddedWallet.getEthersProvider();
  return providers.getSigner();
},[wallets])


const aliceuser=useCallback(async()=>{
  const signer=await initializeSigner();
  
  if (!signer) return;
 const userAlice = await PushAPI.initialize(signer, {
   env: 'staging',
 });
 return userAlice;
},[wallets])


const purchase =async()=>{
  const signer=await initializeSigner();
  console.log(apiData.price)
  const priceWei = ethers.utils.parseEther(String(apiData.price)).toString();

  console.log( priceWei, apiData.price)
  const buyed= await purchaseContract(signer,apiData.contract,priceWei);
}





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
 const decrypts = async (cid) => {
  try {
  //   const cid = "QmWU6WqYHQKwzoh2VskyswPGLPCTWDhsakMgtn8jK46rDd";
    const { publicKey, signMessage } = await signAuthMessages();
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signMessage
    );

    // const fileType = "image/jpeg";
    const fileType = "video/mp4";
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


return(
    <>
         <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dataset Details</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Dataset Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details of the dataset.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{apiData.title}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Owner</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{apiData.owner}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Price</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{apiData.price}</dd>
            </div>
          </dl>
        </div>
        <button  className='mt-1 text-md bg-orange-400 p-2'onClick={purchase}>purchase</button>
      </div>
    </div>

    {ready && !authenticated && (
      <button className=" inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg "disabled={disableLogin} onClick={login}>
        Log in
      </button>
    )}
    {ready && authenticated && (
  <div>
    <p className="text-lg font-semibold">User {user?.id} is logged in.</p>
    <p className="text-sm text-gray-600">Wallet Address: {user?.wallet?.address}</p>
    <ul className="list-disc pl-6 mt-2">
      <li className="text-sm text-gray-600">Google: {user?.google ? user?.google.email : 'None'}</li>
      <li className="text-sm text-gray-600">Email: {user?.email ? user?.email.address : 'None'}</li>
    </ul>
    <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-700" onClick={() => decrypts(apiData.cid)}>Decrypt</button>
    <div className="mt-4">
      {fileURL ?
        <a href={fileURL} target="_blank" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">View File</a>
        :
        <div className="text-gray-600">Not Available</div>
      }
    </div>
  </div>
)}

    </>
)
}
