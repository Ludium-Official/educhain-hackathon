'use client';

import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionStatusType } from '@/types/mission_status';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function Mission() {
  const { user } = useUser();

  const [missions, setMissions] = useState<MissionStatusType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const response = await fetchData('/missions', 'POST', {
        isDash: false,
        wallet_id: user?.walletId,
      });

      setMissions(response);
    };

    callData();
  }, [user?.walletId]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.HOME} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Mission</div>
            <div className={styles.table}>
              {missions.map((mission) => {
                const progress = () => {
                  if (mission.is_progress === 'done') {
                    return 'DONE';
                  } else if (mission.is_progress === 'going') {
                    return 'ING';
                  }

                  return '';
                };
                return (
                  <div key={mission.id} className={styles.row}>
                    <div className={styles.leftSide}>
                      {mission.category === 'study' ? (
                        <Image className={styles.categoryLogo} src={StudyLogo.src} alt="logo" width={24} height={24} />
                      ) : (
                        <Image
                          className={styles.categoryLogo}
                          src={AnnouncementLogo.src}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                      )}
                      <div className={styles.leftTitle}>
                        <Link className={styles.missionLink} href={`${PATH.MISSION}/${mission.id}`}>
                          <div className={styles.prize}>{mission.prize} EDU</div>
                          {mission.title}
                        </Link>
                        <div className={styles.ownedMission}>Owned by {mission.owner_name || '-'}</div>
                      </div>
                    </div>
                    <div>{mission.category === 'study' && progress()}</div>
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
