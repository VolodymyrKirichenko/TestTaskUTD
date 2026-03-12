'use client';

import {type FC, useEffect, useCallback, useState} from 'react';
import {useLogin, useSignUp} from '@/hooks/useLogin';
import PasswordInput from '@/components/PasswordInput';
import {CloseIcon} from '@/components/icons';
import {cn} from '@/utils/cn';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: FC<LoginModalProps> = ({isOpen, onClose}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const loginMutation = useLogin();
  const signUpMutation = useSignUp();

  const mutation = isSignUp ? signUpMutation : loginMutation;
  const {isPending, isSuccess, isError, error} = mutation;

  const handleClose = useCallback(() => {
    onClose();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setConfirmError('');
    setIsSignUp(false);
    loginMutation.reset();
    signUpMutation.reset();
  }, [onClose, loginMutation, signUpMutation]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setConfirmError('Passwords do not match');
        return;
      }
      signUpMutation.mutate({email, password, fullName});
    } else {
      loginMutation.mutate({email, password});
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setConfirmPassword('');
    setConfirmError('');
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {isSignUp && (
            <div>
              <label
                htmlFor='auth-fullname'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Full name
              </label>

              <input
                id='auth-fullname'
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none',
                  'focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                )}
                placeholder='John Doe'
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor='auth-email'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Email
            </label>

            <input
              id='auth-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='off'
              className={cn(
                'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none',
                'focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
              )}
              placeholder='john@example.com'
              required
            />
          </div>

          <div>
            <label
              htmlFor='auth-password'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Password
            </label>

            <PasswordInput
              id='auth-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
              placeholder='At least 6 characters'
              minLength={6}
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor='auth-confirm-password'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Confirm password
              </label>

              <PasswordInput
                id='auth-confirm-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                hasError={!!confirmError}
                autoComplete='new-password'
                placeholder='Repeat your password'
                required
              />
              {confirmError && (
                <p className='mt-1 text-xs text-red-500'>{confirmError}</p>
              )}
            </div>
          )}

          <button
            type='submit'
            disabled={isPending}
            className={cn(
              'w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white',
              isPending ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-800'
            )}
          >
            {isPending
              ? isSignUp
                ? 'Creating account...'
                : 'Logging in...'
              : isSignUp
                ? 'Sign Up'
                : 'Login'}
          </button>
        </form>

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
