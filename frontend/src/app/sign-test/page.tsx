'use client';

import AddLogo from '@/assets/common/AddLogo.svg';
import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import fetchData from '@/libs/fetchData';
import { ProgramType } from '@/types/program';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { isEmpty, prop, sortBy } from 'ramda';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useValidator } from '@/hooks/store/useValidator';
import { Signature } from '@/types/signature';
import { useAccount } from 'wagmi';
import { useClaim } from '@/hooks/store/useClaim';

export default function SignTest() {
  const [programId, setProgramId] = useState<number>(0);
  const [missionNumber, setMissionNumber] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>('');
  const [prize, setPrize] = useState<string>('');
  const account = useAccount();

  const [requested, setRequested] = useState<Signature[]>([]);
  const [approved, setApproved] = useState<Signature[]>([]);

  const { signForClaim, requestToValidator } = useValidator();
  const { claim } = useClaim();

  const fetchApprovedList = async () => {
    const req = await fetchData(`/signature/validator/${account.address}`);
    const appr = await fetchData(`/signature/recipient/${account.address}`);
    setRequested(req);
    setApproved(appr);
  };

  const claimPrize = async (idx: number) => {
    const { program_id, mission_id } = approved[idx];
    await claim({ programId: program_id, missionNumber: mission_id });
  };

  return (
    <Wrapper>
      {{
        header: (
          <div className={styles.headerWrapper}>
            <BackLink path={PATH.HOME} />
          </div>
        ),
        body: (
          <div className={`wrapperBody w-full flex flex-col justify-between gap-4`}>
            <div className="flex justify-end items-center gap-4">
              <button className="bg-black px-4 py-2 w-full h-10" onClick={fetchApprovedList}>
                Fetch
              </button>
            </div>
            <div className="bg-white border-solid border-gray-500 border rounded-2xl flex flex-col gap-4 p-8">
              <div className="flex gap-4 text-sm">
                <div className="flex gap-2">
                  <span>Program ID</span>
                  <input
                    className="w-20 border border-solid border-neutral-700 text-neutral-700"
                    value={programId}
                    onChange={(e) => {
                      setProgramId(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <span>Mission Number</span>
                  <input
                    className="w-20 border border-solid border-neutral-700 text-neutral-700"
                    value={missionNumber}
                    onChange={(e) => {
                      setMissionNumber(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <span>Recipient</span>
                  <input
                    className="w-60 border border-solid border-neutral-700 text-neutral-700"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <span>Prize</span>
                  <input
                    className="w-20 border border-solid border-neutral-700 text-neutral-700"
                    value={prize}
                    onChange={(e) => {
                      setPrize(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end items-center gap-4">
                <button
                  className="bg-black px-4 py-2 text-sm"
                  onClick={async () => {
                    await requestToValidator({ programId, missionNumber, prize, recipient });
                  }}
                >
                  Request Sign
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col justify-between items-center">
                <div className="mb-2 px-2 ">
                  <span className="text-xl text-neutral-600 font-semibold">Sign Test</span>
                </div>
                <div className="bg-white border-solid border-gray-500 border w-[450px] h-[350px] rounded-2xl flex flex-col gap-2 p-8">
                  {requested.map((sigInfo, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>{`${sigInfo.program_id}_${sigInfo.mission_id}_${sigInfo.prize}_EDU`}</div>
                      <div>
                        <button
                          onClick={() => {
                            signForClaim({
                              programId: sigInfo.program_id,
                              missionNumber: sigInfo.mission_id,
                              recipient: sigInfo.recipient,
                              prize: sigInfo.prize,
                            });
                          }}
                          className="bg-black px-4 py-2"
                        >
                          Sign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between items-center">
                <div className="flex mb-2 px-2 justify-between items-center">
                  <span className="text-xl text-neutral-600 font-semibold">Claim Test</span>
                </div>
                <div className="bg-white border-solid border-gray-500 border w-[450px] h-[350px] rounded-2xl flex flex-col p-8">
                  {approved.map((sigInfo, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>{`${sigInfo.program_id}_${sigInfo.mission_id}_${sigInfo.prize}_EDU`}</div>
                      <div>
                        <button onClick={() => claimPrize(idx)} className="bg-black px-4 py-2">
                          Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
