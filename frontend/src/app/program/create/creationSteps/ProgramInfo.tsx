'use client';

import React from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import { Input, DateRangePicker } from '@nextui-org/react';
export const ProgramInfo = () => {
  return (
    <ContentContainer contentHeader="Program Info">
      <>
        <div className="inputWrapper flex flex-col gap-8">
          <div className="title flex gap-3 items-center justify-start">
            <span className="text-lg text-neutral-600 w-28">- Title </span>
            <Input
              size="sm"
              variant="underlined"
              labelPlacement="outside"
              placeholder="e.g., Smart contract study with OpenCampus"
              classNames={{
                base: 'w-[400px] shadow-none',
                inputWrapper: 'p-0 shadow-none border-b-2 border-solid border-neutral-200',
                input: 'text-base text-neutral-700 placeholder:text-neutral-400',
              }}
            />
          </div>
          <div className="title flex gap-3 items-center justify-start">
            <span className="text-lg text-neutral-600 w-28">- Period</span>
            <DateRangePicker
              size="sm"
              variant="underlined"
              hideTimeZone
              visibleMonths={3}
              classNames={{
                base: 'w-[400px] shadow-none',
                calendar: '!w-fit',
                calendarContent: '!w-fit',
                inputWrapper: 'p-0 shadow-none border-b-2 border-solid border-neutral-200',
                input: 'text-base text-neutral-700 placeholder:text-neutral-400',
              }}
              calendarProps={{
                classNames: {
                  gridHeader: 'bg-background shadow-none border-b-1 border-default-100',
                  cellButton: [
                    'data-[selected=true]:!text-neutral-700 data-[today=true]:!text-ludium data-[today=true]:font-bold rounded-none',
                    // start (pseudo)
                    'data-[range-start=true]:before:rounded-l-small',
                    'data-[selection-start=true]:before:rounded-l-small',
                    // end (pseudo)
                    'data-[range-end=true]:before:rounded-r-small',
                    'data-[selection-end=true]:before:rounded-r-small',
                    // start (selected)
                    'data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small',
                    'data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:bg-neutral-700',
                    'data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:!text-white',
                    // end (selected)
                    'data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small',
                    'data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:bg-neutral-700',
                    'data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:!text-white',
                  ],
                },
              }}
            />
          </div>
          <div className="title flex gap-3 items-center justify-start">
            <span className="text-lg text-neutral-600 w-28">- Description</span>
            <Input
              size="sm"
              variant="underlined"
              labelPlacement="outside"
              placeholder="e.g., Smart contract study with OpenCampus"
              classNames={{
                base: 'w-[400px] shadow-none',
                inputWrapper: 'p-0 shadow-none border-b-2 border-solid border-neutral-200',
                input: 'text-base text-neutral-700 placeholder:text-neutral-400',
              }}
            />
          </div>
        </div>
      </>
    </ContentContainer>
  );
};
