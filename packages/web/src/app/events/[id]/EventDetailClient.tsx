'use client';

import {type FC, useState} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {useEvent} from '@/hooks/useEvent';
import {useEventRegistration} from '@/hooks/useEventRegistration';
import {useUserStore} from '@/store/useUserStore';
import {BackArrowIcon, CalendarIcon, LocationIcon} from '@/components/icons';
import RegistrationModal from '@/components/RegistrationModal';
import {cn} from '@/utils/cn';

const EventDetailClient: FC = () => {
  const {id} = useParams<{id: string}>();
  const {data: event, isLoading, isError} = useEvent(id);
  const user = useUserStore((s) => s.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {mutate: registerForEvent, isPending} = useEventRegistration(id);

  const handleQuickRegister = () => {
    if (!user) return;
    registerForEvent({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
  };

  if (isLoading) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-12'>
        <div className='mb-4 h-8 w-48 animate-pulse rounded bg-gray-100' />
        <div className='mb-6 h-6 w-64 animate-pulse rounded bg-gray-100' />
        <div className='h-40 animate-pulse rounded-lg bg-gray-100' />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-12 text-center'>
        <h1 className='mb-4 text-2xl font-bold text-gray-900'>
          Event not found
        </h1>

        <Link
          href='/events'
          className='text-sm text-gray-500 underline hover:text-gray-700'
        >
          Back to events
        </Link>
      </div>
    );
  }

  const renderRegisterButton = () => {
    if (event.isRegistered) {
      return (
        <span className='inline-flex items-center gap-2 rounded-md bg-green-100 px-6 py-3 text-sm font-medium text-green-800'>
          You are already registered
        </span>
      );
    }

    if (user) {
      return (
        <button
          onClick={handleQuickRegister}
          disabled={isPending}
          className={cn(
            'rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white',
            isPending ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-800'
          )}
        >
          {isPending ? 'Registering...' : 'Register'}
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className='rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800'
      >
        Register
      </button>
    );
  };

  return (
    <div className='mx-auto max-w-3xl px-4 py-12'>
      <Link
        href='/events'
        className='mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700'
      >
        <BackArrowIcon />
        Back to events
      </Link>

      <h1 className='mb-4 text-3xl font-bold text-gray-900'>{event.title}</h1>

      <div className='mb-6 flex flex-wrap gap-4 text-sm text-gray-500'>
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

      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <p className='leading-relaxed text-gray-700'>{event.description}</p>
      </div>

      {renderRegisterButton()}

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={id}
        eventTitle={event.title}
      />
    </div>
  );
};

export default EventDetailClient;
