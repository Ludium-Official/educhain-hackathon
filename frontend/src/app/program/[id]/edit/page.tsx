'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { TabContext, TabPanel } from '@mui/lab';
import { Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material';
import { LineChart, PieChart } from '@mui/x-charts';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import dayjs from 'dayjs';

export default function ProgramEdit() {
  const param = useParams();

  const { user } = useUser();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<MissionType[]>([]);
  const [programTitle, setProgramTitle] = useState('');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value, setValue] = useState('1');

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

  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  const dataset = dates.map((date) => {
    return { date: date, m1: Math.random(), m2: Math.random() };
  });

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
                    <div className="flex flex-wrap space-x-4">
                      <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                          <div className={styles.tableTitle}>Bounty</div>
                          <PieChart
                            series={[
                              {
                                data: [
                                  { id: 0, value: 200, label: 'Remain' },
                                  { id: 1, value: 10, label: 'Distributed' },
                                ],
                              },
                            ]}
                            width={350}
                            height={200}
                          />
                        </div>
                      </div>
                      <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                          <div className={styles.tableTitle}>Program Activity</div>
                          <LineChart
                            xAxis={[
                              {
                                scaleType: 'time',
                                data: dates,
                                valueFormatter: (value) => dayjs(value).format('YYYY.MM.DD'),
                              },
                            ]}
                            series={[
                              {
                                data: [2, 4, 6, 1, 3, 6, 2],
                                area: true,
                              },
                            ]}
                            width={350}
                            height={200}
                          />
                        </div>
                      </div>
                      <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                          <div className={styles.tableTitle}>Mission Activity</div>
                          <LineChart
                            dataset={dataset}
                            xAxis={[
                              {
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (value) => dayjs(value).format('YYYY.MM.DD'),
                              },
                            ]}
                            series={[
                              {
                                id: 'France',
                                label: 'Mission1',
                                dataKey: 'm1',
                                stack: 'total',
                                area: true,
                                showMark: false,
                              },
                              {
                                id: 'United Kingdom',
                                label: 'Mission2',
                                dataKey: 'm2',
                                stack: 'total',
                                area: true,
                                showMark: false,
                              },
                            ]}
                            width={350}
                            height={200}
                          />
                        </div>
                      </div>
                      <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                          <div className={styles.tableTitle}>Recent Activities</div>
                          <div>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Bounty</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>{dates[0].toDateString()}</TableCell>
                                    <TableCell>Fiddlestick</TableCell>
                                    <TableCell>+10 EDU</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>{dates[0].toDateString()}</TableCell>
                                    <TableCell>Zed</TableCell>
                                    <TableCell>+10 EDU</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>{dates[0].toDateString()}</TableCell>
                                    <TableCell>Yasuo</TableCell>
                                    <TableCell>+10 EDU</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>{dates[0].toDateString()}</TableCell>
                                    <TableCell>Yone</TableCell>
                                    <TableCell>+10 EDU</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>
                        </div>
                      </div>
                    </div>
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
              <div></div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
