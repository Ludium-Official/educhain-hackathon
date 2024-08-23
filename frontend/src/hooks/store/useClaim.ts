'use client';

import { opencampus } from '@/constant/educhain-rpc';
import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import fetchData from '@/libs/fetchData';
import { Address, formatEther, decodeEventLog, Hex, parseEther } from 'viem';
import { config } from '@/app/provider';
import { LD_EduProgramABI } from '@/constant/LD_EduProgramABI';
import { ERROR_MESSAGE } from '@/constant/message';
import { Signature } from '@/types/signature';
import { subtract } from '@/functions/math';
import { LOG_TOPIC0 } from '@/constant/topic0';
import { LD_EventLoggerABI } from '@/constant/LD_EventLogger';

interface ClaimInput {
  programId: number;
  missionNumber: number;
}

interface UseValidatorReturn {
  claim: (input: ClaimInput) => Promise<void>;
  reset: () => void;
  txHash: string;
  isLoading: boolean;
  txSend: boolean;
  txConfirm: boolean;
}

export const useClaim = (): UseValidatorReturn => {
  const account = useAccount();
  const [txHash, setTxHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txSend, setTxSend] = useState<boolean>(false);
  const [txConfirm, setTxConfirm] = useState<boolean>(false);

  const reset = () => {
    setTxHash('');
    setIsLoading(false);
    setTxSend(false);
    setTxConfirm(false);
  };

  const claim = async ({ programId, missionNumber }: ClaimInput) => {
    setIsLoading(true);

    const [programInfo, signatures] = await Promise.all([
      fetchData(`/programs/${programId}`),
      fetchData(`/signature/recipient/${account.address}`),
    ]);

    const sig = signatures.filter(
      (signature: Signature) => signature.program_id === programId && signature.mission_id === missionNumber,
    )[0];

    if (sig.length === 0) {
      setIsLoading(false);
      throw ERROR_MESSAGE.NOT_FOUND_SIGNATURE;
    }

    try {
      const missionReserve = await readContract(config, {
        address: programInfo.program_address,
        abi: LD_EduProgramABI,
        functionName: 'prize',
        args: [BigInt(missionNumber)],
      });

      if (missionReserve < parseEther(sig.prize)) {
        setIsLoading(false);
        throw ERROR_MESSAGE.INSUFFICIENT_MISSION_RESERVE;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      throw ERROR_MESSAGE.FAIL_TO_FETCH_DATA_FROM_ONCHAIN;
    }

    try {
      const hash = await writeContract(config, {
        address: programInfo.program_address,
        abi: LD_EduProgramABI,
        functionName: 'claim',
        args: [
          BigInt(programId),
          BigInt(missionNumber),
          account.address as Address,
          parseEther(sig.prize),
          sig.sig as Hex,
        ],
      });
      setTxSend(true);
      setTxHash(hash);

      const receipt = await waitForTransactionReceipt(config, {
        hash,
      });
      setIsLoading(false);
      if (receipt.status !== 'success') {
        setTxConfirm(false);
        throw new Error('Transaction Fail');
      }
      setTxConfirm(true);

      const targetLog = receipt.logs.filter((log) => log.topics[0] === LOG_TOPIC0.PRIZE_CLAIMED)[0];
      const { args } = decodeEventLog({
        abi: LD_EventLoggerABI,
        data: targetLog.data,
        topics: targetLog.topics,
      }) as { args: { programId: bigint; missionNumber: bigint; recipient: string; prize: bigint; amount: bigint } };

      await fetchData('/signature/claimed', 'POST', {
        programId,
        missionNumber,
        sigId: sig.id,
        remain: formatEther(args.prize),
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (typeof error === 'string' && error?.includes('User rejected the request')) {
        throw ERROR_MESSAGE.TRANSACTION_REJECTED;
      }
      throw ERROR_MESSAGE.TRANSACTION_FAIL;
    }
  };

  return { claim, reset, txHash, isLoading, txSend, txConfirm };
};
