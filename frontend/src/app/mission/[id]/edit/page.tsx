'use client';
import BackLink from '@/components/BackLink';
import SubmissionUsers from '@/components/SubmissionUsers';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { TabContext, TabPanel } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export interface Submission {
  title: string;
  content: string;
  type: string;
  endTime: string;
}

export default function MissionEdit() {
  const route = useRouter();
  const param = useParams();

  const { user } = useUser();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value, setValue] = useState('1');

  const [chapterTitle, setChapterTitle] = useState('');
  const [mission, setMission] = useState<MissionType>();
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      title: '',
      content: '',
      type: 'article',
      endTime: '',
    },
  ]);

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

  const addSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user && mission) {
        await fetchData(`/submissions/${param.id}/add`, 'POST', {
          chapterData:
            mission?.category === 'study'
              ? {
                  title: chapterTitle,
                }
              : null,
          submissionData: {
            program_id: mission.program_id,
            submissions: submissions,
          },
        });

        alert('Success to make submission!');
        route.push(`${PATH.MISSION}/${param.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.MISSION}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {user?.walletId === mission?.owner ? (
              <>
                <div className={styles.title}>Mission Manage</div>
                <TabContext value={value}>
                  <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                    <Tab value="1" label="Dashboard" />
                    <Tab value="2" label="Mission Detail" />
                    <Tab value="3" label="Submissions" />
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
                  <TabPanel value="2">MissionDetail</TabPanel>
                  <TabPanel value="3">
                    <SubmissionUsers />
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
