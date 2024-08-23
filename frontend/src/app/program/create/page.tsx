'use client';

import { useState } from 'react';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Progress,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Checkbox,
  useDisclosure,
  CircularProgress,
} from '@nextui-org/react';
import * as CreationSteps from './creationSteps';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import { getLocalTimeZone, now } from '@internationalized/date';
import Link from 'next/link';

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
  const {
    programInfo,
    txSend,
    txConfirm,
    isProgramAddedInDb,
    sendLoading,
    confirmLoading,
    txHash,
    createProgram,
    reset,
  } = useProgramCreation();
  const [creationStep, setCreationStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [slideNumber, setSlideNumber] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const nextStep = () => {
    switch (slideNumber) {
      case 0:
        if (creationStep < 1) {
          setCreationStep(1);
        }
        break;
      case 1:
        if (creationStep < 2 && programInfo.title && programInfo.end_at.compare(now(getLocalTimeZone())) > 0) {
          setCreationStep(2);
        }
        break;
      case 2:
        if (creationStep === 2) {
          setCreationStep(3);
        }
        break;
      case 3:
        if (creationStep === 3 && Number(programInfo.reserve) > 0) {
          setCreationStep(4);
        }
        break;
      case 4:
        let totalMissionPrizes = 0;
        programInfo.missions.map((mission) => {
          totalMissionPrizes += Number(mission.prize);
        });
        if (creationStep === 4 && Number(programInfo.reserve) >= Number(totalMissionPrizes)) {
          setCreationStep(5);
        }
        break;
      case 5:
        onOpen();
        createProgram();
        break;
    }
    if (slideNumber < 5) {
      setSlideNumber(slideNumber + 1);
    }
  };

  return (
    <>
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
                    {slideNumber === 5
                      ? 'Create'
                      : slideNumber === 4 && programInfo.missions.length === 0
                      ? 'Skip'
                      : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          ),
        }}
      </Wrapper>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        backdrop="blur"
        onOpenChange={onOpenChange}
        size="sm"
        hideCloseButton
        classNames={{ wrapper: '!z-[100]', base: '!z-[101] bg-neutral-100', backdrop: '!z-[100]' }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col pb-2">Send Transaction</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3 flex-auto pointer-events-none pl-1">
                  <div className="flex gap-2 items-center">
                    <span className="text-base text-neutral-500">- Program Info Add</span>
                    {isProgramAddedInDb && (
                      <span
                        className={`text-base ${
                          isProgramAddedInDb ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-500`}
                      >
                        ✅
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-base text-neutral-500">- Sign & Send Transaction</span>
                    {txSend && (
                      <span
                        className={`text-base ${txSend ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                      >
                        ✅
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-base text-neutral-500">- Transaction Confirm</span>
                    {txConfirm && (
                      <span
                        className={`text-base ${
                          txConfirm ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-500`}
                      >
                        ✅
                      </span>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col justify-center items-end gap-2">
                <div
                  className={`flex justify-end items-center text-sm underline decoration-neutral-400 ${
                    txConfirm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://opencampus-codex.blockscout.com/tx/${txHash}`}
                    className="!text-neutral-400"
                  >
                    Check transaction on Blockscout
                  </Link>
                </div>
                <div className="flex items-center">
                  {txConfirm && (
                    <Button
                      className="text-neutral-500"
                      variant="light"
                      onClick={() => {
                        onClose();
                        reset();
                        route.push(`/program`);
                      }}
                    >
                      Close
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (txConfirm) {
                        route.push(`/program/${programInfo.programId}`);
                        reset();
                      } else {
                        createProgram();
                      }
                    }}
                    className="bg-neutral-700 text-white"
                    isLoading={sendLoading || confirmLoading}
                  >
                    {txConfirm
                      ? 'Go to program'
                      : confirmLoading
                      ? 'Wait tx confirm'
                      : sendLoading
                      ? 'Sending..'
                      : isProgramAddedInDb && !txConfirm
                      ? 'Resend'
                      : 'Done'}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
