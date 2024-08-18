'use client';

import React from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import { ScrollShadow } from '@nextui-org/react';
import { toCalendarDate } from '@internationalized/date';
import { useAccount } from 'wagmi';

export const Confirm = () => {
  const { programInfo } = useProgramCreation();
  const account = useAccount();

  let totalMissionPrize = 0;
  programInfo.missions.map((mission) => {
    totalMissionPrize += mission.prize;
  });
  return (
    <ContentContainer contentHeader="Confirm">
      <div className="flex justify-center items-center">
        <div className="flex flex-col rounded-2xl bg-neutral-50 p-4 gap-2 w-[600px]">
          <div className="confirmHeader">
            <div className="flex justify-center items-center text-xl text-neutral-700">
              <span>{programInfo.title}</span>
            </div>
            <div className="flex justify-end items-center text-neutral-500 text-sm">
              <span>{`${toCalendarDate(programInfo.start_at)} ~ ${toCalendarDate(programInfo.end_at)}`}</span>
            </div>
          </div>
          <div className="confirmBody">
            <div className="flex flex-col gap-2">
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
                  <span>{programInfo.prize}</span>
                  <span className="text-neutral-500">EDU</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-neutral-500 text-sm flex justify-between items-center">
                  <div>Missions</div>
                  <div className="ml-1 flex gap-2">
                    <span>Total</span>
                    <span>{totalMissionPrize}</span>
                    <span className="text-neutral-500">EDU</span>
                  </div>
                </div>
                <ScrollShadow className="max-h-40">
                  {programInfo.missions.map((mission, idx) => (
                    <div key={idx} className="ml-1 flex justify-between gap-2">
                      <div className="truncate">{mission.title}</div>
                      <div className="ml-1 flex gap-2">
                        <span>{mission.prize}</span>
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
