'use client';

import {type FC, useEffect, useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLogin, useSignUp} from '@/hooks/useLogin';
import FormTextInput from '@/components/inputs/FormTextInput';
import FormPasswordInput from '@/components/inputs/FormPasswordInput';
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
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const handleClose = useCallback(() => {
    onClose();
    loginForm.reset();
    signUpForm.reset();
    setIsSignUp(false);
    loginMutation.reset();
    signUpMutation.reset();
  }, [onClose, loginForm, signUpForm, loginMutation, signUpMutation]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [isSuccess, handleClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
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
    if (!error) {
      return 'Something went wrong. Please try again.';
    }

    if ('response' in error && error.response) {
      const resp = error.response as {data?: {message?: string}};

      return resp.data?.message || 'Something went wrong. Please try again.';
    }

    return 'Something went wrong. Please try again.';
  };

  if (!isOpen) {
    return null;
  }

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
            <FormTextInput
              control={signUpForm.control}
              fieldName='fullName'
              label='Full name'
              placeholder='John Doe'
            />

            <FormTextInput
              control={signUpForm.control}
              fieldName='email'
              label='Email'
              type='email'
              placeholder='john@example.com'
              autoComplete='off'
            />

            <FormPasswordInput
              control={signUpForm.control}
              fieldName='password'
              label='Password'
              placeholder='At least 6 characters'
              autoComplete='new-password'
            />

            <FormPasswordInput
              control={signUpForm.control}
              fieldName='confirmPassword'
              label='Confirm password'
              placeholder='Repeat your password'
              autoComplete='new-password'
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
              {isPending ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className='space-y-4'
          >
            <FormTextInput
              control={loginForm.control}
              fieldName='email'
              label='Email'
              type='email'
              placeholder='john@example.com'
              autoComplete='off'
            />

            <FormPasswordInput
              control={loginForm.control}
              fieldName='password'
              label='Password'
              placeholder='At least 6 characters'
              autoComplete='new-password'
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
