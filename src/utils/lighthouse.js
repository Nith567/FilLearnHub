import ethers from "ethers";
import lighthouse from '@lighthouse-web3/sdk';
import { useWallet } from "@/context/walletcontext";
import { abi } from "../../contract/abi";
import { contractAddress } from "./constants";

const lightHouse=()=>{
    const walletAddress=useWallet();
    const provider = new ethers.JsonRpcProvider('https://api.calibration.node.glif.io/rpc/v1');
    const filContract = new ethers.Contract(contractAddress, abi, provider);

const signAuthMessage = async (signer) => {
    const messageRequested = (await lighthouse.getAuthMessage(walletAddress)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return signedMessage;
}
const encryptionSignature = async () => {
    const provider = new ethers.JsonRpcProvider('https://api.calibration.node.glif.io/rpc/v1');
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage
    };
  };

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  };


const accessControl = async (signer) => {
    try {
    const cid = "Qma7Na9sEdeM6aQeu6bUFW54HktNnW2k8g226VunXBhrn7";
    const conditions = [
        {
            id: 314159,
            chain: "Calibration",
            standardContractType: "Custom",
            method: "isActive",
            returnValueTest: {
                comparator: "==",
                value: "1"
            },
            parameters: [":userAddress"],
            inputArrayType: ["address"],
            outputType: "uint256",
        },
    ];
    const aggregator = "([1])";
    const {  signedMessage } = await encryptionSignature();
    const response = await lighthouse.applyAccessCondition(
        walletAddress,
        cid,
        signedMessage,
        conditions,
        aggregator
    );
    console.log(response);
    }
    catch(err){
        console.log(err)
    }
}
}