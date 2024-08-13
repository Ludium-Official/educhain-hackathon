'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { isEmpty } from 'ramda';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function ProgramEdit() {
  const route = useRouter();
  const param = useParams();

  const { user } = useUser();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<MissionType[]>([]);

  // for edit program
  const [programTitle, setProgramTitle] = useState('');

  // for create mission
  const [missionTitle, setMissionTitle] = useState('');
  const [missionContent, setMissionContent] = useState('');
  const [missionCategory, setMissionCategory] = useState(''); // announcement, study
  const [missionPrize, setMissionPrize] = useState('');
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

    if (isEmpty(missionPrize) || isEmpty(missionTitle) || isEmpty(missionCategory)) {
      if (isEmpty(missionTitle)) {
        alert('Fill in title');
        return;
      } else if (isEmpty(missionCategory)) {
        alert('Fill in category');
        return;
      }

      alert('Fill in prize');
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
            prize: Number(missionPrize),
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

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.PROGRAM}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {program && user ? (
              <>
                <div className={styles.title}>Program Manage</div>
                <div className={styles.tableWrapper}>
                  {user.walletId === program?.owner && (
                    <>
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
                  <div className={styles.table}>
                    <div className={styles.tableTitle}>Program Add</div>
                    <div className={styles.rowsTable}>
                      <div className={styles.inputWrapper}>
                        Title
                        <input
                          className={styles.input}
                          placeholder="Title of mission"
                          onChange={(e) => setMissionTitle(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        Content
                        <textarea
                          className={styles.input}
                          placeholder="Content of mission"
                          onChange={(e) => setMissionContent(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        Prize
                        <input
                          className={styles.input}
                          placeholder="Prize of mission"
                          onChange={(e) => setMissionPrize(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        Deadline
                        <DatePicker
                          onChange={(value) => {
                            const formatValue = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                            setMissionEndTime(formatValue);
                          }}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        Program Type
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="announcement"
                            control={<Radio onChange={(e) => setMissionCategory(e.target.value)} />}
                            label="Announcement"
                          />
                          <FormControlLabel
                            value="study"
                            control={<Radio onChange={(e) => setMissionCategory(e.target.value)} />}
                            label="Study"
                          />
                        </RadioGroup>
                      </div>
                    </div>
                    <button className={styles.addBtn} onClick={addMission}>
                      Make Mission
                    </button>
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
