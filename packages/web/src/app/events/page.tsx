'use client';

import {type FC, useState, useMemo, useEffect} from 'react';
import debounce from 'lodash.debounce';
import EventCard from '@/components/EventCard';
import EventsFilters from '@/components/EventsFilters';
import Pagination from '@/components/Pagination';
import {useEvents} from '@/hooks/useEvents';

const EventsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1);
      }, 500),
    []
  );

  const {data, isLoading, isError, error} = useEvents({
    page,
    limit,
    search: debouncedSearch,
    dateFrom,
    dateTo,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  useEffect(() => {
    debouncedSetSearch(search);
    return () => debouncedSetSearch.cancel();
  }, [search, debouncedSetSearch]);

  if (isError) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-12'>
        <div className='rounded-md bg-red-50 p-6 text-center'>
          <p className='text-red-600'>
            {error instanceof Error ? error.message : 'Failed to load events'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-3 text-sm text-red-500 underline hover:text-red-700'
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-12'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900'>Events</h1>

      <div className='mb-6'>
        <EventsFilters
          search={search}
          onSearchChange={setSearch}
          dateFrom={dateFrom}
          onDateFromChange={handleDateFromChange}
          dateTo={dateTo}
          onDateToChange={handleDateToChange}
        />
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({length: 3}).map((_, i) => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-lg bg-gray-100'
            />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className='rounded-md bg-gray-50 p-12 text-center'>
          <p className='text-gray-500'>No events found.</p>
          {(search || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearch('');
                setDebouncedSearch('');
                setDateFrom('');
                setDateTo('');
                setPage(1);
              }}
              className='mt-2 text-sm text-gray-400 underline hover:text-gray-600'
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className='mb-6 grid gap-4 sm:grid-cols-2'>
            {data.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </div>
  );
};

export default EventsPage;
