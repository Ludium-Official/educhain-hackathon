'use client';

import React from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import { useAccount, useBalance } from 'wagmi';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import OpencampusLogo from '@/assets/common/OpencampusLogo.svg';
import CommunityLogo from '@/assets/header/CommunityLogoColored.svg';
import { User, Card, CardBody, CardHeader, Divider, Input, ScrollShadow } from '@nextui-org/react';
import { useUser } from '@/hooks/store/user';
import { formatEther, keccak256 } from 'viem';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { toCalendarDate } from '@internationalized/date';

export const SetBounty = () => {
  const account = useAccount();
  const { user } = useUser();
  const balance = useBalance({ address: account.address });
  const { programInfo, setPrize } = useProgramCreation();
  const afterBalance = Number(formatEther(balance.data?.value || BigInt('0'))) - programInfo.prize;
  return (
    <ContentContainer contentHeader="Allocate Reserve">
      <div className="w-full flex gap-2 flex-col items-center justify-center">
        <Card className="w-[500px]">
          <CardHeader>
            <User
              name={
                <ScrollShadow hideScrollBar className="w-[400px]">
                  {user?.name}
                </ScrollShadow>
              }
              description={account.address}
              avatarProps={{ icon: <Jazzicon diameter={40} seed={jsNumberForAddress(account.address as string)} /> }}
              classNames={{
                name: 'whitespace-nowrap',
              }}
            />
          </CardHeader>
          <Divider className="bg-neutral-400 my-0" />
          <CardBody>
            <div className="px-1 flex justify-between items-center">
              <div className="token-info flex gap-2">
                <Image src={OpencampusLogo} alt="educoin-logo" width={24} height={24} />
                <span>EDU</span>
              </div>
              <div className="token-info flex gap-2">
                <span
                  key={afterBalance}
                  className={`animate-balanceChange ${
                    programInfo.prize === 0 ? 'text-neutral-700' : afterBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {afterBalance.toFixed(3)}
                </span>
                <span className="text-neutral-400">EDU</span>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="h-10">
          <Divider orientation="vertical" />
        </div>
        <Card className="w-[250px]">
          <CardBody className="p-0">
            <Input
              label="Reserve"
              type="number"
              value={programInfo.prize.toString() === '0' ? '' : programInfo.prize.toString()}
              onChange={(e) => {
                if (isNaN(Number(e.target.value)) || Number(e.target.value) < 0) {
                  return;
                }
                setPrize(Number(e.target.value));
              }}
              endContent={<span className="text-neutral-400 text-base">EDU</span>}
              classNames={{
                input:
                  'text-base text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                inputWrapper: 'bg-white',
              }}
            />
          </CardBody>
        </Card>
        <div className="h-10">
          <Divider orientation="vertical" />
        </div>
        <Card className="w-[500px]">
          <CardHeader>
            <User
              // className="overflow-hidden whitespace-nowrap"
              name={
                <ScrollShadow hideScrollBar className="w-[400px]">
                  {programInfo?.title || 'Unknown Program'}
                </ScrollShadow>
              }
              description={`${toCalendarDate(programInfo.start_at)} ~ ${toCalendarDate(programInfo.end_at)}`}
              avatarProps={{
                icon: (
                  <div className="flex justify-center w-full h-full items-center bg-ludiumContainer rounded-full">
                    <Image src={CommunityLogo} alt="community" width={24} height={24} />
                  </div>
                ),
              }}
              classNames={{
                name: 'whitespace-nowrap',
              }}
            />
          </CardHeader>
          <Divider className="bg-neutral-400 my-0" />
          <CardBody>
            <div className="px-1 flex justify-between items-center">
              <div className="token-info flex gap-2">
                <Image src={OpencampusLogo} alt="educoin-logo" width={24} height={24} />
                <span>EDU</span>
              </div>
              <div className="token-info flex gap-2">
                <span key={afterBalance} className="animate-balanceChange">
                  {programInfo.prize}
                </span>
                <span className="text-neutral-400">EDU</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </ContentContainer>
  );
};
