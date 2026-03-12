'use client';

import {type ReactNode, useState} from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import {EyeIcon, EyeOffIcon} from '@/components/icons';
import {cn} from '@/utils/cn';

type FormPasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  fieldName: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  autoComplete?: string;
};

const FormPasswordInput = <T extends FieldValues>({
  control,
  fieldName,
  label,
  placeholder,
  disabled = false,
  className,
  containerClassName,
  autoComplete,
}: FormPasswordInputProps<T>): ReactNode => {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({field: {onChange, value, ref, onBlur}, fieldState}) => {
        const isError = fieldState.invalid;

        return (
          <div className={containerClassName}>
            {label && (
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {label}
              </label>
            )}

            <div className='relative'>
              <input
                ref={ref}
                type={visible ? 'text' : 'password'}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={cn(
                  'w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                  isError ? 'border-red-300' : 'border-gray-300',
                  disabled && 'cursor-not-allowed bg-gray-100',
                  className
                )}
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

            {isError && fieldState.error?.message && (
              <p className='mt-1 text-xs text-red-500'>
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormPasswordInput;
