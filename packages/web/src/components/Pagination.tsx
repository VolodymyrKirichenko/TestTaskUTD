'use client';

import type {FC} from 'react';
import {cn} from '@/utils/cn';

const LIMIT_OPTIONS = [6, 12, 24, 48];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  if (totalPages <= 0) return null;

  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className='flex flex-col items-center gap-4'>
      <nav className='flex items-center justify-center gap-1'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            currentPage === 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Previous
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'rounded-md px-3 py-2 text-sm',
              page === currentPage
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Next
        </button>
      </nav>

      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-500'>
          Page {currentPage} of {totalPages}
        </span>

        <div className='flex items-center gap-2'>
          <label htmlFor='limit-select' className='text-sm text-gray-500'>
            Show:
          </label>

          <select
            id='limit-select'
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className='rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
