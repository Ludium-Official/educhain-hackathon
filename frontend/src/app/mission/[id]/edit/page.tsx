'use client';

import BackLink from '@/components/BackLink';
import CreateSubmissionFlow from '@/components/CreateSubmissionFlow';
import SubmissionUsers from '@/components/SubmissionUsers';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { TabContext, TabPanel } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { includes, split } from 'ramda';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function MissionEdit() {
  const param = useParams();

  const { user } = useUser();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value, setValue] = useState('1');
  const [mission, setMission] = useState<MissionType>();

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse] = await Promise.all([fetchData(`/missions/${param.id}`)]);

        setMission(missionResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  const validatorList = split(',', mission?.validators || '');
  const validatorAddrList = split(',', mission?.validator_address || '');

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.MISSION}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {user?.walletId === mission?.owner || includes(user?.walletId, validatorList) ? (
              <>
                <div className={styles.title}>Mission Manage</div>
                <TabContext value={value}>
                  <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                    <Tab value="1" label="Dashboard" />
                    <Tab value="2" label="Mission Detail" />
                    <Tab value="3" label="Submissions" />
                  </Tabs>
                  <TabPanel value="1">
                    <div className={styles.chartWrapper}>
                      <div className={styles.cardWrapper}>
                        <div className={styles.title}>Daily activity</div>
                        <LineChart
                          width={660}
                          height={310}
                          series={[{ data: [10, 4, 15, 12, 10, 9, 17], label: 'activity', color: '#861cc4' }]}
                          xAxis={[
                            {
                              scaleType: 'point',
                              data: [
                                '2024-08-22',
                                'P2024-08-23',
                                '2024-08-24',
                                '2024-08-25',
                                '2024-08-26',
                                '2024-08-27',
                                '2024-08-28',
                              ],
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.cardWrapper}>
                        <div className={styles.title}>Progress status</div>
                        <PieChart
                          colors={['#861cc4', '#9d66bc']}
                          series={[
                            {
                              outerRadius: 120,
                              data: [
                                { id: 0, value: 45, label: 'Done' },
                                { id: 1, value: 70, label: 'Ing' },
                              ],
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                          ]}
                          {...{
                            margin: { right: 5 },
                            legend: { hidden: true },
                          }}
                          height={310}
                        />
                      </div>
                    </div>
                    <div className={clsx(styles.cardWrapper, styles.validatorList)}>
                      <div className={styles.title}>Validator list</div>
                      {validatorAddrList.map((validator) => (
                        <div key={validator} className={styles.validator}>
                          {validator}
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                  <TabPanel value="2">
                    <div>Detail component</div>
                    <CreateSubmissionFlow mission={mission} />
                  </TabPanel>
                  <TabPanel value="3">
                    <SubmissionUsers mission={mission} validatorList={validatorList} />
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
