'use client'
import { useCallback, useEffect,useState } from "react";
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
    const {ready, authenticated, login,user} = usePrivy();
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

const switchsepolia=useCallback(async()=> {
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  if (!embeddedWallet) {
    console.error('Embedded wallet not found');
    return null;
  }
  await embeddedWallet.switchChain(11155111);
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

 const notify=async()=>{
  //  const signer=await initializeSigner();
  //  if (!signer) return;
const userAlice=await aliceuser();

if(!userAlice)return null;

  const aliceInfo = await userAlice.notification.list('INBOX');
  console.log(aliceInfo)
  
 }



const purchase =async()=>{
  const signer=await initializeSigner();
  console.log('puk ', apiData.price)
  //  const buyed= await purchaseContract(signer,,apiData.price);
  const priceWei = ethers.utils.parseEther(String(apiData.price)).toString();

  console.log('puk ', priceWei, apiData.price)
  const buyed= await purchaseContract(signer,"0xc0d3e466Db7F3d36d1E81F69f3bFBb3E43Dd4D6d",priceWei);

  const signers=await switchsepolia()
   const userAlice = await PushAPI.initialize(signers, {
    env: 'staging',
  });
  const aliceInfo = await userAlice.notification.list('INBOX');
  console.log(aliceInfo)

  const targetedNotif = await userAlice.channel.send(
    ["*"],
    {
      notification: {
        title: "Sucessfully bitch subscribed",
        body: `By ${aliceInfo}`,
      },
    },
  );
}




const sendnot=async()=>{
  
  try{
    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    if (!embeddedWallet) {
      console.error('Embedded wallet not found');
      return null;
    }
    await embeddedWallet.switchChain(11155111);
    const providers = await embeddedWallet.getEthersProvider();
    const signer=  providers.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: 'staging',
    });
    if(!userAlice)return null;
    const sendNotifRes = await userAlice.channel.send(['0xDB8c1d498F18d4A55A7Ff7465402329F193D0E58'], {
      notification: { title: 'fkkkk', body: 'fkkkkk' },
    });
    console.log("poop", sendNotifRes)
//  await userAlice.channel.send(
//     ['*'],
//     {
//       notification: {
//         title: 'bitch subscribedalsdjf',
//         body: `By`,
//       },
//     }
//   )

  }
  catch(error){
    console.error("Error:", error);
  }
}

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
        <button  className='mt-1 text-md bg-orange-600 p-2'onClick={sendnot}>notify</button>
      </div>
    </div>

    {ready && !authenticated && (
      <button disabled={disableLogin} onClick={login}>
        Log in
      </button>
    )}
    {ready && authenticated && (
        <div>
      <p>User {user?.id} is logged in. {user?.wallet?.address}
      <li>Google: {user?.google ? user?.google.email : 'None'}</li>
      <li>Email: {user?.email ? user?.email.address : 'None'}</li>
      <button onClick={notify}>notify</button>
      </p>

</div>
    )}

    </>
)
}
