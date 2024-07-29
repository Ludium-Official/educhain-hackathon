import { privateKeyToAccount } from 'viem/accounts'
import { encodePacked, keccak256, checksumAddress } from 'viem';
 
// This is a test wallet, do not use this private key.
const account = privateKeyToAccount("0x05c190619e57f47a402dab4386a8ee87de0421e8e43dd1caed522bf44d6d4121");
 
async function main(programId, chapterIndex, recipient) {
    const sig = await account.signMessage({
        message: {raw: keccak256(encodePacked(['uint256', 'uint256','address'], [
            programId,
            chapterIndex,
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
const recipient = args[2];

if (args.length < 3) {
    console.error('Usage: node sig-gen.js <programId> <chapterIndex> <recipient>');
    process.exit(1);
}

main(programId, chapterIndex, recipient);