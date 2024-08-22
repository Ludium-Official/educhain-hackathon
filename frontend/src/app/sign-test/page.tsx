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

  const [approved, setApproved] = useState<Signature[]>([]);

  const { signForClaim } = useValidator();
  const { claim } = useClaim();

  const fetchApprovedList = async () => {
    const list = await fetchData(`/signature/recipient/${account.address}`);
    setApproved(list);
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
          <div className={`wrapperBody w-full flex gap-4`}>
            <div>
              <div className="w-[400px] mb-2 px-2 flex justify-between items-center">
                <span className="text-xl text-neutral-600 font-semibold">Sign Test</span>
              </div>
              <div className="bg-white border-solid border-gray-500 border h-[650px] rounded-2xl flex flex-col gap-4 p-8">
                <div className="flex gap-2 flex-col">
                  <span>Program ID</span>
                  <input
                    className="border border-solid border-neutral-700 text-neutral-700"
                    value={programId}
                    onChange={(e) => {
                      setProgramId(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <span>Mission Number (not a mission id)</span>
                  <input
                    className="border border-solid border-neutral-700 text-neutral-700"
                    value={missionNumber}
                    onChange={(e) => {
                      setMissionNumber(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <span>Recipient</span>
                  <input
                    className="border border-solid border-neutral-700 text-neutral-700"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                    }}
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <span>Prize</span>
                  <input
                    className="border border-solid border-neutral-700 text-neutral-700"
                    value={prize}
                    onChange={(e) => {
                      setPrize(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    className="bg-black px-4 py-2"
                    onClick={() => signForClaim({ programId, missionNumber, recipient, prize })}
                  >
                    Sign!
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="w-[400px] mb-2 px-2 flex justify-between items-center">
                <span className="text-xl text-neutral-600 font-semibold">Claim Test</span>
                <button className="bg-black px-4 py-2" onClick={fetchApprovedList}>
                  Fetch
                </button>
              </div>
              <div className="bg-white border-solid border-gray-500 border h-[650px] rounded-2xl flex flex-col p-8">
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
        ),
      }}
    </Wrapper>
  );
}
