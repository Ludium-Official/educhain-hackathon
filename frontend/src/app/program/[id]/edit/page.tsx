'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function ProgramEdit() {
  const param = useParams();

  const { user } = useUser();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<MissionType[]>([]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [programResponse, missionResponse] = await Promise.all([
          fetchData(`/programs/${param.id}`),
          fetchData(`/missions/program/${param.id}`),
        ]);

        setProgram(programResponse as ProgramType);
        setMissions(missionResponse as MissionType[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.PROGRAM}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {program && user && user.walletId === program?.owner ? (
              <>
                <div className={styles.title}>Program Edit</div>
                <div className={styles.tableWrapper}>
                  <div className={styles.table}>
                    {missions.map((mission) => {
                      const validators = mission.validators.split(',');

                      return (
                        <div key={mission.id} className={styles.missionTable}>
                          <div className={styles.inputWrapper}>
                            Title
                            <input
                              className={styles.input}
                              value={mission.title}
                              onChange={(e) => console.log(e.target.value)}
                            />
                          </div>
                          {validators.map((validator) => {
                            return (
                              <div key={validator} className={styles.inputWrapper}>
                                Validators
                                <input
                                  className={styles.input}
                                  value={validator}
                                  onChange={(e) => console.log(e.target.value)}
                                />
                              </div>
                            );
                          })}
                          <div className={styles.inputWrapper}>
                            Owner
                            <input
                              className={styles.input}
                              value={mission.owner || ''}
                              onChange={(e) => console.log(e.target.value)}
                            />
                            {mission.owner_name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div>null</div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
