import ContractABI from "./contractABI.json";
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const contractAddress = "0xD88c24F137152B97BF33C5d500a3B5aC90dFf248";

//contract configuration
export const contractConfig = {
    address: contractAddress,
    abi: ContractABI,
}

//maximum mint per wallet
export const maxMintPerWalletCall = {
    ...contractConfig,
    functionName: 'maxMintAmount',
    watch: true,
}

//maximum supply
export const maxSupplyCall = {
    ...contractConfig,
    functionName: 'maxSupply',
    watch: true,
}

//total minted items
export const totalMintedCall = {
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
}

//public mint cost
export const publicMintCostCall = {
    ...contractConfig,
    functionName: 'cost',
    watch: true,
}

//public mint
export const publicMintCall = {
    ...contractConfig,
    functionName: 'mint',
}