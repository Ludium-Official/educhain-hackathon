import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import fetchData from '@/libs/fetchData';

import { isNil } from 'ramda';
import { useUser } from './user';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/app/provider';
import { LD_ProgramFactoryABI } from '@/constant/LD_ProgramFactoryABI';
import { Address, decodeEventLog, Hex, parseEther } from 'viem';
import {
  parseZonedDateTime,
  today,
  fromDate,
  CalendarDateTime,
  getLocalTimeZone,
  parseAbsolute,
  toCalendarDateTime,
  Time,
} from '@internationalized/date';
import { useAccount } from 'wagmi';
import { LOG_TOPIC0 } from '@/constant/topic0';
import { LD_EventLoggerABI } from '@/constant/LD_EventLogger';
import { CONTRACT_ADDRESS } from '@/constant/deployed-addresses';
import { ERROR_MESSAGE } from '@/constant/message';
import { opencampus } from '@/constant/educhain-rpc';

interface Mission {
  reserve: string;
  prize: string;
  validators: string;
  owner: string;
  title: string;
  content: string;
  category: string;
  end_at: CalendarDateTime;
}

interface ProgramInfoType {
  programId: number;
  title: string;
  start_at: CalendarDateTime;
  end_at: CalendarDateTime;
  description: string;
  managers: { address: string; name?: string }[];
  prize: string;
  missions: Mission[];
}

const ProgramInfo = atom<ProgramInfoType>({
  key: 'ProgramCreationInfo',
  default: {
    programId: 0,
    title: '',
    start_at: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0, 0, 0)),
    end_at: toCalendarDateTime(today(getLocalTimeZone()).add({ months: 1 }), new Time(23, 59, 59, 59)),
    description: '',
    managers: [],
    prize: '',
    missions: [],
  },
});

