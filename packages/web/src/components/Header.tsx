'use client';

import {type FC, useState} from 'react';
import Link from 'next/link';
import {useUserStore} from '@/store/useUserStore';
import LoginModal from '@/components/LoginModal';
import ConfirmModal from '@/components/ConfirmModal';

const Header: FC = () => {
  const {user, logout} = useUserStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <header className='border-b border-gray-200 bg-white'>
        <div className='mx-auto flex max-w-4xl items-center justify-between px-4 py-3'>
          <Link href='/events' className='text-lg font-bold text-gray-900'>
            Events
          </Link>

          {user ? (
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white'>
                {user.fullName.charAt(0).toUpperCase()}
              </div>

              <span className='text-sm font-medium text-gray-700'>
                {user.fullName}
              </span>

              <button
                onClick={() => setIsLogoutOpen(true)}
                className='text-sm text-gray-400 hover:text-gray-600'
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className='rounded-md bg-gray-900 px-4 py-1.5 text-sm text-white hover:bg-gray-800'
            >
              Login
            </button>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={logout}
        title='Logout'
        message='Are you sure you want to logout?'
        confirmText='Logout'
      />
    </>
  );
};

export default Header;
