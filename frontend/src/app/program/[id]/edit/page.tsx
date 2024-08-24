'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { getLocalTimeZone, today } from '@internationalized/date';
import { FormControlLabel, Radio, RadioGroup, Tab, Tabs } from '@mui/material';
import { DatePicker } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation';
import { isEmpty } from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { PieChart } from '@mui/x-charts';

export default function ProgramEdit() {
  const route = useRouter();
  const param = useParams();

  const { user } = useUser();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<MissionType[]>([]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value, setValue] = useState('1');

  // for edit program
  const [programTitle, setProgramTitle] = useState('');

  // for create mission
  const [missionTitle, setMissionTitle] = useState('');
  const [missionContent, setMissionContent] = useState('');
  const [missionCategory, setMissionCategory] = useState(''); // announcement, study
  const [missionPrize, setMissionPrize] = useState('');
  const [missionReserve, setMissionReserve] = useState('');
  const [missionEndTime, setMissionEndTime] = useState<string | null>(null);

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

  const addMission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEmpty(missionTitle)) {
      alert('Fill in title');
      return;
    } else if (isEmpty(missionCategory)) {
      alert('Fill in category');
      return;
    } else if (isEmpty(missionPrize)) {
      alert('Fill in prize');
      return;
    } else if (Number(missionPrize) > reservePrize) {
      alert('Check rest prize');
      return;
    } else if (Number(missionReserve) > Number(missionPrize)) {
      alert('Check mission prize');
      return;
    }

    try {
      if (user && program) {
        await fetchData('/missions/add', 'POST', {
          missionData: {
            validators: program.owner,
            owner: user.walletId,
            program_id: program.id,
            category: missionCategory,
            title: missionTitle,
            content: missionContent,
            prize: missionPrize,
            reserve: missionReserve,
            end_at: missionEndTime,
          },
        });

        alert('Success to make mission!');
        route.push(`${PATH.PROGRAM}/${program.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reservePrize = useMemo(() => {
    const allocatePrize = missions.reduce((result, mission) => (result += Number(mission.prize)), 0);

    return Number(program?.reserve) - allocatePrize;
  }, [missions, program?.reserve]);

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.PROGRAM}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {program && user ? (
              <>
                <div className={styles.title}>Program Manage</div>
                <TabContext value={value}>
                  <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                    <Tab value="1" label="Dashboard" />
                    <Tab value="2" label="Program Detail" />
                    <Tab value="3" label="Missions" />
                  </Tabs>

                  <TabPanel value="1">
                    <PieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: 10, label: 'series A' },
                            { id: 1, value: 15, label: 'series B' },
                            { id: 2, value: 20, label: 'series C' },
                          ],
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </TabPanel>
                  <TabPanel value="2">
                    <div className={styles.tableWrapper}>
                      {user.walletId === program?.owner && (
                        <div className={styles.table}>
                          <div className={styles.tableTitle}>Program</div>
                          <div className={styles.rowsTable}>
                            <div className={styles.inputWrapper}>
                              Title
                              <input
                                className={styles.input}
                                value={program.title}
                                onChange={(e) => setProgramTitle(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabPanel>
                  <TabPanel value="3">
                    {' '}
                    <div className={styles.tableWrapper}>
                      {user.walletId === program?.owner && (
                        <>
                          <div className={styles.table}>
                            <div className={styles.tableTitle}>Missions</div>
                            {missions.map((mission) => {
                              const validators = mission.validators.split(',');

                              return (
                                <div key={mission.id} className={styles.rowsTable}>
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
                        </>
                      )}
                    </div>
                  </TabPanel>
                </TabContext>
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
