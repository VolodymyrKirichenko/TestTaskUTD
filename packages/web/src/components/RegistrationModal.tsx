'use client';

import {type FC, useEffect, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {registrationSchema, type RegistrationFormData} from '@/lib/validation';
import {useEventRegistration} from '@/hooks/useEventRegistration';
import PasswordInput from '@/components/PasswordInput';
import {CheckIcon, CloseIcon} from '@/components/icons';
import {cn} from '@/utils/cn';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const RegistrationModal: FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}) => {
  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
    reset: resetMutation,
  } = useEventRegistration(eventId);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: {errors},
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
    resetMutation();
  }, [onClose, resetForm, resetMutation]);

  const onSubmit = (data: RegistrationFormData) => {
    mutate(data);
  };

  const getErrorMessage = (): string => {
    if (!error) {
      return 'Something went wrong. Please try again.';
    }

    if ('response' in error && error.response) {
      const resp = error.response as {data?: {message?: string}};

      return resp.data?.message || 'Something went wrong. Please try again.';
    }

    return 'Something went wrong. Please try again.';
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
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
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6'>
        {isSuccess ? (
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
              <CheckIcon />
            </div>

            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Registration Successful
            </h3>

            <p className='mb-4 text-sm text-gray-600'>
              You have been registered for {eventTitle}.
            </p>

            <button
              onClick={handleClose}
              className='rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800'
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Register for {eventTitle}
              </h2>

              <button
                onClick={handleClose}
                className='text-gray-400 hover:text-gray-600'
              >
                <CloseIcon />
              </button>
            </div>

            {isError && (
              <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600'>
                {getErrorMessage()}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <label
                  htmlFor='fullName'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Full name
                </label>

                <input
                  id='fullName'
                  type='text'
                  {...register('fullName')}
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm outline-none',
                    'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder='John Doe'
                />

                {errors.fullName && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Email
                </label>

                <input
                  id='email'
                  type='email'
                  {...register('email')}
                  autoComplete='off'
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm outline-none',
                    'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder='john@example.com'
                />

                {errors.email && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Phone
                </label>

                <input
                  id='phone'
                  type='tel'
                  {...register('phone')}
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm outline-none',
                    'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder='+380 99 123 4567'
                />

                {errors.phone && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='reg-password'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Password
                </label>

                <PasswordInput
                  id='reg-password'
                  {...register('password')}
                  hasError={!!errors.password}
                  autoComplete='new-password'
                  placeholder='At least 6 characters'
                />

                {errors.password && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='reg-confirm-password'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Confirm password
                </label>

                <PasswordInput
                  id='reg-confirm-password'
                  {...register('confirmPassword')}
                  hasError={!!errors.confirmPassword}
                  autoComplete='new-password'
                  placeholder='Repeat your password'
                />

                {errors.confirmPassword && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={isPending}
                className={cn(
                  'w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white',
                  isPending
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-800'
                )}
              >
                {isPending ? 'Submitting...' : 'Register'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
