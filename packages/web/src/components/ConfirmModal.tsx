'use client';

import {type FC, useEffect} from 'react';
import {cn} from '@/utils/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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
      <div className='mx-4 w-full max-w-sm rounded-lg bg-white p-6'>
        <h2 className='mb-2 text-lg font-semibold text-gray-900'>{title}</h2>
        <p className='mb-6 text-sm text-gray-500'>{message}</p>

        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className={cn(
              'flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700',
              'hover:bg-gray-50'
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              'flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white',
              'hover:bg-red-700'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
