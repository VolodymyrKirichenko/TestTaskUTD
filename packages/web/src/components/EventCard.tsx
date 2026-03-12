'use client';

import type {FC} from 'react';
import Link from 'next/link';
import type {EventListItem} from '@fullstack/shared';
import {CalendarIcon, LocationIcon} from '@/components/icons';
import {cn} from '@/utils/cn';

interface EventCardProps {
  event: EventListItem;
}

const EventCard: FC<EventCardProps> = ({event}) => {
  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'block rounded-lg border p-6 transition-shadow hover:shadow-md',
        event.isRegistered
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 bg-white'
      )}
    >
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>{event.title}</h3>
        {event.isRegistered && (
          <span className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700'>
            Registered
          </span>
        )}
      </div>
      <div className='mb-3 flex flex-wrap gap-3 text-sm text-gray-500'>
        <span className='flex items-center gap-1'>
          <CalendarIcon />
          {new Date(event.date).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className='flex items-center gap-1'>
          <LocationIcon />
          {event.location}
        </span>
      </div>
      <p className='text-sm text-gray-600'>{event.shortDescription}</p>
    </Link>
  );
};

export default EventCard;
