'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import {
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from '@nextui-org/react';
import OpencampusLogo from '@/assets/common/OpencampusLogo.svg';
import { useUser } from '@/hooks/store/user';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import Trash from '@/assets/common/Trash.svg';
import { add, subtract } from '@/functions/math';

export const AddMissions = () => {
  const { user } = useUser();
  const account = useAccount();
  const { addMission, programInfo, deleteManager } = useProgramCreation();
  const [address, setAddress] = useState<string>('');
  const [prize, setPrize] = useState<number>(0);
  const [missionName, setMissionName] = useState<string | undefined>();
  const [description, setDescription] = useState<string>('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [missionPrizeSum, setMissionPrizeSum] = useState<number>(0);

  const addHandler = () => {
    const userAddress = address.trim();
    if (userAddress.length !== 42 || userAddress.slice(0, 2) !== '0x') {
      toast.error('Invalid EVM address', { id: 'invalid-address' });
      return;
    }
    if (!missionName) {
      return;
    }
    addMission({
      prize,
      validators: address.trim(),
      owner: address.trim(),
      title: missionName,
      content: description,
      category: 'default',
      end_at: programInfo.end_at,
    });
    setAddress('');
    setMissionName('');
    setPrize(0);
    setDescription('');

    onClose();
  };

  useEffect(() => {
    if (programInfo.missions.length > 0) {
      let sum = 0;
      programInfo.missions.map((mission) => {
        sum = add(sum, mission.prize);
      });
      setMissionPrizeSum(sum);
    }
  }, [programInfo.missions]);

  const deleteHandler = (idx: number) => {
    deleteManager(idx);
  };

  return (
    <>
      <ContentContainer contentHeader="Add Missions">
        <>
          <div className="absolute right-1 top-1 flex gap-3 justify-end items-center text-xl">
            <Button className="bg-transparent text-ludium text-lg font-semibold px-0" onClick={onOpen}>
              + Add
            </Button>
          </div>
          <Table removeWrapper aria-label="manager-list" className="z-10 overflow-y-scroll h-[370px]">
            <TableHeader>
              <TableColumn className="w-[75px]">No.</TableColumn>
              <TableColumn className="">MISSION</TableColumn>
              <TableColumn align="end" className="w-[150px]">
                PRIZE
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={'No Missions'} className="">
              {programInfo.missions.map((mission, idx) => (
                <TableRow key={idx} className="relative group/rowall items-center">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="transition-all duration-300">
                    <div className="flex flex-col justify-center items-start gap-1">
                      <span className="text-neutral-700 text-base">{mission.title}</span>
                      <span className="text-sm text-neutral-400">Auditor: {mission.validators}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`transition-all duration-300 text-base`}>
                    <div className="flex gap-2 items-center justify-end">
                      <span className="text-neutral-700">{mission.prize}</span>
                      <span className="text-neutral-400">EDU</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider className="bg-neutral-400 my-2" />
          <div className="diff flex justify-between items-center px-2">
            <div>
              <span className="text-neutral-400 text-lg">Remain</span>
            </div>
            <div className="flex gap-2 w-[130px] px-2">
              <Image src={OpencampusLogo} alt="educoin-logo" width={20} height={20} className="shrink-0" />
              <div className="flex flex-auto justify-end items-center gap-2 text-lg">
                <span className="text-neutral-700">{subtract(programInfo.prize, missionPrizeSum)}</span>
                <span className="text-neutral-400">EDU</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center text-sm text-neutral-400">
            You can add missions whenever you want
          </div>
        </>
      </ContentContainer>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        classNames={{ wrapper: '!z-[100]', base: '!z-[101] bg-neutral-100', backdrop: '!z-[100]' }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Mission</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 flex-auto">
                  <div>
                    <Input
                      radius="sm"
                      className="flex-auto"
                      label="Mission Name"
                      value={missionName}
                      onChange={(e) => setMissionName(e.target.value)}
                      classNames={{ inputWrapper: 'bg-white', input: 'text-neutral-700' }}
                    />
                  </div>
                  <Textarea
                    size="md"
                    maxRows={11}
                    value={description}
                    label="Mission Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    classNames={{
                      base: 'shadow-none',
                      inputWrapper: 'bg-white',
                      input: 'text-base text-neutral-700 placeholder:text-neutral-400',
                    }}
                  />
                  <Divider className="bg-neutral-400 my-4" />
                  <div className="flex gap-2">
                    <Input
                      // variant="bordered"
                      radius="sm"
                      label="Auditor address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-[400px] flex-shrink-0 flex-auto"
                      classNames={{ inputWrapper: 'bg-white', input: 'text-neutral-700' }}
                    />
                    <Input
                      // variant="bordered"
                      radius="sm"
                      label="Prize"
                      type="number"
                      value={prize.toString() === '0' ? '' : prize.toString()}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.value)) || Number(e.target.value) < 0) {
                          return;
                        }
                        setPrize(Number(e.target.value));
                      }}
                      endContent={
                        <div className="flex gap-2 w-[150px]">
                          <span className="text-neutral-400 text-base">EDU</span>
                          <span className="text-neutral-400 text-base whitespace-nowrap">
                            / {subtract(programInfo.prize, missionPrizeSum)} EDU
                          </span>
                        </div>
                      }
                      className="w-[250px] flex-shrink-0"
                      classNames={{
                        base: 'flex-shrink-0',
                        inputWrapper: 'bg-white',
                        input:
                          'text-neutral-700 text-base text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button onPress={addHandler} className="bg-neutral-700 text-white">
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};