'use client';

import type {FC} from 'react';
import {cn} from '@/utils/cn';

interface EventsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

const inputStyles = cn(
  'rounded-md border border-gray-300 px-3 py-2 text-sm outline-none',
  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
);

const EventsFilters: FC<EventsFiltersProps> = ({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}) => {
  return (
    <div className='flex flex-wrap gap-3'>
      <input
        type='text'
        placeholder='Search by title...'
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(inputStyles, 'w-full sm:w-64')}
      />

      <div className='flex items-center gap-2'>
        <label className='text-sm text-gray-500'>From</label>
        <input
          type='date'
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className={inputStyles}
        />
      </div>

      <div className='flex items-center gap-2'>
        <label className='text-sm text-gray-500'>To</label>
        <input
          type='date'
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
};

export default EventsFilters;
