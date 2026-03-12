'use client';

import {type FC, useEffect, useCallback, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLogin, useSignUp} from '@/hooks/useLogin';
import {CloseIcon} from '@/components/icons';
import {cn} from '@/utils/cn';
import {
  loginSchema,
  signUpSchema,
  type LoginFormData,
  type SignUpFormData,
} from '@/lib/validation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: FC<LoginModalProps> = ({isOpen, onClose}) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const loginMutation = useLogin();
  const signUpMutation = useSignUp();

  const mutation = isSignUp ? signUpMutation : loginMutation;
  const {isPending, isSuccess, isError, error} = mutation;

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email: ''},
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {fullName: '', email: '', phone: ''},
  });

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleClose = useCallback(() => {
    onCloseRef.current();
    loginForm.reset();
    signUpForm.reset();
    setIsSignUp(false);
    loginMutation.reset();
    signUpMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [isSuccess, handleClose]);

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

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSignUpSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    loginForm.reset();
    signUpForm.reset();
    loginMutation.reset();
    signUpMutation.reset();
  };

  const getErrorMessage = (): string => {
    if (!error) return 'Something went wrong. Please try again.';
    if ('response' in error && error.response) {
      const resp = error.response as {data?: {message?: string}};
      return resp.data?.message || 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>
            {isSignUp ? 'Sign Up' : 'Login'}
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

        {isSignUp ? (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
            className='space-y-4'
          >
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Full name
              </label>
              <input
                {...signUpForm.register('fullName')}
                type='text'
                placeholder='John Doe'
                autoComplete='off'
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                  signUpForm.formState.errors.fullName
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              {signUpForm.formState.errors.fullName && (
                <p className='mt-1 text-xs text-red-500'>
                  {signUpForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                {...signUpForm.register('email')}
                type='email'
                placeholder='john@example.com'
                autoComplete='off'
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                  signUpForm.formState.errors.email
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              {signUpForm.formState.errors.email && (
                <p className='mt-1 text-xs text-red-500'>
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Phone
              </label>
              <input
                {...signUpForm.register('phone')}
                type='tel'
                placeholder='+380 99 123 4567'
                autoComplete='off'
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                  signUpForm.formState.errors.phone
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              {signUpForm.formState.errors.phone && (
                <p className='mt-1 text-xs text-red-500'>
                  {signUpForm.formState.errors.phone.message}
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
              {isPending ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className='space-y-4'
          >
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                {...loginForm.register('email')}
                type='email'
                placeholder='john@example.com'
                autoComplete='off'
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400',
                  loginForm.formState.errors.email
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              {loginForm.formState.errors.email && (
                <p className='mt-1 text-xs text-red-500'>
                  {loginForm.formState.errors.email.message}
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
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <p className='mt-4 text-center text-sm text-gray-500'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={toggleMode}
            className='font-medium text-gray-900 hover:underline'
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
