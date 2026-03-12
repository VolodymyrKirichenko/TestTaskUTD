'use client';

import {type FC, useEffect, useCallback, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {registrationSchema, type RegistrationFormData} from '@/lib/validation';
import {axiosInstance, queries} from '@/config/api.config';
import {useUserStore} from '@/store/useUserStore';
import FormTextInput from '@/components/inputs/FormTextInput';
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
  const {login} = useUserStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // 1. Create profile
      const authRes = await axiosInstance.post('/auth/register', data);
      const user = authRes.data.data.user;

      // 2. Register for event
      await axiosInstance.post(
        queries.events.endpoints.register(eventId),
        data
      );

      return user;
    },
    onSuccess: (user) => {
      login(user);
      queryClient.invalidateQueries({
        queryKey: [queries.events.queryKeys.detail, eventId],
      });
    },
  });

  const {isPending, isSuccess, isError, error, reset: resetMutation} = mutation;

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleClose = useCallback(() => {
    onCloseRef.current();
    resetForm();
    resetMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: RegistrationFormData) => {
    mutation.mutate(data);
  };

  const getErrorMessage = (): string => {
    if (!error) return 'Something went wrong. Please try again.';
    if ('response' in error && error.response) {
      const resp = error.response as {data?: {message?: string}};
      return resp.data?.message || 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

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
              <FormTextInput
                control={control}
                fieldName='fullName'
                label='Full name'
                placeholder='John Doe'
              />

              <FormTextInput
                control={control}
                fieldName='email'
                label='Email'
                type='email'
                placeholder='john@example.com'
                autoComplete='off'
              />

              <FormTextInput
                control={control}
                fieldName='phone'
                label='Phone'
                type='tel'
                placeholder='+380 99 123 4567'
              />

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
