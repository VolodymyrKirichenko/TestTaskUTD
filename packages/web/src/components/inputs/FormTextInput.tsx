'use client';

import {type ReactNode} from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import {cn} from '@/utils/cn';

type FormTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  fieldName: Path<T>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date';
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  autoComplete?: string;
};

const FormTextInput = <T extends FieldValues>({
  control,
  fieldName,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  className,
  containerClassName,
  autoComplete,
}: FormTextInputProps<T>): ReactNode => {
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

            <input
              ref={ref}
              type={type}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={cn(
                'w-full rounded-md border px-3 py-2 text-sm outline-none',
                'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                isError ? 'border-red-300' : 'border-gray-300',
                disabled && 'cursor-not-allowed bg-gray-100',
                className
              )}
            />

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

export default FormTextInput;
