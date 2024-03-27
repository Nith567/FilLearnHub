import { ethers } from 'ethers';
import lighthouse from "@lighthouse-web3/sdk"

const apiKey = 'e504cd89.d619030881094014b1733dda637c4603'

export const signAuthMessages = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
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

 export const encryptionSignatures = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address
    };
  };

 export const decrypts = async (cid) => {
    try {
    //   const cid = "QmWU6WqYHQKwzoh2VskyswPGLPCTWDhsakMgtn8jK46rDd";
      const { publicKey, signedMessage } = await encryptionSignatures();
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


  export const accessControls = async (cid,contractAddress) => {
    try {
    //   const cid = "QmR5GquwoNgf77Jen5p1ArMa3GqpdTBVzrHrxvY2SzMWRC"
      const conditions = [
        {
            id: 1,
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

      const { publicKey, signedMessage } = await encryptionSignatures();

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


 export const uploadEncryptedFiles = async (file) => {
    if (!file) {
      console.error("No file selected.")
      return
    }

    try {
      const encryptionAuth = await signAuthMessages()
      if (!encryptionAuth) {
        console.error("Failed to sign the message.")
        return
      }

      const {publicKey, signedMessage} = await encryptionSignatures();

      const output = await lighthouse.uploadEncrypted(
        file,
       apiKey,
        publicKey,
        signedMessage,
        progressCallback
      )
      console.log("Encrypted File Status:", output.data[0].Hash)
      return output.data[0].Hash
    } catch (error) {
      console.error("Error uploading encrypted file:", error)
    }
  }