'use client';

import { useState } from 'react';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Progress, Input, Button } from '@nextui-org/react';
import * as CreationSteps from './creationSteps';

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

const contentRenderBySteps = (slideNumber: number): React.ReactNode => {
  switch (slideNumber) {
    case 0:
      return <CreationSteps.Guide />;
    case 1:
      return <CreationSteps.ProgramInfo />;
    case 2:
      return <CreationSteps.SetManagers />;
    case 3:
      return <CreationSteps.SetBounty />;
    case 4:
      return <CreationSteps.AddMissions />;
    case 5:
      return <CreationSteps.Confirm />;
  }
};

export default function AddProgram() {
  const route = useRouter();
  const { user } = useUser();

  const [programTitle, setProgramTitle] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programPrize, setProgramPrize] = useState('');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [programStartTime, setProgramStartTime] = useState<string | null>(null);
  const [programEndTime, setProgramEndTime] = useState<string | null>(null);

  const [creationStep, setCreationStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [slideNumber, setSlideNumber] = useState<number>(0);

  const handleMissionChange = (index: number, field: keyof Mission, value: string) => {
    const newMissions = missions.map((mission, i) => (i === index ? { ...mission, [field]: value } : mission));
    setMissions(newMissions);
  };

  const create = async () => {
    if (!user) {
      return;
    }

    try {
      await fetchData('/programs/create', 'POST', {
        programData: {
          owner: user.walletId,
          type: 'manage',
          title: programTitle,
          guide: programDescription,
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

  const nextStep = () => {
    if (slideNumber === 0) {
      setCreationStep(1);
    }
    if (slideNumber === 5) {
      create();
    } else {
      setSlideNumber(slideNumber + 1);
    }
  };

  return (
    <Wrapper>
      {{
        header: <BackLink path={PATH.PROGRAM} />,
        body: (
          <div className={`wrapperBody w-full`}>
            <div className=" mb-2 px-2 flex justify-between items-center">
              <span className="text-xl text-neutral-600 font-semibold">Create Program</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm text-neutral-500">{creationStep + 1} / 6</span>
                <Progress
                  size="sm"
                  aria-label="program-creation-process"
                  value={((creationStep + 1) / 6) * 100}
                  classNames={{
                    base: 'w-48',
                    indicator: 'bg-ludium',
                    labelWrapper: 'text-neutral-400',
                  }}
                />
              </div>
            </div>
            <div className="bg-white border-solid border-gray-500 border h-[650px] rounded-2xl w-full flex flex-col justify-between p-8">
              {contentRenderBySteps(slideNumber)}
              <div className="buttonWrapper flex justify-between items-center">
                <Button
                  radius="lg"
                  size="lg"
                  variant="light"
                  className={`${
                    slideNumber === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                  } text-lg text-neutral-500 data-[hover=true]:!bg-neutral-200`}
                  onClick={() => {
                    setSlideNumber(slideNumber - 1);
                  }}
                >
                  Back
                </Button>
                <Button
                  radius="lg"
                  size="lg"
                  variant={`${slideNumber === 5 ? 'solid' : 'light'}`}
                  className={`${
                    slideNumber === 5 ? 'bg-ludium text-white' : 'text-ludium data-[hover=true]:!bg-ludiumContainer'
                  } text-lg`}
                  onClick={nextStep}
                  isDisabled={slideNumber === 5 && creationStep < 5}
                >
                  {slideNumber === 5 ? 'Create' : slideNumber === 4 && missions.length === 0 ? 'Skip' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
