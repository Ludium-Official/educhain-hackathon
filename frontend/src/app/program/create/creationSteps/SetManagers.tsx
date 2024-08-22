'use client';

import React, { useState } from 'react';
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
} from '@nextui-org/react';
import { useUser } from '@/hooks/store/user';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import Trash from '@/assets/common/Trash.svg';

export const SetManagers = () => {
  const { user } = useUser();
  const account = useAccount();
  const { addManager, programInfo, deleteManager } = useProgramCreation();
  const [address, setAddress] = useState<string>('');
  const [addressName, setAddressName] = useState<string | undefined>();

  const addHandler = () => {
    const userAddress = address.trim();
    if (userAddress.length !== 42 || userAddress.slice(0, 2) !== '0x') {
      toast.error('Invalid EVM address', { id: 'invalid-address' });
      return;
    }
    const filtered = programInfo.managers.filter(
      (manager) => manager.address.toLowerCase() === userAddress.toLowerCase(),
    );
    if (filtered.length > 0 || account.address?.toLocaleLowerCase() === address.toLowerCase()) {
      toast.error('Already added manager', { id: 'already-added-manager' });
      return;
    }
    addManager(userAddress, addressName);
    setAddress('');
    setAddressName('');
  };

  const deleteHandler = (idx: number) => {
    deleteManager(idx);
  };
  return (
    <ContentContainer contentHeader="Managers">
      <>
        <div className="flex gap-4 bg-neutral-50 p-3 rounded-xl">
          <div className="flex gap-2 flex-auto">
            <Select
              radius="sm"
              disabledKeys={['owner']}
              defaultSelectedKeys={['manager']}
              className="w-[120px] text-neutral-700 flex-shrink-0"
              classNames={{ listbox: '[&_ul]:pl-0 [&_ul]:mb-0', trigger: 'bg-white', selectorIcon: 'fill-neutral-400' }}
            >
              <SelectItem key="owner">Owner</SelectItem>
              <SelectItem key="manager">Manager</SelectItem>
            </Select>
            <Input
              // variant="bordered"
              radius="sm"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-[400px] flex-shrink-0"
              classNames={{ inputWrapper: 'bg-white', input: 'text-neutral-700' }}
            />
            <Input
              // variant="bordered"
              radius="sm"
              className="flex-auto"
              placeholder="name (optional)"
              value={addressName}
              onChange={(e) => setAddressName(e.target.value.slice(0, 25))}
              classNames={{ inputWrapper: 'bg-white', input: 'text-neutral-700' }}
            />
          </div>
          <Button className="bg-neutral-700 text-white px-0" onClick={addHandler}>
            + Add
          </Button>
        </div>
        <Divider className="bg-neutral-400" />
        <Table removeWrapper aria-label="manager-list" className="z-10 overflow-y-scroll max-h-[350px]">
          <TableHeader>
            <TableColumn className="w-[100px]">ROLE</TableColumn>
            <TableColumn className="w-[400px]">ADDRESS</TableColumn>
            <TableColumn>NAME</TableColumn>
          </TableHeader>
          <TableBody className="">
            {[{ address: account.address, name: user?.name }, ...programInfo.managers].map((manager, idx) => (
              <TableRow key={idx} className="relative group/rowall">
                <TableCell className={`transition-all duration-300 ${idx === 0 ? 'text-ludium' : ''}`}>
                  {idx === 0 ? 'Owner' : 'Manager'}
                </TableCell>
                <TableCell className="transition-all duration-300">{manager.address}</TableCell>
                <TableCell className="truncate">
                  <span className="transition-all duration-300 break-all">
                    {manager.name || manager.address?.slice(0, 8)}
                  </span>
                  {idx !== 0 && (
                    <span className="transition-all duration-300 !absolute z-30 top-1/2 right-0 -translate-y-1/2 opacity-0 pointer-events-none group-hover/rowall:!opacity-100 group-hover/rowall:pointer-events-auto">
                      <div className="!absolute w-full h-full group-hover/rowall:blur-sm bg-white"></div>
                      <Button
                        onClick={() => deleteHandler(idx - 1)}
                        className="bg-transparent w-full text-sm text-neutral-400 font-semibold hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    </ContentContainer>
  );
};
