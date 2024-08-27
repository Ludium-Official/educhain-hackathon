'use client';

import { config } from '@/app/provider';
import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { LD_EduProgramABI } from '@/constant/LD_EduProgramABI';
import { LD_EventLoggerABI } from '@/constant/LD_EventLogger';
import { PATH } from '@/constant/route';
import { LOG_TOPIC0 } from '@/constant/topic0';
import { getConvertDeadline } from '@/functions/deadline-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { ProgramType } from '@/types/program';
import { UserCountType } from '@/types/user_count';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Address, Hex } from 'viem';
import { decodeEventLog, formatEther, parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import styles from './page.module.scss';

export default function ProgramManage() {
  const { user } = useUser();

  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [userCount, setUserCount] = useState<UserCountType>();
  const { writeContractAsync } = useWriteContract();

  const callProgramsWithMissions = useCallback(async () => {
    try {
      const [programResponse, userCount] = await Promise.all([
        fetchData('/programs', 'POST', {
          walletId: user?.walletId,
          isConfirm: true,
        }),
        fetchData('/user_submission_status/count', 'POST', {
          walletId: user?.walletId,
        }),
      ]);

      setPrograms(programResponse);
      setUserCount(userCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user?.walletId]);

  useEffect(() => {
    callProgramsWithMissions();
  }, [callProgramsWithMissions]);

  const SubmitComment = useCallback(
    async (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      const dataValue = event.currentTarget.getAttribute('data-value');
      const parsedValue = dataValue ? JSON.parse(dataValue) : null;

      const hash = await writeContractAsync({
        address: parsedValue.programAddress as Address,
        abi: LD_EduProgramABI,
        functionName: 'addMission',
        args: [parsedValue.ownerAddress as Address, parseEther(parsedValue.missionReserve)],
      });

      const txReceipt = await waitForTransactionReceipt(config, { hash: hash as Hex });
      const reserve = await readContract(config, {
        address: parsedValue.programAddress as Address,
        abi: LD_EduProgramABI,
        functionName: 'reserve',
      });

      const targetLog = txReceipt.logs.filter((log) => log.topics[0] === LOG_TOPIC0.MISSION_ADDED)[0];
      const { args } = decodeEventLog({
        abi: LD_EventLoggerABI,
        data: targetLog.data,
        topics: targetLog.topics,
      }) as { args: { programId: bigint; newMissionNumber: bigint; prize: bigint } };

      if (parsedValue) {
        await fetchData('/missions/patchActive', 'POST', {
          id: parsedValue.id,
          program_id: parsedValue.programId,
          mission_id: Number(args.newMissionNumber),
          programReserve: formatEther(reserve),
        });

        alert(`Now active mission id ${parsedValue.id}`);
        callProgramsWithMissions();
      }
    },
    [callProgramsWithMissions],
  );

  const totalPrizeAmount = useMemo(() => {
    return programs.reduce((result, program) => (result += Number(program.reserve)), 0);
  }, [programs]);

  const activeProgramCount = useMemo(() => {
    return programs.reduce((result, program) => {
      if (!program.end_at) {
        return (result += 0);
      } else if (getConvertDeadline(program.end_at) >= 0) {
        return (result += 1);
      }

      return (result += 0);
    }, 0);
  }, [programs]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.PROFILE} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Program Dashboard</div>
            <div className={styles.introCard}>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Prize</div>
                <div className={styles.cardContent}>0 EDU / {totalPrizeAmount} EDU</div>
              </div>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Used users</div>
                <div className={styles.cardContent}>{userCount?.user_count || 0}</div>
              </div>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Active programs</div>
                <div className={styles.cardContent}>{activeProgramCount}</div>
              </div>
            </div>

            <div className={styles.content}>
              {programs.map((program) => {
                const formatDate = dayjs(program.end_at).format('YYYY.MM.DD');

                return (
                  <div key={program.id} className={styles.row}>
                    <div className={styles.programTitleWrapper}>
                      <Link className={styles.programTitle} href={`${PATH.PROGRAM}/${program.id}/edit`}>
                        {program.title}
                      </Link>
                      <span>Deadline: {program.end_at ? formatDate : '-'}</span>
                    </div>
                    {program.missions?.map((mission) => {
                      return (
                        <div key={mission.id} className={styles.line}>
                          <div className={styles.leftSide}>
                            {mission.category === 'study' ? (
                              <Image
                                className={styles.categoryLogo}
                                src={StudyLogo.src}
                                alt="logo"
                                width={24}
                                height={24}
                              />
                            ) : (
                              <Image
                                className={styles.categoryLogo}
                                src={AnnouncementLogo.src}
                                alt="logo"
                                width={24}
                                height={24}
                              />
                            )}
                            <div className={styles.prize}>{mission.prize} EDU</div>
                            <Link href={`${PATH.MISSION}/${mission.id}/edit`}>{mission.title}</Link>
                          </div>
                          {!mission.is_confirm && (
                            <button
                              className={styles.confirmBtn}
                              data-value={JSON.stringify({
                                id: mission.id,
                                programId: mission.program_id,
                                ownerAddress: program.owner_address,
                                programAddress: program.program_address,
                                missionReserve: mission.reserve,
                              })}
                              onClick={SubmitComment}
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
