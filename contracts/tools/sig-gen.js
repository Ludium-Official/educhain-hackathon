import { privateKeyToAccount } from 'viem/accounts'
import { encodePacked, keccak256, checksumAddress } from 'viem';
 
// This is a test wallet, do not use this private key.
const account = privateKeyToAccount("0x05c190619e57f47a402dab4386a8ee87de0421e8e43dd1caed522bf44d6d4121");
 
async function main(programId, chapterIndex, submissionId, recipient) {
    const sig = await account.signMessage({
        message: {raw: keccak256(encodePacked(['uint256', 'uint256', 'uint256', 'address'], [
            programId,
            chapterIndex,
            submissionId,
            checksumAddress(recipient)
          ]))},
    });

    console.log(
       sig
    );
}

const args = process.argv.slice(2);
const programId = parseInt(args[0]);
const chapterIndex = parseInt(args[1]);
const submissionId = parseInt(args[2]);
const recipient = args[3];

if (args.length < 4) {
    console.error('Usage: node sig-gen.js <programId> <chapterIndex> <submissionId> <recipient>');
    process.exit(1);
}

main(programId, chapterIndex, submissionId, recipient);