'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'ramda';
import { useState } from 'react';
import styles from './page.module.scss';

interface Mission {
  prize: string;
  validators: string;
  owner: string;
  title: string;
  guide: string;
  category: string;
  endAt: string | null;
}

// const initMission = {
//   prize: '',
//   validators: '',
//   owner: '',
//   title: '',
//   guide: '',
//   category: '', // announcement, mission
//   endAt: null,
// };

export default function AddProgram() {
  const route = useRouter();
  const { user } = useUser();

  // const [missions, setMissions] = useState<Mission[]>([initMission]);

  const [programPrize, setProgramPrize] = useState('');
  const [programTitle, setProgramTitle] = useState('');
  const [programGuide, setProgramGuide] = useState('');
  const [programEndTime, setProgramEndTime] = useState<string | null>(null);
  const [programType, setProgramType] = useState('');

  // const handleMissionChange = (index: number, field: keyof Mission, value: string) => {
  //   const newMissions = missions.map((mission, i) => (i === index ? { ...mission, [field]: value } : mission));
  //   setMissions(newMissions);
  // };

  const addProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Login first!!');
      return;
    } else if (isEmpty(programPrize) || isEmpty(programTitle) || isEmpty(programType)) {
      if (isEmpty(programTitle)) {
        alert('Fill in title');
        return;
      } else if (isEmpty(programType)) {
        alert('Fill in type');
        return;
      }

      alert('Fill in prize');
      return;
    }

    try {
      await fetchData('/programs/add', 'POST', {
        programData: {
          owner: user.walletId,
          type: programType,
          title: programTitle,
          guide: programGuide,
          prize: Number(programPrize),
          end_at: programEndTime,
        },
        missionData: [],
      });

      alert('Success to make program!');
      route.push(PATH.PROGRAM);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {{
        header: <BackLink path={PATH.PROGRAM} />,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Make Program</div>
            <div className={styles.table}>
              <div className={styles.inputWrapper}>
                Title
                <input
                  className={styles.input}
                  placeholder="Title of program"
                  onChange={(e) => setProgramTitle(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                Description
                <textarea
                  className={styles.input}
                  placeholder="Guide of program"
                  onChange={(e) => setProgramGuide(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                Prize
                <input
                  className={styles.input}
                  placeholder="Prize of program"
                  onChange={(e) => setProgramPrize(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                Deadline
                <DatePicker
                  onChange={(value) => {
                    const formatValue = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                    setProgramEndTime(formatValue);
                  }}
                />
              </div>
              <div className={styles.inputWrapper}>
                Program Type
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    value="manage"
                    control={<Radio onChange={(e) => setProgramType(e.target.value)} />}
                    label="Manage"
                  />
                  <FormControlLabel
                    value="study"
                    control={<Radio onChange={(e) => setProgramType(e.target.value)} />}
                    label="Study"
                  />
                </RadioGroup>
              </div>
              {/* {missions.map((mission, index) => {
                return (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder="Prize"
                      value={mission.prize}
                      onChange={(e) => handleMissionChange(index, 'prize', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Validators"
                      value={mission.validators}
                      onChange={(e) => handleMissionChange(index, 'validators', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Owner"
                      value={mission.owner}
                      onChange={(e) => handleMissionChange(index, 'owner', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={mission.title}
                      onChange={(e) => handleMissionChange(index, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Guide"
                      value={mission.guide}
                      onChange={(e) => handleMissionChange(index, 'guide', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={mission.category}
                      onChange={(e) => handleMissionChange(index, 'category', e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      placeholder="End Time"
                      value={mission.endAt || ''}
                      onChange={(e) => handleMissionChange(index, 'endAt', e.target.value)}
                    />
                  </div>
                );
              })}
              <button onClick={() => setMissions([...missions, initMission])}>Add Mission</button> */}
              <button className={styles.addBtn} onClick={addProgram}>
                Make Program
              </button>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
