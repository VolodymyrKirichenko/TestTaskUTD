'use client';

import {type FC, useEffect} from 'react';
import {CheckIcon, CloseIcon} from '@/components/icons';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const ResultModal: FC<ResultModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='mx-4 w-full max-w-sm rounded-lg bg-white p-6 text-center'>
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {type === 'success' ? <CheckIcon /> : <CloseIcon />}
        </div>

        <h3 className='mb-2 text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='mb-4 text-sm text-gray-600'>{message}</p>

        <button
          onClick={onClose}
          className='rounded-md bg-gray-900 px-6 py-2 text-sm text-white hover:bg-gray-800'
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