export const useProgramCreation = () => {
  const [programInfo, setProgramInfo] = useRecoilState(ProgramInfo);
  const { user } = useUser();
  const account = useAccount();
  const [isProgramAddedInDb, setIsProgramAddedInDb] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [txSend, setTxSend] = useState(false);
  const [txConfirm, setTxConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();

  const reset = () => {
    setProgramInfo({
      programId: 0,
      title: '',
      start_at: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0, 0, 0)),
      end_at: toCalendarDateTime(today(getLocalTimeZone()).add({ months: 1 }), new Time(23, 59, 59, 59)),
      description: '',
      managers: [],
      prize: '',
      missions: [],
    });
    setIsProgramAddedInDb(false);
    setTxSend(false);
    setTxConfirm(false);
    setSendLoading(false);
    setConfirmLoading(false);
  };

  const setTitle = (title: string) => {
    setProgramInfo({ ...programInfo, title });
  };
  const setPeriod = (start_at: CalendarDateTime, end_at: CalendarDateTime) => {
    setProgramInfo({ ...programInfo, start_at, end_at });
  };
  const setDescription = (description: string) => {
    setProgramInfo({ ...programInfo, description });
  };
  const addManager = (address: string, name?: string) => {
    setProgramInfo({
      ...programInfo,
      managers: [...programInfo.managers, { address: address.trim(), name: name?.trim() }],
    });
  };
  const deleteManager = (index: number) => {
    const updatedManagers = [...programInfo.managers];
    updatedManagers.splice(index, 1);
    setProgramInfo({ ...programInfo, managers: updatedManagers });
  };

  const setPrize = (prize: string) => {
    setProgramInfo({ ...programInfo, prize });
  };
  const addMission = (mission: Mission) => {
    setProgramInfo({ ...programInfo, missions: [...programInfo.missions, mission] });
  };
  const deleteMission = (index: number) => {
    const updatedMissions = [...programInfo.missions];
    updatedMissions.splice(index, 1);
    setProgramInfo({ ...programInfo, missions: updatedMissions });
  };

  const createProgram = async () => {
    if (!user) {
      return;
    }

    const startDateTime = new CalendarDateTime(
      programInfo.start_at.year,
      programInfo.start_at.month,
      programInfo.start_at.day,
      0,
      0,
      0,
      0,
    );
    const endDateTime = new CalendarDateTime(
      programInfo.end_at.year,
      programInfo.end_at.month,
      programInfo.end_at.day,
      23,
      59,
      59,
      59,
    );
    const startDateTimestamp = Math.floor(startDateTime.toDate(getLocalTimeZone()).getTime() / 1000);
    const endDateTimestamp = Math.floor(endDateTime.toDate(getLocalTimeZone()).getTime() / 1000);
    let programId = programInfo.programId;
    let hash = '0x';
    let txReceipt;

    setSendLoading(true);

    if (!isProgramAddedInDb) {
      // add program info to db
      try {
        const data = await fetchData('/programs/create', 'POST', {
          programData: {
            owner: user.walletId,
            // [Todo]: cross-chain 에서는 별도의 파라미터로 받아야함.
            chainId: opencampus.id,
            owner_address: account.address,
            managers: programInfo.managers,
            type: 'manage',
            title: programInfo.title,
            guide: programInfo.description,
            prize: Number(programInfo.prize),
            start_at: endDateTimestamp,
            end_at: endDateTimestamp,
          },
          missionData: programInfo.missions.map((mission) => ({
            ...mission,
            reserve: Number(mission.reserve),
            prize: Number(mission.prize),
            end_at: endDateTimestamp,
          })),
        });
        programId = data.programId;
        setProgramInfo({ ...programInfo, programId });
        setIsProgramAddedInDb(true);
      } catch (error) {
        setSendLoading(false);
        console.error(error);
        throw ERROR_MESSAGE.DB_UPDATE;
      }
    }

    // Send program create transaction
    try {
      hash = await writeContract(config, {
        abi: LD_ProgramFactoryABI,
        address: CONTRACT_ADDRESS.EDU_FACTORY,
        functionName: 'createProgram',
        value: parseEther(programInfo.prize.toString()),
        args: [
          BigInt(programId),
          programInfo.managers.map((manager) => manager.address.trim() as Address),
          programInfo.missions.map((mission: Mission) => ({
            auditor: mission.validators.trim() as Address,
            prize: parseEther(mission.reserve.toString()),
          })),
          BigInt(startDateTimestamp),
          BigInt(endDateTimestamp),
        ],
      });
      setTxHash(hash);
      setSendLoading(false);
      setTxSend(true);
      setConfirmLoading(true);
      txReceipt = await waitForTransactionReceipt(config, { hash: hash as Hex });
      setConfirmLoading(false);
      if (txReceipt.status !== 'success') {
        setTxConfirm(false);
        throw new Error('Transaction Fail');
      }
      setTxConfirm(true);
    } catch (error) {
      setSendLoading(false);
      if (typeof error === 'string' && error?.includes('User rejected the request')) {
        throw ERROR_MESSAGE.TRANSACTION_REJECTED;
      }
      throw ERROR_MESSAGE.TRANSACTION_FAIL;
    }

    // check deployed contract address
    try {
      const targetLog = txReceipt.logs.filter((log) => log.topics[0] === LOG_TOPIC0.PROGRAM_CREATED)[0];
      const { args } = decodeEventLog({
        abi: LD_EventLoggerABI,
        data: targetLog.data,
        topics: targetLog.topics,
      }) as { args: { programId: bigint; programAddress: string; owner: string; start: bigint; end: bigint } };

      await fetchData('/programs/deployed', 'POST', {
        programId,
        programAddress: args.programAddress,
      });
    } catch (error) {
      console.error(error);
      throw ERROR_MESSAGE.UPDATE_DEPLOYED_ADDRESS;
    }
  };

  return {
    programInfo,
    setTitle,
    setPeriod,
    setDescription,
    addManager,
    deleteManager,
    setPrize,
    addMission,
    deleteMission,
    createProgram,
    txHash,
    sendLoading,
    isProgramAddedInDb,
    txConfirm,
    txSend,
    confirmLoading,
    reset,
  };
};
