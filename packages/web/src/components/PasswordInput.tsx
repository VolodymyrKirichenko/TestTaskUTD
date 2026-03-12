'use client';

import {type InputHTMLAttributes, forwardRef, useState} from 'react';
import {EyeIcon, EyeOffIcon} from '@/components/icons';
import {cn} from '@/utils/cn';

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  hasError?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({hasError, className, ...props}, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className='relative'>
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn(
            'w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none',
            'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
            hasError ? 'border-red-300' : 'border-gray-300',
            className
          )}
          {...props}
        />

        <button
          type='button'
          onClick={() => setVisible((v) => !v)}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          tabIndex={-1}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
