'use client';

import { opencampus } from '@/constant/educhain-rpc';
import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { readContract } from 'wagmi/actions';
import fetchData from '@/libs/fetchData';
import { Address, parseEther } from 'viem';
import { config } from '@/app/provider';
import { LD_EduProgramABI } from '@/constant/LD_EduProgramABI';
import { ERROR_MESSAGE } from '@/constant/message';

interface SignForClaimInput {
  programId: number;
  missionNumber: number;
  recipient: string;
  prize: string;
}

interface UseValidatorReturn {
  signForClaim: (input: SignForClaimInput) => Promise<void>;
}

export const useValidator = (): UseValidatorReturn => {
  const { signTypedDataAsync } = useSignTypedData();
  const account = useAccount();
  // function claim(uint256 programId_, uint256 missionNumber, address recipient, uint256 amount, bytes memory sig)

  const signForClaim = async ({ programId, missionNumber, recipient, prize }: SignForClaimInput) => {
    const programInfo = await fetchData(`/programs/${programId}`);

    const validatorAddress = await readContract(config, {
      address: programInfo.program_address,
      abi: LD_EduProgramABI,
      functionName: 'auditor',
      args: [BigInt(missionNumber)],
    });

    if (account.address?.toLowerCase() !== validatorAddress.toLowerCase()) throw ERROR_MESSAGE.INVALID_VALIDATOR;

    const sig = await signTypedDataAsync({
      domain: {
        name: 'Ludium',
        version: '0.1',
        // [Todo]: cross-chain 에서는 별도의 파라미터로 받아야함.
        chainId: opencampus.id,
        verifyingContract: programInfo.program_address,
      },
      types: {
        Claim: [
          {
            type: 'uint256',
            name: 'programId',
          },
          {
            type: 'uint256',
            name: 'missionNumber',
          },
          {
            type: 'address',
            name: 'recipient',
          },
          {
            type: 'uint256',
            name: 'amount',
          },
        ],
      },
      primaryType: 'Claim',
      message: {
        programId: BigInt(programId),
        missionNumber: BigInt(missionNumber),
        recipient: recipient as Address,
        amount: parseEther(prize),
      },
    });

    await fetchData('/signature/add', 'POST', {
      sigData: {
        programId,
        missionId: missionNumber,
        validator: account.address,
        recipient,
        prize,
        sig,
      },
    });
  };

  return { signForClaim };
};
