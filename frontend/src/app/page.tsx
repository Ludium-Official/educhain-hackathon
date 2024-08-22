'use client';

import ArrowLogo from '@/assets/common/ArrowLogo.svg';
import Banner from '@/assets/main/Banner.png';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { MissionStatusType } from '@/types/mission_status';
import { ProgramType } from '@/types/program';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';
import { add } from '@/functions/math';

export default function Home() {
  const { user } = useUser();
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [notOwnerMissions, setNotOwnerMissions] = useState<MissionType[]>([]);
  const [missions, setMissions] = useState<MissionStatusType[]>([]);

  const sumRestAmount = useMemo(() => {
    return notOwnerMissions.reduce((result, mission) => (result = add(result, mission.prize)), '0');
  }, [notOwnerMissions]);

  useEffect(() => {
    const callData = async () => {
      const [programs, notOwnerMissions, missions] = await Promise.all([
        fetchData('/programs', 'POST', {
          isDash: true,
        }),
        fetchData('/missions/not_owner', 'POST', {
          walletId: user?.walletId,
        }),
        fetchData('/missions', 'POST', {
          isDash: true,
          wallet_id: user?.walletId,
        }),
      ]);

      setPrograms(programs);
      setNotOwnerMissions(notOwnerMissions);
      setMissions(missions);
    };

    callData();
    animateCounter('counter', 0, Number(sumRestAmount), 1000);
  }, [sumRestAmount, user?.walletId]);

  function animateCounter(id: string, start: number, end: number, duration: number): void {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      element!.innerText = Math.floor(progress * range + start).toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element!.innerText = end.toString();
      }
    }

    window.requestAnimationFrame(step);
  }

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
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
              <div className={styles.missedContainer}>
                <Link className={styles.missionLink} href={PATH.MISSION}>
                  <div>Missed Mission</div>
                  <div className={styles.missedAmount}>
                    <div id="counter">0</div>EDU
                  </div>
                  <div>Is Waiting For You</div>
                </Link>
              </div>
            </div>
            <div className={styles.tableList}>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  Announcement List
                  <Link className={styles.link} href={PATH.PROGRAM}>
                    See all
                    <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                  </Link>
                </div>
                {programs.map((program) => (
                  <div key={program.id} className={styles.tableBody}>
                    <Link href={`${PATH.PROGRAM}/${program.id}`}>
                      <div className={styles.endTime}>
                        {program.end_at ? `D-${getConvertDeadline(program.end_at)}` : 'Deadline not set'}
                      </div>
                      <div className={styles.title}>{program.title}</div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  Mission List
                  <Link className={styles.link} href={PATH.MISSION}>
                    See all
                    <Image className={styles.seeLink} src={ArrowLogo.src} alt="logo" width={24} height={24} />
                  </Link>
                </div>
                {missions.map((mission) => (
                  <div key={mission.id} className={styles.tableBody}>
                    <Link href={`${PATH.MISSION}/${mission.id}`}>
                      <div className={styles.endTime}>
                        {mission.end_at ? `D-${getConvertDeadline(mission.end_at)}` : 'Deadline not set'}
                      </div>
                      <div className={styles.title}>{mission.title}</div>
                    </Link>
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
