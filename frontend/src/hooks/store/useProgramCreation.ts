import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import fetchData from '@/libs/fetchData';

import { isNil } from 'ramda';
import { useUser } from './user';
import { writeContract } from 'wagmi/actions';
import { config } from '@/app/provider';
import { LD_ProgramFactoryABI } from '@/constant/LD_ProgramFactoryABI';
import { Address, parseEther } from 'viem';
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
    setProgramInfo({ ...programInfo, managers: [...programInfo.managers, { address, name }] });
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
    if (!user) {
      return;
    }

    try {
      await fetchData('/programs/create', 'POST', {
        programData: {
          owner: user.walletId,
          type: 'manage',
          title: programInfo.title,
          guide: programInfo.description,
          prize: programInfo.prize,
          end_at: programInfo.end_at,
        },
        missionData: programInfo.missions,
      });

      //   route.push(PATH.PROGRAM);
    } catch (err) {
      console.error(err);
    }

    try {
      const hash = await writeContract(config, {
        abi: LD_ProgramFactoryABI,
        address: '0xD5595Cb547b4d071953d5E9f3De855D8AD5512dC',
        functionName: 'createProgram',
        value: parseEther(programInfo.prize.toString()),
        args: [
          BigInt(1),
          programInfo.managers.map((manager) => manager.address) as Address[],
          programInfo.missions.map((mission: Mission) => ({
            auditor: mission.validators as Address,
            prize: BigInt(mission.prize),
          })),
          BigInt(1000),
          BigInt(1000),
        ],
      });
    } catch (err) {
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
  };
};
