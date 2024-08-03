import { checksumAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// This is a test wallet, do not use this private key.
const account = privateKeyToAccount("0x05c190619e57f47a402dab4386a8ee87de0421e8e43dd1caed522bf44d6d4121");

async function main(chainId, contractAddress, programId, chapterIndex, recipient) {
  const sig = await account.signTypedData({
    domain: {
      name: "Ludium",
      version: "0.1",
      chainId,
      verifyingContract: contractAddress,
    },
    types: {
      Claim: [
        {
          type: "uint256",
          name: "programId",
        },
        {
          type: "uint256",
          name: "chapterIndex",
        },
        {
          type: "address",
          name: "recipient",
        },
      ],
    },
    primaryType: "Claim",
    message: {
      programId: BigInt(programId),
      chapterIndex: BigInt(chapterIndex),
      recipient,
    },
  });

  console.log(sig);
}

const args = process.argv.slice(2);
const chainId = parseInt(args[0]);
const contractAddress = args[1];
const programId = parseInt(args[2]);
const chapterIndex = parseInt(args[3]);
const recipient = args[4];

if (args.length < 5) {
  console.error("Usage: node sig-gen.js <chainId> <contractAddress> <programId> <chapterIndex> <recipient>");
  process.exit(1);
}

main(chainId, contractAddress, programId, chapterIndex, recipient);
