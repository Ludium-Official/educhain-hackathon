'use client';

import React from 'react';
import Image from 'next/image';
import { ContentContainer } from './common/ContentContainer';
import { Input, DateRangePicker, Textarea } from '@nextui-org/react';
import { useProgramCreation } from '@/hooks/store/useProgramCreation';
import {
  parseZonedDateTime,
  today,
  fromDate,
  CalendarDateTime,
  getLocalTimeZone,
  parseAbsolute,
  toLocalTimeZone,
} from '@internationalized/date';

export const ProgramInfo = () => {
  const { programInfo, setTitle, setDescription, setPeriod } = useProgramCreation();
  const date = new Date();
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
              value={programInfo.title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
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
              aria-label="program-period"
              size="sm"
              lang="en"
              hourCycle={24}
              variant="underlined"
              visibleMonths={3}
              granularity="day"
              value={{ start: programInfo.start_at, end: programInfo.end_at }}
              minValue={today(getLocalTimeZone())}
              onChange={(e) => {
                const start = e.start;
                const end = e.end;
                // const startDateTime = new CalendarDateTime(start.year, start.month, start.day, 0, 0, 0, 0);
                // const endDateTime = new CalendarDateTime(end.year, end.month, end.day, 23, 59, 59, 59);
                setPeriod(start, end);
              }}
              classNames={{
                base: 'w-[400px] shadow-none',
                calendar: '!w-fit',
                calendarContent: '!w-fit',
                inputWrapper: 'p-0 shadow-none border-b-2 border-solid border-neutral-200',
                input: 'text-base text-neutral-700 placeholder:text-neutral-400',
                segment: 'text-neutral-400',
              }}
              calendarProps={{
                classNames: {
                  gridHeader: 'bg-background shadow-none border-b-1 border-default-100',
                  cellButton: [
                    'data-[selected=true]:!text-neutral-700 data-[today=true]:!text-ludium data-[today=true]:font-bold rounded-small',
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
          <div className="title flex flex-col gap-3 items-start justify-center">
            <span className="text-lg text-neutral-600 w-28">- Description</span>
            <Textarea
              size="md"
              maxRows={11}
              variant="bordered"
              labelPlacement="outside"
              value={programInfo.description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="e.g., Smart contract study with OpenCampus"
              classNames={{
                base: 'w-[550px] shadow-none',
                inputWrapper: 'shadow-none border-2 border-solid border-neutral-200',
                input: 'text-base text-neutral-700 placeholder:text-neutral-400',
              }}
            />
          </div>
        </div>
      </>
    </ContentContainer>
  );
};
