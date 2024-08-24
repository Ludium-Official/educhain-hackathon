'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import { ScrollShadow } from '@nextui-org/react';
import { toCalendarDate } from '@internationalized/date';
import { useAccount } from 'wagmi';
import { add } from '@/functions/math';

export const Confirm = () => {
  const { programInfo } = useProgramCreation();
  const account = useAccount();
  const [totalMissionReserve, setTotalMissionReserve] = useState<string>('0');

  useEffect(() => {
    if (programInfo.missions.length > 0) {
      let total = '0';
      programInfo.missions.map((mission) => {
        total = add(total, mission.reserve);
      });
      setTotalMissionReserve(total);
    }
  }, [programInfo.missions]);
  return (
    <ContentContainer contentHeader="Confirm">
      <div className="flex justify-center items-center">
        <div className="flex flex-col rounded-2xl bg-neutral-50 p-4 gap-2 w-[600px]">
          <div className="confirmHeader">
            <div className="flex justify-center items-center text-xl text-neutral-700">
              <span>{programInfo.title}</span>
            </div>
            <div className="flex justify-center items-center text-xl text-neutral-700">
              <span>{programInfo.type}</span>
            </div>
            <div className="flex justify-end items-center text-neutral-500 text-sm">
              <span>{`${toCalendarDate(programInfo.start_at)} ~ ${toCalendarDate(programInfo.end_at)}`}</span>
            </div>
          </div>
          <div className="confirmBody">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-neutral-500 text-sm">Owner</div>
                <div className="ml-1">{account.address}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-neutral-500 text-sm">Managers</div>
                {programInfo.managers.map((manager) => (
                  <div key={manager.address} className="ml-1">
                    {manager.address}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-neutral-500 text-sm">Program Reserve</div>
                <div className="ml-1 flex gap-2">
                  <span>{programInfo.reserve}</span>
                  <span className="text-neutral-500">EDU</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-neutral-500 text-sm flex justify-between items-center">
                  <div>Missions</div>
                  <div className="ml-1 flex gap-2">
                    <span>Total</span>
                    <span>{totalMissionReserve}</span>
                    <span className="text-neutral-500">EDU</span>
                  </div>
                </div>
                <ScrollShadow className="h-20 flex flex-col gap-1">
                  {programInfo.missions.map((mission, idx) => (
                    <div key={idx} className="ml-1 flex justify-between gap-2">
                      <div className="truncate">{mission.title}</div>
                      <div className="ml-1 flex gap-2">
                        <span>{mission.prize}</span>
                        <span className="text-neutral-400">/</span>
                        <span>{mission.reserve}</span>
                        <span className="text-neutral-500">EDU</span>
                      </div>
                    </div>
                  ))}
                </ScrollShadow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};
