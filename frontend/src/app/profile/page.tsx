'use client';

import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import ArrowLogo from '@/assets/common/ArrowLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import PhoneLogo from '@/assets/profile/PhoneLogo.svg';
import ProfileLogo from '@/assets/profile/ProfileLogo.svg';
import BackLink from '@/components/BackLink';
import ParticipateMissionList from '@/components/ParticipateMissionList';
import ValidateMissionList from '@/components/ValidateList';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { DBSignature } from '@/types/entities/signature';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { UserType } from '@/types/user';
import { UserSubmissionStatusMissionsType } from '@/types/user_submission_status_missions';
import { Tab, Tabs } from '@mui/material';
import dayjs from 'dayjs';
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
  const [value, setValue] = useState('one');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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

  const participateCallData = useCallback(async () => {
    const [statusMissions, recipientList] = await Promise.all([
      fetchData('/user_submission_status/missions', 'POST', {
        walletId: user?.walletId,
      }),
      fetchData(`/signature/recipient/${account.address}`),
    ]);

    const combinedArray = statusMissions.map((mission: UserSubmissionStatusMissionsType) => {
      const signature = recipientList.find(
        (sig: DBSignature) => sig.mission_id === mission.mission_id && sig.program_id === mission.program_id,
      );

      if (signature) {
        return { ...mission, signature: { id: signature.id, sig: signature.sig, is_claimed: signature.is_claimed } };
      } else {
        return mission;
      }
    });

    setStatusMissions(combinedArray);
  }, [account.address, user?.walletId]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse, validateMissions, ownerMissions] = await Promise.all([
          fetchData('/programs', 'POST', {
            walletId: user?.walletId,
          }),
          fetchData('/missions/validators', 'POST', {
            walletId: user?.walletId,
          }),
          fetchData('/missions/owner', 'POST', {
            walletId: user?.walletId,
          }),
        ]);

        setPrograms(missionResponse);
        setValidateMissions(validateMissions);
        setOwnerMissions(ownerMissions);
        participateCallData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [account.address, participateCallData, user?.walletId]);

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
                        {user.number && user.introduce && (
                          <div className={styles.infoWrapper}>
                            {user.introduce && <div className={styles.intro}>{user.introduce}</div>}
                            {user.number && (
                              <div className={styles.number}>
                                <Image
                                  className={styles.phoneImg}
                                  src={PhoneLogo.src}
                                  alt="logo"
                                  width={24}
                                  height={24}
                                />
                                {user.number}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Link className={styles.editBtn} href={`${PATH.PROFILE}/edit`}>
                        Edit Profile
                      </Link>
                    </div>
                    <div className={styles.handleWrapper}>
                      <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                        <Tab value="one" label="Owned programs" />
                        <Tab value="two" label="Owned Missions" />
                        <Tab value="three" label="Missions in validate" />
                        <Tab value="four" label="Participate Missions" />
                      </Tabs>
                      {value === 'one' && (
                        <>
                          <div className={styles.title}>
                            <Link className={styles.link} href={`${PATH.PROFILE}/program`}>
                              Program Dashboard
                              <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                            </Link>
                          </div>
                          <div className={styles.rows}>
                            {programs.map((program) => {
                              const formatDate = dayjs(program.end_at).format('YYYY.MM.DD');

                              return (
                                <div key={program.id} className={styles.row}>
                                  <div className={styles.rowTitle}>
                                    <Link href={`${PATH.PROGRAM}/${program.id}/edit`} className={styles.link}>
                                      <span className={styles.programType}>{program.type}</span>
                                      <span className={styles.contentTitle}>{program.title}</span>
                                    </Link>
                                    <div className={styles.prize}>Reserve: {program.reserve} EDU</div>
                                  </div>
                                  <div className={styles.deadline}>Deadline: {program.end_at ? formatDate : '-'}</div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {value === 'two' && (
                        <>
                          {/* <div className={styles.title}>
                            <Link className={styles.link} href={`${PATH.PROFILE}/mission`}>
                              View all
                              <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                            </Link>
                          </div> */}
                          <div className={styles.rows}>
                            {ownerMissions.map((mission) => {
                              const formatDate = dayjs(mission.end_at).format('YYYY.MM.DD');
                              return (
                                <div key={mission.id} className={styles.row}>
                                  <div className={styles.rowTitle}>
                                    <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.link}>
                                      <span>
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
                                      </span>
                                      <span className={styles.contentTitle}>{mission.title}</span>
                                    </Link>
                                    <div className={styles.prize}>Prize: {mission.prize} EDU</div>
                                  </div>
                                  <div className={styles.deadline}>Deadline: {mission.end_at ? formatDate : '-'}</div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {value === 'three' && (
                        <div className={styles.rows}>
                          {validateMissions.map((mission) => (
                            <ValidateMissionList key={mission.id} mission={mission} />
                          ))}
                        </div>
                      )}
                      {value === 'four' && (
                        <div className={styles.rows}>
                          {statusMissions.map((mission) => (
                            <ParticipateMissionList
                              key={mission.id}
                              mission={mission}
                              participateCallData={participateCallData}
                            />
                          ))}
                        </div>
                      )}
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
