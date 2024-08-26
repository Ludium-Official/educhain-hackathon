'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { ProgramType } from '@/types/program';
import { getLocalTimeZone, today } from '@internationalized/date';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DatePicker } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation';
import { isEmpty } from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';
import { subtract } from '@/functions/math';
import { parseEther } from 'viem';

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
    } else if (program?.reserve && parseEther(subtract(program.reserve, missionReserve)) < BigInt(0)) {
      alert('Check rest reserve prize');
      return;
    } else if (Number(missionPrize) > Number(missionReserve)) {
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
            validator_address: program.owner_address,
          },
        });

        alert('Success to make mission!');
        route.push(`${PATH.PROGRAM}/${program.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const reservePrize = useMemo(() => {
  //   const allocatePrize = missions.reduce((result, mission) => (result += Number(mission.prize)), 0);

  //   return Number(program?.reserve) - allocatePrize;
  // }, [missions, program?.reserve]);

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.PROGRAM}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {program && user ? (
              <>
                <div className={styles.title}>New Mission</div>
                <div className={styles.tableWrapper}>
                  <div className={styles.table}>
                    <div className={styles.tableTitle}>Mission Create</div>
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
                        <div className={styles.prizeInput}>
                          Reserve<span>(remain: {program?.reserve} EDU)</span>
                        </div>
                        <input
                          className={styles.input}
                          placeholder="Reserve of mission"
                          onChange={(e) => setMissionReserve(e.target.value)}
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
                          aria-label="program-period"
                          size="sm"
                          lang="en"
                          hourCycle={24}
                          variant="underlined"
                          visibleMonths={3}
                          minValue={today(getLocalTimeZone())}
                          onChange={(e) => {
                            setMissionEndTime(`${e.year}-${e.month >= 10 ? e.month : `0${e.month}`}-${e.day} 00:00:00`);
                          }}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        Program Category
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
                      Create Mission
                    </button>
                  </div>
                </div>
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
