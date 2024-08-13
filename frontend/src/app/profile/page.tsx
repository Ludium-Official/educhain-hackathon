'use client';

import ArrowLogo from '@/assets/common/ArrowLogo.svg';
import PhoneLogo from '@/assets/profile/PhoneLogo.svg';
import ProfileLogo from '@/assets/profile/ProfileLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { UserType } from '@/types/user';
import { UserSubmissionStatusMissionsType } from '@/types/user_submission_status_missions';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { sha256ToHex } from '../../libs/cryptoEncode';
import styles from './page.module.scss';

export default function Profile() {
  const account = useAccount();

  const { user, setUser } = useUser();
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [validateMissions, setValidateMissions] = useState<MissionType[]>([]);
  const [ownerMissions, setOwnerMissions] = useState<MissionType[]>([]);
  const [statusMissions, setStatusMissions] = useState<UserSubmissionStatusMissionsType[]>([]);

  const signIn = useCallback(async () => {
    const addressKey = sha256ToHex(`${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`);

    await fetchData('/user/signIn', 'POST', {
      addressKey,
    });

    const response = (await fetchData('/user', 'POST', {
      addressKey,
    })) as UserType[];

    if (response.length > 0) {
      setUser(response[0]);
      return;
    }

    setUser(null);
  }, [account.address, setUser]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse, validateMissions, ownerMissions, statusMissions] = await Promise.all([
          fetchData('/programs', 'POST', {
            walletId: user?.walletId,
          }),
          fetchData('/missions/validators', 'POST', {
            walletId: user?.walletId,
          }),
          fetchData('/missions/owner', 'POST', {
            walletId: user?.walletId,
          }),
          fetchData('/user_submission_status/missions', 'POST', {
            walletId: user?.walletId,
          }),
        ]);

        setPrograms(missionResponse);
        setValidateMissions(validateMissions);
        setOwnerMissions(ownerMissions);
        setStatusMissions(statusMissions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [user?.walletId]);

  return (
    <Wrapper>
      {{
        header: <BackLink path={PATH.HOME} />,
        body: (
          <>
            {account.address && (
              <div className={styles.container}>
                {user ? (
                  <>
                    <div className={styles.profileWrapper}>
                      <div className={styles.profileInfo}>
                        <div className={styles.profileImgInfo}>
                          <Image
                            className={styles.profileImg}
                            src={ProfileLogo.src}
                            alt="logo"
                            width={60}
                            height={60}
                          />
                          <div className={styles.hi}>
                            Hello,<span>{user?.name}</span> 👋
                          </div>
                        </div>
                        <div className={styles.infoWrapper}>
                          <div className={styles.intro}>{user?.introduce}</div>
                          <div className={styles.number}>
                            <Image className={styles.phoneImg} src={PhoneLogo.src} alt="logo" width={24} height={24} />
                            {user?.number}
                          </div>
                        </div>
                      </div>
                      <Link className={styles.editBtn} href={`${PATH.PROFILE}/edit`}>
                        Edit Profile
                      </Link>
                    </div>
                    <div className={styles.userStatusContainer}>
                      <div className={styles.userStatusWrapper}>
                        <div className={styles.title}>
                          Owned programs
                          <Link className={styles.link} href={`${PATH.PROFILE}/program`}>
                            Manage
                            <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                          </Link>
                        </div>
                        <div className={styles.rows}>
                          {programs.map((program) => {
                            return (
                              <div key={program.id} className={styles.row}>
                                <Link href={`${PATH.PROGRAM}/${program.id}`} className={styles.rowTitle}>
                                  {program.title}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={styles.userStatusWrapper}>
                        <div className={styles.title}>Missions in validate</div>
                        <div className={styles.rows}>
                          {validateMissions.map((mission) => {
                            return (
                              <div key={mission.id} className={styles.row}>
                                <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.rowTitle}>
                                  {mission.title}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={styles.userStatusWrapper}>
                        <div className={styles.title}>Owned Missions</div>
                        <div className={styles.rows}>
                          {ownerMissions.map((mission) => {
                            return (
                              <div key={mission.id} className={styles.row}>
                                <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.rowTitle}>
                                  {mission.title}
                                </Link>
                                <div>{mission.is_confirm ? 'YES' : 'NO'}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={styles.userStatusWrapper}>
                        <div className={styles.title}>Participate Missions</div>
                        <div className={styles.rows}>
                          {statusMissions.map((mission) => {
                            return (
                              <div key={mission.id} className={styles.row}>
                                <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.rowTitle}>
                                  {mission.title}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <button className={styles.addBtn} onClick={signIn}>
                    Sign Up
                  </button>
                )}
              </div>
            )}
          </>
        ),
      }}
    </Wrapper>
  );
}
