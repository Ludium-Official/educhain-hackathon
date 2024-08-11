'use client';

import ArrowLogo from '@/assets/common/ArrowLogo.svg';
import Banner from '@/assets/main/Banner.png';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

export default function Home() {
  const { user } = useUser();
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [notOwnerMissions, setNotOwnerMissions] = useState<MissionType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const [programs, notOwnerMissions] = await Promise.all([
        fetchData('/programs', 'POST', {
          isDash: true,
        }),
        fetchData('/missions/not_owner', 'POST', {
          walletId: user?.walletId,
        }),
      ]);

      setPrograms(programs);
      setNotOwnerMissions(notOwnerMissions);
    };

    callData();
  }, [user?.walletId]);

  const sumRestAmount = useMemo(() => {
    return notOwnerMissions.reduce((result, mission) => (result += mission.prize), 0);
  }, [notOwnerMissions]);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
              <div className={`carousel-indicators ${styles.carouselButtons}`}>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <Image className="d-block w-100" src={Banner.src} alt="logo" width={1033} height={256} />
                </div>
                <div className="carousel-item">
                  <Image className="d-block w-100" src={Banner.src} alt="logo" width={1033} height={256} />
                </div>
                <div className="carousel-item">
                  <Image className="d-block w-100" src={Banner.src} alt="logo" width={1033} height={256} />
                </div>
              </div>
            </div>
            <div className={styles.missMissionContainer}>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  Missed mission!
                  <Link className={styles.link} href={PATH.MISSION}>
                    모두 보기
                    <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                  </Link>
                </div>
                <div>{sumRestAmount} 놓치는 중</div>
              </div>
            </div>
            <div className={styles.tableList}>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  공고 목록
                  <Link className={styles.link} href={PATH.PROGRAM}>
                    모두 보기
                    <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                  </Link>
                </div>
                {programs.map((program) => (
                  <div key={program.id} className={styles.tableBody}>
                    <Link href={`${PATH.PROGRAM}/${program.id}`}>
                      <div className={styles.endTime}>
                        {program.end_at
                          ? `${getConvertDeadline(program.end_at)} days before deadline`
                          : 'Deadline not set'}
                      </div>
                      <div className={styles.title}>{program.title}</div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  학습 목록
                  <Link className={styles.link} href={PATH.HOME}>
                    모두 보기
                    <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                  </Link>
                </div>
                <div className={styles.tableBody}>list</div>
              </div>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
