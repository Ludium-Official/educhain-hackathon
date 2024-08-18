import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import fetchData from '@/libs/fetchData';

import { isNil } from 'ramda';
import { useUser } from './user';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/app/provider';
import { LD_ProgramFactoryABI } from '@/constant/LD_ProgramFactoryABI';
import { Address, Hex, parseEther } from 'viem';
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

interface Mission {
  prize: number;
  validators: string;
  owner: string;
  title: string;
  content: string;
  category: string;
  end_at: CalendarDateTime;
}

interface ProgramInfoType {
  title: string;
  start_at: CalendarDateTime;
  end_at: CalendarDateTime;
  description: string;
  managers: { address: string; name?: string }[];
  prize: number;
  missions: Mission[];
}

const ProgramInfo = atom<ProgramInfoType>({
  key: 'ProgramCreationInfo',
  default: {
    title: '',
    start_at: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0, 0, 0)),
    end_at: toCalendarDateTime(today(getLocalTimeZone()).add({ months: 1 }), new Time(23, 59, 59, 59)),
    description: '',
    managers: [],
    prize: 0,
    missions: [],
  },
});

export const useProgramCreation = () => {
  const [programInfo, setProgramInfo] = useRecoilState(ProgramInfo);
  const { user } = useUser();
  const [txSend, setTxSend] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [txConfirm, setTxConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();

  const reset = () => {
    setProgramInfo({
      title: '',
      start_at: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0, 0, 0)),
      end_at: toCalendarDateTime(today(getLocalTimeZone()).add({ months: 1 }), new Time(23, 59, 59, 59)),
      description: '',
      managers: [],
      prize: 0,
      missions: [],
    });
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

  const setPrize = (prize: number) => {
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
    console.log(programInfo.managers);
    if (!user) {
      return;
    }
    let programId = 0;
    let hash = '0x';
    try {
      const data = await fetchData('/programs/create', 'POST', {
        programData: {
          owner: user.walletId,
          type: 'manage',
          title: programInfo.title,
          guide: programInfo.description,
          prize: programInfo.prize,
          end_at: `${programInfo.end_at.year}-${programInfo.end_at.month}-${programInfo.end_at.day} ${programInfo.end_at.hour}:${programInfo.end_at.minute}:${programInfo.end_at.second}`,
        },
        missionData: programInfo.missions.map((mission) => ({
          ...mission,
          end_at: `${mission.end_at.year}-${mission.end_at.month}-${mission.end_at.day} ${mission.end_at.hour}:${mission.end_at.minute}:${mission.end_at.second}`,
        })),
      });
      programId = data.programId;
      console.log(data);
      //   route.push(PATH.PROGRAM);
    } catch (err) {
      console.error(err);
    }

    try {
      setSendLoading(true);
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
      hash = await writeContract(config, {
        abi: LD_ProgramFactoryABI,
        address: '0xD5595Cb547b4d071953d5E9f3De855D8AD5512dC',
        functionName: 'createProgram',
        value: parseEther(programInfo.prize.toString()),
        args: [
          BigInt(programId),
          programInfo.managers.map((manager) => manager.address.trim() as Address),
          programInfo.missions.map((mission: Mission) => ({
            auditor: mission.validators.trim() as Address,
            prize: parseEther(mission.prize.toString()),
          })),
          BigInt(Math.floor(startDateTime.toDate(getLocalTimeZone()).getTime() / 1000)),
          BigInt(Math.floor(endDateTime.toDate(getLocalTimeZone()).getTime() / 1000)),
        ],
      });
      setTxHash(hash);
      setSendLoading(false);
      setTxSend(true);
      setConfirmLoading(true);
      const receipt = await waitForTransactionReceipt(config, { hash: hash as Hex });
      setConfirmLoading(false);
      if (receipt.status === 'success') {
        setTxConfirm(true);
      } else {
        setTxConfirm(false);
      }
    } catch (err) {
      setSendLoading(false);
      console.error(err);
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
    txSend,
    sendLoading,
    txConfirm,
    confirmLoading,
    reset,
  };
};
