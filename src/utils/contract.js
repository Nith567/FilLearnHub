import { Datacontract } from "../../contract/abi";
import { ethers } from "ethers";

export async function deployContract(signer, cid, price) {
    
    const factory = new ethers.ContractFactory(
        Datacontract.abi,
        Datacontract.bytecode,
        signer
    );
    const contract = await factory.deploy(cid, price); 
    console.log("Deploying contract...", cid, price);
    await contract.deployed();
    console.log("deployed contract...", contract.address);
    return contract;
}

export async function purchaseContract(signer, contractAddress, price) {
    const contract = new ethers.Contract(
        contractAddress,
        Datacontract.abi,
        signer
    );
    const tx = await contract.purchaseAccess({ value: price });
    await tx.wait();
    console.log("Purchased contract...", tx);
    const result = await contract.purchaseAccess.call();
    return {cid: result};
}

export const getMetadata = async (signer, address) => {
    const contract = new ethers.Contract(
        address,
       Datacontract.abi,
        signer
    );
    const result = await contract.getMetadata.call();
    return result;
}