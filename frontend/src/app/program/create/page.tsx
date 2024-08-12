'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { useRouter } from 'next/navigation';
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

const initMission = {
  prize: '',
  validators: '',
  owner: '',
  title: '',
  guide: '',
  category: '', // announcement, mission
  endAt: null,
};

export default function AddProgram() {
  const route = useRouter();
  const { user } = useUser();

  const [missions, setMissions] = useState<Mission[]>([initMission]);

  const [programPrize, setProgramPrize] = useState('');
  const [programTitle, setProgramTitle] = useState('');
  const [programGuide, setProgramGuide] = useState('');
  const [programEndTime, setProgramEndTime] = useState<string | null>(null);

  const handleMissionChange = (index: number, field: keyof Mission, value: string) => {
    const newMissions = missions.map((mission, i) => (i === index ? { ...mission, [field]: value } : mission));
    setMissions(newMissions);
  };

  const addProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    try {
      await fetchData('/programs/create', 'POST', {
        programData: {
          owner: user.walletId,
          type: 'manage',
          title: programTitle,
          guide: programGuide,
          prize: Number(programPrize),
          end_at: programEndTime,
        },
        missionData: missions,
      });

      //   route.push(PATH.PROGRAM);
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
            <div className={styles.title}>프로그램 만들기</div>
            <div className={styles.table}>
              <div>
                <div>
                  1. 프로그램만 만들고 나머지는 다른 사람들한테 시키기 - 프로그램 만들고 미션, 서브미션은 안만듦
                </div>
                <div>여기까지만 적으면 그냥 프로그램만 만든 것</div>
                <div>type은 알아서 지정 (manage, study)</div>
                <div>
                  상금:{' '}
                  <input
                    type="text"
                    placeholder="프로그램 상금 적어줭"
                    onChange={(e) => setProgramPrize(e.target.value)}
                  />
                </div>
                <div>
                  타이틀:{' '}
                  <input
                    type="text"
                    placeholder="프로그램 타이틀 적어줭"
                    onChange={(e) => setProgramTitle(e.target.value)}
                  />
                </div>
                <div>
                  설명:{' '}
                  <textarea placeholder="프로글매 설명 적어줭" onChange={(e) => setProgramGuide(e.target.value)} />
                </div>
                <div>
                  마감 시간:{' '}
                  <input
                    type="date"
                    placeholder="프로그램 마감시간 적어줭"
                    onChange={(e) => setProgramEndTime(e.target.value || null)}
                  />
                </div>
                <hr />
              </div>
              {missions.map((mission, index) => {
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
              <button onClick={() => setMissions([...missions, initMission])}>Add Mission</button>
              <button onClick={addProgram}>add!!!!!</button>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
